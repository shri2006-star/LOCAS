package com.locas.controller;

import com.locas.dto.request.VerificationRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.VerificationResponse;
import com.locas.entity.enums.VerificationStatus;
import com.locas.service.FieldVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
@RequiredArgsConstructor
@Tag(name = "Verification", description = "Field verification (Residence, Employment, Business, Collateral) APIs")
public class FieldVerificationController {

    private final FieldVerificationService verificationService;

    @PostMapping
    @Operation(summary = "Create Field Verification Task", description = "Assign verification task to field agent")
    public ResponseEntity<ApiResponse<VerificationResponse>> createVerification(@Valid @RequestBody VerificationRequest request) {
        VerificationResponse response = verificationService.createVerification(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Field verification task assigned"));
    }

    @GetMapping
    @Operation(summary = "Get All Verifications", description = "Fetch all field verification records")
    public ResponseEntity<ApiResponse<List<VerificationResponse>>> getAllVerifications() {
        List<VerificationResponse> response = verificationService.getAllVerifications();
        return ResponseEntity.ok(ApiResponse.success(response, "Verifications retrieved successfully"));
    }

    @GetMapping("/application/{applicationId}")
    @Operation(summary = "Get Verifications by Application ID", description = "Fetch verifications associated with application")
    public ResponseEntity<ApiResponse<List<VerificationResponse>>> getByApplication(@PathVariable Long applicationId) {
        List<VerificationResponse> response = verificationService.getVerificationsByApplicationId(applicationId);
        return ResponseEntity.ok(ApiResponse.success(response, "Verifications retrieved"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Verification Status", description = "Update verification visit details, findings, status, and GPS coordinates")
    public ResponseEntity<ApiResponse<VerificationResponse>> updateVerification(
            @PathVariable Long id,
            @RequestBody VerificationRequest request) {
        VerificationResponse response = verificationService.updateVerification(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Verification updated successfully"));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete Field Verification", description = "Mark field verification as completed with findings")
    public ResponseEntity<ApiResponse<VerificationResponse>> completeVerification(
            @PathVariable Long id,
            @RequestParam String findings,
            @RequestParam(required = false) String gpsCoordinates) {
        VerificationRequest req = new VerificationRequest();
        req.setStatus(VerificationStatus.COMPLETED);
        req.setFindings(findings);
        req.setGpsCoordinates(gpsCoordinates);

        VerificationResponse response = verificationService.updateVerification(id, req);
        return ResponseEntity.ok(ApiResponse.success(response, "Verification completed successfully"));
    }
}
