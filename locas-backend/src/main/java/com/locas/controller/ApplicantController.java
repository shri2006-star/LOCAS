package com.locas.controller;

import com.locas.dto.request.ApplicantRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.ApplicantResponse;
import com.locas.security.UserPrincipal;
import com.locas.service.ApplicantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
@Tag(name = "Applicants", description = "Applicant profile, KYC details and management APIs")
public class ApplicantController {

    private final ApplicantService applicantService;

    @PostMapping
    @Operation(summary = "Create/Update Applicant Profile", description = "Save personal, employment, and income details")
    public ResponseEntity<ApiResponse<ApplicantResponse>> saveApplicantProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ApplicantRequest request) {
        ApplicantResponse response = applicantService.createOrUpdateApplicant(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Applicant profile saved successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Logged In Applicant Profile", description = "Fetch profile of current authenticated applicant")
    public ResponseEntity<ApiResponse<ApplicantResponse>> getMyApplicantProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicantResponse response = applicantService.getApplicantByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Applicant profile retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Applicant By ID", description = "Fetch applicant profile details by applicant ID")
    public ResponseEntity<ApiResponse<ApplicantResponse>> getApplicantById(@PathVariable Long id) {
        ApplicantResponse response = applicantService.getApplicantById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Applicant profile retrieved successfully"));
    }
}
