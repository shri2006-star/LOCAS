package com.locas.service;

import com.locas.dto.response.LoanOfferResponse;
import com.locas.entity.LoanApplication;
import com.locas.entity.LoanOffer;
import com.locas.entity.enums.ApplicationStatus;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.LoanApplicationRepository;
import com.locas.repository.LoanOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OfferManagementService {

    private final LoanOfferRepository offerRepository;
    private final LoanApplicationRepository applicationRepository;
    private final FinancialCalculatorService financialCalculatorService;
    private final AuditLogService auditLogService;

    @Transactional
    public LoanOfferResponse generateOffer(LoanApplication application, BigDecimal sanctionedAmount, int tenureMonths, BigDecimal interestRate) {
        BigDecimal emi = financialCalculatorService.calculateEmi(sanctionedAmount, interestRate, tenureMonths);
        BigDecimal processingFee = sanctionedAmount.multiply(BigDecimal.valueOf(0.01)).setScale(2, RoundingMode.HALF_UP); // 1% processing fee

        LoanOffer offer = offerRepository.findByApplicationId(application.getId())
                .orElseGet(() -> LoanOffer.builder().application(application).build());

        offer.setSanctionedAmount(sanctionedAmount);
        offer.setTenureMonths(tenureMonths);
        offer.setInterestRate(interestRate);
        offer.setEmiAmount(emi);
        offer.setProcessingFee(processingFee);
        offer.setConditions("1. Standard NACH mandate registration required.\n2. Original property title deed submission for mortgage charge.\n3. Satisfactory field verification completion.");
        offer.setAcceptanceDeadline(LocalDate.now().plusDays(15));
        offer.setStatus("GENERATED");

        offer = offerRepository.save(offer);

        application.setStatus(ApplicationStatus.OFFER_GENERATED);
        applicationRepository.save(application);

        return mapToResponse(offer);
    }

    @Transactional
    public LoanOfferResponse acceptOffer(Long offerId, Long userId) {
        LoanOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan offer not found with id: " + offerId));

        if ("ACCEPTED".equalsIgnoreCase(offer.getStatus())) {
            throw new ValidationException("Loan offer has already been accepted.");
        }

        offer.setStatus("ACCEPTED");
        offer.setAcceptedAt(LocalDateTime.now());
        offer = offerRepository.save(offer);

        LoanApplication application = offer.getApplication();
        application.setStatus(ApplicationStatus.OFFER_ACCEPTED);
        applicationRepository.save(application);

        auditLogService.logAction(userId, "applicant", "OFFER_ACCEPTED", "LoanOffer", offer.getId().toString(), "GENERATED", "ACCEPTED", "127.0.0.1");

        return mapToResponse(offer);
    }

    @Transactional(readOnly = true)
    public LoanOfferResponse getOfferByApplicationId(Long applicationId) {
        LoanOffer offer = offerRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("No offer generated for application id: " + applicationId));
        return mapToResponse(offer);
    }

    @Transactional(readOnly = true)
    public LoanOfferResponse getOfferById(Long id) {
        LoanOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan offer not found with id: " + id));
        return mapToResponse(offer);
    }

    public LoanOfferResponse mapToResponse(LoanOffer offer) {
        return LoanOfferResponse.builder()
                .id(offer.getId())
                .applicationId(offer.getApplication().getId())
                .applicationRef(offer.getApplication().getApplicationRef())
                .sanctionedAmount(offer.getSanctionedAmount())
                .tenureMonths(offer.getTenureMonths())
                .interestRate(offer.getInterestRate())
                .emiAmount(offer.getEmiAmount())
                .processingFee(offer.getProcessingFee())
                .conditions(offer.getConditions())
                .acceptanceDeadline(offer.getAcceptanceDeadline())
                .status(offer.getStatus())
                .createdAt(offer.getCreatedAt())
                .acceptedAt(offer.getAcceptedAt())
                .build();
    }
}
