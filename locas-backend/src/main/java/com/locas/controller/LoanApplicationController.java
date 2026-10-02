package com.locas.controller;

import com.locas.dto.request.ApplicationCreateRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.ApplicationResponse;
import com.locas.dto.response.PagedResponse;
import com.locas.entity.DocumentEntity;
import com.locas.entity.enums.ApplicationStatus;
import com.locas.entity.enums.ProductType;
import com.locas.security.UserPrincipal;
import com.locas.service.FileStorageService;
import com.locas.service.LoanApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Loan application lifecycle management APIs")
public class LoanApplicationController {

    private final LoanApplicationService applicationService;
    private final FileStorageService fileStorageService;

    @PostMapping
    @Operation(summary = "Create Loan Application", description = "Create a new loan application draft")
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ApplicationCreateRequest request) {
        ApplicationResponse response = applicationService.createApplication(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan application created successfully"));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit Loan Application", description = "Submit application for credit review")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationResponse response = applicationService.submitApplication(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Application submitted for underwriting review"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Application by ID", description = "Fetch complete application details including financial metrics")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(@PathVariable Long id) {
        ApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Application details retrieved successfully"));
    }

    @GetMapping
    @Operation(summary = "Search Applications", description = "Filter, search, and paginate loan applications")
    public ResponseEntity<PagedResponse<ApplicationResponse>> getApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) ProductType productType,
            @RequestParam(required = false) Long officerId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<ApplicationResponse> response = applicationService.getApplications(status, productType, officerId, search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-applications")
    @Operation(summary = "Get Applicant's Applications", description = "Fetch all loan applications submitted by logged-in applicant")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationResponse> response = applicationService.getApplicationsForApplicant(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Applications retrieved"));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update Application Status", description = "Change application status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationResponse response = applicationService.updateStatus(id, status, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Status updated to " + status));
    }

    @PostMapping(value = "/{id}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload Document", description = "Upload KYC/Income proof/Property document for application")
    public ResponseEntity<ApiResponse<DocumentEntity>> uploadDocument(
            @PathVariable Long id,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        DocumentEntity doc = fileStorageService.storeFile(id, documentType, file);
        return ResponseEntity.ok(ApiResponse.success(doc, "Document uploaded successfully"));
    }

    @GetMapping("/{id}/documents")
    @Operation(summary = "Get Application Documents", description = "Fetch all uploaded documents for application")
    public ResponseEntity<ApiResponse<List<DocumentEntity>>> getDocuments(@PathVariable Long id) {
        List<DocumentEntity> docs = fileStorageService.getDocumentsForApplication(id);
        return ResponseEntity.ok(ApiResponse.success(docs, "Documents retrieved successfully"));
    }
}
