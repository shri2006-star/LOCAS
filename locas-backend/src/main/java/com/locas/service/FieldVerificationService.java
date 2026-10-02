package com.locas.service;

import com.locas.dto.request.VerificationRequest;
import com.locas.dto.response.VerificationResponse;
import com.locas.entity.FieldVerification;
import com.locas.entity.LoanApplication;
import com.locas.entity.User;
import com.locas.entity.enums.VerificationStatus;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.FieldVerificationRepository;
import com.locas.repository.LoanApplicationRepository;
import com.locas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FieldVerificationService {

    private final FieldVerificationRepository verificationRepository;
    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public VerificationResponse createVerification(VerificationRequest request) {
        LoanApplication application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

        User assignedTo = request.getAssignedToId() != null ?
                userRepository.findById(request.getAssignedToId()).orElse(null) : null;

        FieldVerification verification = FieldVerification.builder()
                .application(application)
                .verificationType(request.getVerificationType())
                .assignedTo(assignedTo)
                .visitDate(request.getVisitDate())
                .status(request.getStatus() != null ? request.getStatus() : VerificationStatus.PENDING)
                .findings(request.getFindings())
                .gpsCoordinates(request.getGpsCoordinates())
                .documentUrl(request.getDocumentUrl())
                .build();

        verification = verificationRepository.save(verification);

        return mapToResponse(verification);
    }

    @Transactional
    public VerificationResponse updateVerification(Long id, VerificationRequest request) {
        FieldVerification verification = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification not found with id: " + id));

        if (request.getStatus() != null) {
            verification.setStatus(request.getStatus());
        }
        if (request.getFindings() != null) {
            verification.setFindings(request.getFindings());
        }
        if (request.getGpsCoordinates() != null) {
            verification.setGpsCoordinates(request.getGpsCoordinates());
        }
        if (request.getVisitDate() != null) {
            verification.setVisitDate(request.getVisitDate());
        }

        verification = verificationRepository.save(verification);
        return mapToResponse(verification);
    }

    @Transactional(readOnly = true)
    public List<VerificationResponse> getVerificationsByApplicationId(Long applicationId) {
        return verificationRepository.findByApplicationId(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<VerificationResponse> getAllVerifications() {
        List<FieldVerification> list = verificationRepository.findAll();

        // Auto-seed default field verification tasks if table is empty
        if (list.isEmpty()) {
            List<LoanApplication> applications = applicationRepository.findAll();
            User verifier = userRepository.findByRole(com.locas.entity.enums.Role.FIELD_VERIFIER).stream().findFirst().orElse(null);

            if (!applications.isEmpty()) {
                LoanApplication app1 = applications.get(0);
                FieldVerification v1 = FieldVerification.builder()
                        .application(app1)
                        .verificationType(com.locas.entity.enums.VerificationType.RESIDENCE)
                        .assignedTo(verifier)
                        .visitDate(java.time.LocalDate.now())
                        .status(VerificationStatus.PENDING)
                        .findings("Physical residence site visit scheduled for applicant " + app1.getApplicant().getFullName() + " at Bandra West.")
                        .gpsCoordinates("19.0596° N, 72.8295° E")
                        .build();

                FieldVerification v2 = FieldVerification.builder()
                        .application(app1)
                        .verificationType(com.locas.entity.enums.VerificationType.EMPLOYMENT)
                        .assignedTo(verifier)
                        .visitDate(java.time.LocalDate.now().plusDays(1))
                        .status(VerificationStatus.PENDING)
                        .findings("Office premises & HR employment verification visit for TCS BKC.")
                        .gpsCoordinates("19.0674° N, 72.8710° E")
                        .build();

                verificationRepository.save(v1);
                verificationRepository.save(v2);

                if (applications.size() > 1) {
                    LoanApplication app2 = applications.get(1);
                    FieldVerification v3 = FieldVerification.builder()
                            .application(app2)
                            .verificationType(com.locas.entity.enums.VerificationType.COLLATERAL_VALUATION)
                            .assignedTo(verifier)
                            .visitDate(java.time.LocalDate.now().plusDays(2))
                            .status(VerificationStatus.IN_PROGRESS)
                            .findings("Property valuation inspection for Thane residential flat.")
                            .gpsCoordinates("19.2183° N, 72.9781° E")
                            .build();
                    verificationRepository.save(v3);
                }

                list = verificationRepository.findAll();
            }
        }

        return list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VerificationResponse mapToResponse(FieldVerification v) {
        return VerificationResponse.builder()
                .id(v.getId())
                .applicationId(v.getApplication().getId())
                .applicationRef(v.getApplication().getApplicationRef())
                .applicantName(v.getApplication().getApplicant().getFullName())
                .verificationType(v.getVerificationType())
                .assignedToName(v.getAssignedTo() != null ? v.getAssignedTo().getFullName() : "Unassigned")
                .assignedToId(v.getAssignedTo() != null ? v.getAssignedTo().getId() : null)
                .assignedDate(v.getAssignedDate())
                .visitDate(v.getVisitDate())
                .status(v.getStatus())
                .findings(v.getFindings())
                .gpsCoordinates(v.getGpsCoordinates())
                .documentUrl(v.getDocumentUrl())
                .build();
    }
}
