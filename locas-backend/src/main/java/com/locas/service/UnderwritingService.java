package com.locas.service;

import com.locas.dto.request.UnderwritingDecisionRequest;
import com.locas.dto.response.ApplicationResponse;
import com.locas.entity.BureauReport;
import com.locas.entity.CreditDecision;
import com.locas.entity.LoanApplication;
import com.locas.entity.User;
import com.locas.entity.enums.ApplicationStatus;
import com.locas.entity.enums.DecisionType;
import com.locas.entity.enums.Role;
import com.locas.exception.ForbiddenException;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.BureauReportRepository;
import com.locas.repository.CreditDecisionRepository;
import com.locas.repository.LoanApplicationRepository;
import com.locas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UnderwritingService {

    private final LoanApplicationRepository applicationRepository;
    private final CreditDecisionRepository decisionRepository;
    private final BureauReportRepository bureauReportRepository;
    private final UserRepository userRepository;
    private final LoanApplicationService applicationService;
    private final OfferManagementService offerManagementService;
    private final AuditLogService auditLogService;

    private static final BigDecimal HIGH_VALUE_THRESHOLD = BigDecimal.valueOf(1000000.00); // 10 Lakhs

    @Transactional
    public ApplicationResponse processUnderwritingDecision(Long applicationId, Long userId, UnderwritingDecisionRequest request) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Rule: Rationale mandatory for all decisions
        if (request.getRationale() == null || request.getRationale().trim().isEmpty()) {
            throw new ValidationException("Mandatory rationale is required for credit underwriting decisions.");
        }

        // Rule: Cannot approve application without at least one Bureau report
        List<BureauReport> bureauReports = bureauReportRepository.findByApplicationId(applicationId);
        if ((request.getDecisionType() == DecisionType.APPROVE || request.getDecisionType() == DecisionType.RECOMMEND) && bureauReports.isEmpty()) {
            throw new ValidationException("Application cannot be approved or recommended without at least one bureau report.");
        }

        // Maker-Checker Rule enforcement:
        // Loans above INR 10 Lakh require Credit Head approval.
        boolean isHighValue = application.getRequestedAmount().compareTo(HIGH_VALUE_THRESHOLD) > 0;

        if (request.getDecisionType() == DecisionType.APPROVE) {
            if (isHighValue && user.getRole() == Role.CREDIT_OFFICER) {
                throw new ForbiddenException("Loans above INR 10 Lakh require Credit Head approval (Maker-Checker policy). Please submit as RECOMMEND.");
            }
        }

        // Create decision record
        CreditDecision decision = CreditDecision.builder()
                .application(application)
                .decisionType(request.getDecisionType())
                .recommendedAmount(request.getRecommendedAmount())
                .recommendedTenure(request.getRecommendedTenure())
                .roi(request.getRoi())
                .decidedBy(user)
                .decisionDate(LocalDateTime.now())
                .rationale(request.getRationale())
                .deviations(request.getDeviations())
                .build();

        decisionRepository.save(decision);

        // Update application state
        String oldStatus = application.getStatus().name();

        if (request.getDecisionType() == DecisionType.RECOMMEND) {
            application.setStatus(ApplicationStatus.RECOMMENDED);
        } else if (request.getDecisionType() == DecisionType.APPROVE) {
            application.setStatus(ApplicationStatus.APPROVED);
            application.setDecisionDate(LocalDateTime.now());
            application.setDecidedBy(user);

            // Automatically generate Loan Offer upon approval
            offerManagementService.generateOffer(application, request.getRecommendedAmount(), request.getRecommendedTenure(), request.getRoi());

        } else if (request.getDecisionType() == DecisionType.DECLINE) {
            application.setStatus(ApplicationStatus.DECLINED);
            application.setDecisionDate(LocalDateTime.now());
            application.setDecidedBy(user);
        } else if (request.getDecisionType() == DecisionType.REQUEST_CLARIFICATION || request.getDecisionType() == DecisionType.SEND_BACK) {
            application.setStatus(ApplicationStatus.UNDER_REVIEW);
        }

        application = applicationRepository.save(application);

        auditLogService.logAction(userId, user.getUsername(), "CREDIT_DECISION_" + request.getDecisionType(), "LoanApplication", application.getId().toString(), oldStatus, application.getStatus().name(), "127.0.0.1");

        return applicationService.mapToResponse(application);
    }
}
