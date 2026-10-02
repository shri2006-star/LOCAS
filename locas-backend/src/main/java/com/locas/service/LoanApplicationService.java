package com.locas.service;

import com.locas.dto.request.ApplicationCreateRequest;
import com.locas.dto.response.ApplicationResponse;
import com.locas.dto.response.PagedResponse;
import com.locas.entity.*;
import com.locas.entity.enums.ApplicationStatus;
import com.locas.entity.enums.ProductType;
import com.locas.entity.enums.Role;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository applicationRepository;
    private final ApplicantRepository applicantRepository;
    private final UserRepository userRepository;
    private final CollateralRecordRepository collateralRecordRepository;
    private final CreditPolicyRepository creditPolicyRepository;
    private final FinancialCalculatorService financialCalculatorService;
    private final ApplicantService applicantService;
    private final AuditLogService auditLogService;

    @Transactional
    public ApplicationResponse createApplication(Long userId, ApplicationCreateRequest request) {
        Applicant applicant;
        if (request.getApplicantId() != null) {
            applicant = applicantRepository.findById(request.getApplicantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Applicant not found with id: " + request.getApplicantId()));
        } else {
            applicant = applicantRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        User user = userRepository.findById(userId)
                                .orElseGet(() -> {
                                    User newUser = User.builder()
                                            .username("applicant_user_" + userId)
                                            .email("applicant" + userId + "@locas.bank.com")
                                            .passwordHash("$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K")
                                            .fullName("Applicant User " + userId)
                                            .role(Role.APPLICANT)
                                            .active(true)
                                            .build();
                                    return userRepository.save(newUser);
                                });
                        String tempPan = generateUniquePan();
                        Applicant newApplicant = Applicant.builder()
                                .user(user)
                                .fullName(user.getFullName())
                                .dateOfBirth(java.time.LocalDate.of(1992, 1, 1))
                                .panNumber(tempPan)
                                .aadhaarHash("123456789012")
                                .mobileNumber("9876543210")
                                .email(user.getEmail())
                                .address("Registered Customer Address, Bandra West, Mumbai 400050")
                                .employmentType("SALARIED")
                                .annualIncome(BigDecimal.valueOf(1500000))
                                .existingEmis(BigDecimal.valueOf(15000))
                                .build();
                        return applicantRepository.save(newApplicant);
                    });
        }

        // Generate Application Reference
        String appRef = "APP-" + java.time.Year.now().getValue() + "-" + String.format("%04d", (int)(Math.random() * 10000));

        // Assign Credit Officer automatically
        List<User> officers = userRepository.findByRole(Role.CREDIT_OFFICER);
        User assignedOfficer = officers.isEmpty() ? null : officers.get(0);

        LoanApplication application = LoanApplication.builder()
                .applicationRef(appRef)
                .applicant(applicant)
                .productType(request.getProductType())
                .requestedAmount(request.getRequestedAmount())
                .tenureMonths(request.getTenureMonths())
                .purpose(request.getPurpose() != null ? request.getPurpose() : "General Loan Requirement")
                .status(ApplicationStatus.DRAFT)
                .assignedOfficer(assignedOfficer)
                .build();

        application = applicationRepository.save(application);

        // Add Collateral if provided
        if (request.getCollateralMarketValue() != null && request.getCollateralMarketValue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal ltv = financialCalculatorService.calculateLtv(request.getRequestedAmount(), request.getCollateralMarketValue());
            CollateralRecord collateral = CollateralRecord.builder()
                    .application(application)
                    .collateralType(request.getCollateralType() != null ? request.getCollateralType() : "PROPERTY")
                    .description(request.getCollateralDescription() != null ? request.getCollateralDescription() : "Secured Collateral Property")
                    .marketValue(request.getCollateralMarketValue())
                    .distressValue(request.getCollateralMarketValue().multiply(BigDecimal.valueOf(0.80)))
                    .ltvRatio(ltv)
                    .build();
            collateralRecordRepository.save(collateral);
        }

        auditLogService.logAction(userId, applicant.getUser() != null ? applicant.getUser().getUsername() : "system", "APPLICATION_CREATED", "LoanApplication", application.getId().toString(), null, "Ref: " + appRef + ", Amount: " + request.getRequestedAmount(), "127.0.0.1");

        return mapToResponse(application);
    }

    private String generateUniquePan() {
        String pan;
        do {
            int num = 1000 + (int)(Math.random() * 8999);
            pan = "ABCDE" + num + "X";
        } while (applicantRepository.existsByPanNumber(pan));
        return pan;
    }

    @Transactional
    public ApplicationResponse submitApplication(Long applicationId, Long userId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (application.getStatus() != ApplicationStatus.DRAFT) {
            throw new ValidationException("Only DRAFT applications can be submitted");
        }

        application.setStatus(ApplicationStatus.SUBMITTED);
        application = applicationRepository.save(application);

        auditLogService.logAction(userId, "applicant", "APPLICATION_SUBMITTED", "LoanApplication", application.getId().toString(), "DRAFT", "SUBMITTED", "127.0.0.1");

        return mapToResponse(application);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatus status, Long userId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        String oldStatus = application.getStatus().name();
        application.setStatus(status);
        application = applicationRepository.save(application);

        auditLogService.logAction(userId, "user", "APPLICATION_STATUS_UPDATED", "LoanApplication", application.getId().toString(), oldStatus, status.name(), "127.0.0.1");

        return mapToResponse(application);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        LoanApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return mapToResponse(application);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getApplications(ApplicationStatus status, ProductType productType, Long officerId, String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LoanApplication> appPage = applicationRepository.searchApplications(status, productType, officerId, search, pageable);
        List<ApplicationResponse> content = appPage.getContent().stream().map(this::mapToResponse).collect(Collectors.toList());

        return PagedResponse.of(content, appPage.getNumber(), appPage.getSize(), appPage.getTotalElements(), appPage.getTotalPages(), "Applications retrieved successfully");
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForApplicant(Long userId) {
        Applicant applicant = applicantRepository.findByUserId(userId).orElse(null);
        if (applicant == null) {
            return java.util.Collections.emptyList();
        }

        return applicationRepository.findByApplicantIdOrderByIdDesc(applicant.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse mapToResponse(LoanApplication app) {
        CreditPolicy policy = creditPolicyRepository.findByProductType(app.getProductType()).orElse(null);
        BigDecimal interestRate = policy != null ? policy.getBaseInterestRate() : BigDecimal.valueOf(10.0);

        BigDecimal estEmi = financialCalculatorService.calculateEmi(app.getRequestedAmount(), interestRate, app.getTenureMonths());
        BigDecimal annualIncome = (app.getApplicant() != null && app.getApplicant().getAnnualIncome() != null)
                ? app.getApplicant().getAnnualIncome()
                : BigDecimal.valueOf(1200000);
        BigDecimal monthlyIncome = annualIncome.divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal existingEmis = (app.getApplicant() != null && app.getApplicant().getExistingEmis() != null)
                ? app.getApplicant().getExistingEmis()
                : BigDecimal.ZERO;
        BigDecimal foir = financialCalculatorService.calculateFoir(monthlyIncome, existingEmis, estEmi);

        List<CollateralRecord> collaterals = collateralRecordRepository.findByApplicationId(app.getId());
        BigDecimal ltv = BigDecimal.ZERO;
        if (!collaterals.isEmpty()) {
            BigDecimal totalMarketValue = collaterals.stream().map(CollateralRecord::getMarketValue).reduce(BigDecimal.ZERO, BigDecimal::add);
            ltv = financialCalculatorService.calculateLtv(app.getRequestedAmount(), totalMarketValue);
        }

        String riskBandStr = "REVIEW";
        if (app.getScorecardScore() != null) {
            riskBandStr = app.getScorecardScore() >= 70 ? "APPROVE" : (app.getScorecardScore() >= 50 ? "REVIEW" : "DECLINE");
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .applicationRef(app.getApplicationRef())
                .applicant(applicantService.mapToResponse(app.getApplicant()))
                .productType(app.getProductType())
                .requestedAmount(app.getRequestedAmount())
                .tenureMonths(app.getTenureMonths())
                .purpose(app.getPurpose())
                .status(app.getStatus())
                .assignedOfficerId(app.getAssignedOfficer() != null ? app.getAssignedOfficer().getId() : null)
                .assignedOfficerName(app.getAssignedOfficer() != null ? app.getAssignedOfficer().getFullName() : "Unassigned")
                .creditScore(app.getCreditScore())
                .scorecardScore(app.getScorecardScore())
                .riskBand(riskBandStr)
                .decisionDate(app.getDecisionDate())
                .decidedByName(app.getDecidedBy() != null ? app.getDecidedBy().getFullName() : null)
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .foirPercentage(foir)
                .ltvPercentage(ltv)
                .estimatedEmi(estEmi)
                .build();
    }
}
