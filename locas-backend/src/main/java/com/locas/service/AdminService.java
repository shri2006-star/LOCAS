package com.locas.service;

import com.locas.dto.response.AuditLogResponse;
import com.locas.dto.response.PagedResponse;
import com.locas.dto.response.UserResponse;
import com.locas.entity.Applicant;
import com.locas.entity.AuditLog;
import com.locas.entity.CreditPolicy;
import com.locas.entity.LoanApplication;
import com.locas.entity.User;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ApplicantRepository applicantRepository;
    private final LoanApplicationRepository applicationRepository;
    private final CollateralRecordRepository collateralRecordRepository;
    private final DocumentRepository documentRepository;
    private final CreditDecisionRepository creditDecisionRepository;
    private final LoanOfferRepository loanOfferRepository;
    private final FieldVerificationRepository fieldVerificationRepository;
    private final BureauReportRepository bureauReportRepository;
    private final LoanAccountRepository loanAccountRepository;
    private final EmiPaymentRepository emiPaymentRepository;
    private final EarlyWarningRepository earlyWarningRepository;
    private final CreditPolicyRepository creditPolicyRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .email(u.getEmail())
                        .fullName(u.getFullName())
                        .role(u.getRole())
                        .active(u.getActive())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CreditPolicy saveCreditPolicy(CreditPolicy policy) {
        return creditPolicyRepository.save(policy);
    }

    @Transactional(readOnly = true)
    public List<CreditPolicy> getAllCreditPolicies() {
        return creditPolicyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLogResponse> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logPage = auditLogRepository.findAllByOrderByTimestampDesc(pageable);

        List<AuditLogResponse> logs = logPage.getContent().stream()
                .map(l -> AuditLogResponse.builder()
                        .id(l.getId())
                        .userId(l.getUserId())
                        .username(l.getUsername())
                        .action(l.getAction())
                        .entityType(l.getEntityType())
                        .entityId(l.getEntityId())
                        .oldValue(l.getOldValue())
                        .newValue(l.getNewValue())
                        .ipAddress(l.getIpAddress())
                        .timestamp(l.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        return PagedResponse.of(logs, logPage.getNumber(), logPage.getSize(), logPage.getTotalElements(), logPage.getTotalPages(), "Audit logs fetched successfully");
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        applicantRepository.findByUserId(userId).ifPresent(this::deleteApplicantCascade);

        userRepository.delete(user);
    }

    @Transactional
    public void deleteApplication(Long applicationId) {
        LoanApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        Applicant applicant = app.getApplicant();
        User user = applicant != null ? applicant.getUser() : null;

        deleteLoanApplicationCascade(app);

        if (applicant != null) {
            List<LoanApplication> remainingApps = applicationRepository.findByApplicantId(applicant.getId());
            if (remainingApps.isEmpty()) {
                applicantRepository.delete(applicant);
                if (user != null) {
                    userRepository.delete(user);
                }
            }
        }
    }

    private void deleteApplicantCascade(Applicant applicant) {
        List<LoanApplication> apps = applicationRepository.findByApplicantId(applicant.getId());
        for (LoanApplication app : apps) {
            deleteLoanApplicationCascade(app);
        }
        applicantRepository.delete(applicant);
    }

    private void deleteLoanApplicationCascade(LoanApplication app) {
        Long appId = app.getId();

        collateralRecordRepository.deleteAll(collateralRecordRepository.findByApplicationId(appId));
        documentRepository.deleteAll(documentRepository.findByApplicationId(appId));
        creditDecisionRepository.deleteAll(creditDecisionRepository.findByApplicationIdOrderByDecisionDateDesc(appId));
        loanOfferRepository.findByApplicationId(appId).ifPresent(loanOfferRepository::delete);
        fieldVerificationRepository.deleteAll(fieldVerificationRepository.findByApplicationId(appId));
        bureauReportRepository.deleteAll(bureauReportRepository.findByApplicationId(appId));

        loanAccountRepository.findByApplicationId(appId).ifPresent(account -> {
            emiPaymentRepository.deleteAll(emiPaymentRepository.findByLoanAccountIdOrderByDueDateAsc(account.getId()));
            earlyWarningRepository.deleteAll(earlyWarningRepository.findByLoanAccountId(account.getId()));
            loanAccountRepository.delete(account);
        });

        applicationRepository.delete(app);
    }
}
