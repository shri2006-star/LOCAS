package com.locas.service;

import com.locas.dto.request.EmiPaymentRequest;
import com.locas.dto.response.EmiScheduleResponse;
import com.locas.entity.EmiPayment;
import com.locas.entity.LoanAccount;
import com.locas.entity.enums.NpaCategory;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.EmiPaymentRepository;
import com.locas.repository.LoanAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmiService {

    private final LoanAccountRepository accountRepository;
    private final EmiPaymentRepository emiPaymentRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public List<EmiScheduleResponse> getEmiSchedule(Long loanAccountId) {
        LoanAccount account = accountRepository.findById(loanAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found with id: " + loanAccountId));

        List<EmiPayment> payments = emiPaymentRepository.findByLoanAccountIdOrderByDueDateAsc(loanAccountId);

        // Auto-generate schedule if no payments exist yet for active loan
        if (payments.isEmpty() && account.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
            LocalDate baseDate = account.getNextDueDate() != null ? account.getNextDueDate() : LocalDate.now();
            for (int i = 0; i < 12; i++) {
                EmiPayment p = EmiPayment.builder()
                        .loanAccount(account)
                        .dueDate(baseDate.plusMonths(i))
                        .paidAmount(BigDecimal.ZERO)
                        .principalPaid(BigDecimal.ZERO)
                        .interestPaid(BigDecimal.ZERO)
                        .bounceFlag(i == 0 && account.getDpd() > 0)
                        .status(i == 0 && account.getDpd() > 0 ? "OVERDUE" : "PENDING")
                        .build();
                payments.add(emiPaymentRepository.save(p));
            }
        }

        BigDecimal balance = account.getDisbursedAmount();
        List<EmiScheduleResponse> result = new java.util.ArrayList<>();

        int instNum = 1;
        for (EmiPayment p : payments) {
            BigDecimal principalPaid = p.getPrincipalPaid() != null ? p.getPrincipalPaid() : BigDecimal.ZERO;
            BigDecimal interestPaid = p.getInterestPaid() != null ? p.getInterestPaid() : BigDecimal.ZERO;
            BigDecimal emiAmt = (p.getLoanAccount() != null && p.getLoanAccount().getEmiAmount() != null)
                    ? p.getLoanAccount().getEmiAmount()
                    : BigDecimal.ZERO;

            if ("PAID".equalsIgnoreCase(p.getStatus())) {
                balance = balance.subtract(principalPaid).max(BigDecimal.ZERO);
            }
            result.add(EmiScheduleResponse.builder()
                    .id(p.getId())
                    .installmentNumber(instNum++)
                    .dueDate(p.getDueDate())
                    .paidDate(p.getPaidDate())
                    .emiAmount(emiAmt)
                    .principalPaid(principalPaid)
                    .interestPaid(interestPaid)
                    .outstandingBalance(balance)
                    .status(p.getStatus())
                    .bounceFlag(p.getBounceFlag() != null ? p.getBounceFlag() : false)
                    .paymentMode(p.getPaymentMode())
                    .build());
        }

        return result;
    }

    @Transactional
    public EmiScheduleResponse recordPayment(Long loanAccountId, EmiPaymentRequest request, Long userId) {
        LoanAccount account = accountRepository.findById(loanAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found with id: " + loanAccountId));

        List<EmiPayment> pendingPayments = emiPaymentRepository.findByLoanAccountIdOrderByDueDateAsc(loanAccountId).stream()
                .filter(p -> "PENDING".equalsIgnoreCase(p.getStatus()) || "OVERDUE".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.toList());

        // Auto-create next pending payment installment if loan is active but schedule table had no pending entry
        if (pendingPayments.isEmpty()) {
            if (account.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
                LocalDate nextDate = account.getNextDueDate() != null ? account.getNextDueDate() : LocalDate.now();
                EmiPayment newPayment = EmiPayment.builder()
                        .loanAccount(account)
                        .dueDate(nextDate)
                        .paidAmount(BigDecimal.ZERO)
                        .principalPaid(BigDecimal.ZERO)
                        .interestPaid(BigDecimal.ZERO)
                        .bounceFlag(false)
                        .status("PENDING")
                        .build();
                pendingPayments.add(emiPaymentRepository.save(newPayment));
            } else {
                throw new ValidationException("Loan account " + account.getAccountNumber() + " is already fully paid off! Outstanding principal is ₹0.00.");
            }
        }

        EmiPayment currentPayment = pendingPayments.get(0);

        // Interest split calculation
        BigDecimal monthlyRate = account.getInterestRate().divide(BigDecimal.valueOf(1200), 6, RoundingMode.HALF_UP);
        BigDecimal interestPart = account.getOutstandingPrincipal().multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal principalPart = request.getAmount().subtract(interestPart).max(BigDecimal.ZERO);

        currentPayment.setPaidAmount(request.getAmount());
        currentPayment.setPrincipalPaid(principalPart);
        currentPayment.setInterestPaid(interestPart);
        currentPayment.setPaidDate(LocalDate.now());
        currentPayment.setPaymentMode(request.getPaymentMode());
        currentPayment.setStatus("PAID");

        currentPayment = emiPaymentRepository.save(currentPayment);

        // Reduce outstanding balance and reset DPD if all due cleared
        BigDecimal newBalance = account.getOutstandingPrincipal().subtract(principalPart).max(BigDecimal.ZERO);
        account.setOutstandingPrincipal(newBalance);
        account.setDpd(0);
        account.setNpaCategory(NpaCategory.STANDARD);
        if (pendingPayments.size() > 1) {
            account.setNextDueDate(pendingPayments.get(1).getDueDate());
        } else {
            account.setNextDueDate(currentPayment.getDueDate().plusMonths(1));
        }
        accountRepository.save(account);

        auditLogService.logAction(userId, "borrower", "EMI_PAYMENT_RECORDED", "LoanAccount", account.getId().toString(), null, "Paid: " + request.getAmount() + ", Mode: " + request.getPaymentMode(), "127.0.0.1");

        return EmiScheduleResponse.builder()
                .id(currentPayment.getId())
                .dueDate(currentPayment.getDueDate())
                .paidDate(currentPayment.getPaidDate())
                .emiAmount(account.getEmiAmount())
                .principalPaid(principalPart)
                .interestPaid(interestPart)
                .outstandingBalance(newBalance)
                .status("PAID")
                .bounceFlag(false)
                .paymentMode(request.getPaymentMode())
                .build();
    }
}
