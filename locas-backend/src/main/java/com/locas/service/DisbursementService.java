package com.locas.service;

import com.locas.dto.request.DisbursementRequest;
import com.locas.dto.response.LoanAccountResponse;
import com.locas.entity.EmiPayment;
import com.locas.entity.LoanApplication;
import com.locas.entity.LoanAccount;
import com.locas.entity.LoanOffer;
import com.locas.entity.enums.ApplicationStatus;
import com.locas.entity.enums.NpaCategory;
import com.locas.exception.ApplicationAlreadyDisbursedException;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.EmiPaymentRepository;
import com.locas.repository.LoanAccountRepository;
import com.locas.repository.LoanApplicationRepository;
import com.locas.repository.LoanOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DisbursementService {

    private final LoanApplicationRepository applicationRepository;
    private final LoanOfferRepository offerRepository;
    private final LoanAccountRepository accountRepository;
    private final EmiPaymentRepository emiPaymentRepository;
    private final FinancialCalculatorService financialCalculatorService;
    private final AuditLogService auditLogService;

    @Transactional
    public LoanAccountResponse disburseLoan(DisbursementRequest request, Long userId) {
        LoanApplication application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

        // Prevent double disbursement
        if (application.getStatus() == ApplicationStatus.DISBURSED || accountRepository.existsByApplicationId(application.getId())) {
            throw new ApplicationAlreadyDisbursedException("Application " + application.getApplicationRef() + " has already been disbursed!");
        }

        LoanOffer offer = offerRepository.findByApplicationId(application.getId())
                .orElseThrow(() -> new ValidationException("No valid loan offer found for application " + application.getApplicationRef()));

        if (!"ACCEPTED".equalsIgnoreCase(offer.getStatus())) {
            throw new ValidationException("Loan offer must be accepted by applicant prior to disbursement.");
        }

        // Validate disbursement amount vs sanctioned amount
        if (request.getDisbursementAmount().compareTo(offer.getSanctionedAmount()) > 0) {
            throw new ValidationException("Disbursed amount (" + request.getDisbursementAmount() + ") cannot exceed sanctioned amount (" + offer.getSanctionedAmount() + ").");
        }

        // Create Loan Account (Enforces 1:1 UNIQUE application_id constraint)
        String accountNumber = "LN" + String.format("%010d", System.currentTimeMillis() % 10000000000L);
        LocalDate startDate = LocalDate.now();
        LocalDate maturityDate = startDate.plusMonths(offer.getTenureMonths());
        LocalDate nextDueDate = startDate.plusMonths(1).withDayOfMonth(5);

        LoanAccount account = LoanAccount.builder()
                .application(application)
                .accountNumber(accountNumber)
                .disbursedAmount(request.getDisbursementAmount())
                .outstandingPrincipal(request.getDisbursementAmount())
                .interestRate(offer.getInterestRate())
                .emiAmount(offer.getEmiAmount())
                .emiDueDate(5)
                .nextDueDate(nextDueDate)
                .dpd(0)
                .npaCategory(NpaCategory.STANDARD)
                .nachMandateStatus("ACTIVE")
                .maturityDate(maturityDate)
                .build();

        account = accountRepository.save(account);

        // Generate EMI payments schedule
        var schedule = financialCalculatorService.generateAmortizationSchedule(
                request.getDisbursementAmount(),
                offer.getInterestRate(),
                offer.getTenureMonths(),
                startDate
        );

        for (var s : schedule) {
            EmiPayment payment = EmiPayment.builder()
                    .loanAccount(account)
                    .dueDate(s.getDueDate())
                    .paidAmount(BigDecimal.ZERO)
                    .principalPaid(BigDecimal.ZERO)
                    .interestPaid(BigDecimal.ZERO)
                    .bounceFlag(false)
                    .status("PENDING")
                    .build();
            emiPaymentRepository.save(payment);
        }

        // Update application status
        application.setStatus(ApplicationStatus.DISBURSED);
        applicationRepository.save(application);

        auditLogService.logAction(userId, "disbursement_officer", "LOAN_DISBURSED", "LoanAccount", account.getId().toString(), null, "Account: " + accountNumber + ", Amount: " + request.getDisbursementAmount(), "127.0.0.1");

        return mapToResponse(account);
    }

    public LoanAccountResponse mapToResponse(LoanAccount account) {
        return LoanAccountResponse.builder()
                .id(account.getId())
                .applicationId(account.getApplication().getId())
                .applicationRef(account.getApplication().getApplicationRef())
                .applicantName(account.getApplication().getApplicant().getFullName())
                .accountNumber(account.getAccountNumber())
                .disbursedAmount(account.getDisbursedAmount())
                .outstandingPrincipal(account.getOutstandingPrincipal())
                .interestRate(account.getInterestRate())
                .emiAmount(account.getEmiAmount())
                .emiDueDate(account.getEmiDueDate())
                .nextDueDate(account.getNextDueDate())
                .dpd(account.getDpd())
                .npaCategory(account.getNpaCategory())
                .nachMandateStatus(account.getNachMandateStatus())
                .maturityDate(account.getMaturityDate())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
