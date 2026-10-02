package com.locas.service;

import com.locas.dto.request.ApplicantRequest;
import com.locas.dto.response.ApplicantResponse;
import com.locas.entity.Applicant;
import com.locas.entity.User;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.ApplicantRepository;
import com.locas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ApplicantResponse getApplicantByUserId(Long userId) {
        Applicant applicant = applicantRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant profile not found for user ID: " + userId));
        return mapToResponse(applicant);
    }

    @Transactional(readOnly = true)
    public ApplicantResponse getApplicantById(Long id) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found with ID: " + id));
        return mapToResponse(applicant);
    }

    @Transactional
    public ApplicantResponse createOrUpdateApplicant(Long userId, ApplicantRequest request) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username("applicant_user_" + userId)
                            .email("applicant" + userId + "@locas.bank.com")
                            .passwordHash("$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K")
                            .fullName(request.getFullName() != null ? request.getFullName() : ("Applicant " + userId))
                            .role(com.locas.entity.enums.Role.APPLICANT)
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });

        Applicant applicant = applicantRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Applicant newApplicant = new Applicant();
                    newApplicant.setUser(user);
                    return newApplicant;
                });

        String formattedPan = request.getPanNumber() != null ? request.getPanNumber().trim().toUpperCase() : "";

        // Check if PAN belongs to another applicant
        applicantRepository.findByPanNumber(formattedPan)
                .ifPresent(existing -> {
                    if (applicant.getId() == null || !existing.getId().equals(applicant.getId())) {
                        throw new ValidationException("PAN Number " + formattedPan + " is already registered to another applicant.");
                    }
                });

        applicant.setFullName(request.getFullName());
        applicant.setDateOfBirth(request.getDateOfBirth());
        applicant.setPanNumber(formattedPan);
        applicant.setAadhaarHash(request.getAadhaarNumber());
        applicant.setMobileNumber(request.getMobileNumber());
        applicant.setEmail(request.getEmail());
        applicant.setAddress(request.getAddress());
        applicant.setEmploymentType(request.getEmploymentType());
        applicant.setAnnualIncome(request.getAnnualIncome());
        applicant.setExistingEmis(request.getExistingEmis() != null ? request.getExistingEmis() : java.math.BigDecimal.ZERO);

        try {
            Applicant saved = applicantRepository.save(applicant);
            return mapToResponse(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ValidationException("PAN Number " + formattedPan + " or Email is already registered to another applicant.");
        }
    }

    public ApplicantResponse mapToResponse(Applicant applicant) {
        return ApplicantResponse.builder()
                .id(applicant.getId())
                .userId(applicant.getUser() != null ? applicant.getUser().getId() : null)
                .fullName(applicant.getFullName())
                .dateOfBirth(applicant.getDateOfBirth())
                .maskedPan(applicant.getMaskedPan())
                .maskedAadhaar(applicant.getMaskedAadhaar())
                .mobileNumber(applicant.getMobileNumber())
                .email(applicant.getEmail())
                .address(applicant.getAddress())
                .employmentType(applicant.getEmploymentType())
                .annualIncome(applicant.getAnnualIncome())
                .existingEmis(applicant.getExistingEmis())
                .createdAt(applicant.getCreatedAt())
                .build();
    }
}
