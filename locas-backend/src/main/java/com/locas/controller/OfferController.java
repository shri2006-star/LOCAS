package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.LoanOfferResponse;
import com.locas.security.UserPrincipal;
import com.locas.service.OfferManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
@Tag(name = "Offers", description = "Loan offer generation and acceptance APIs")
public class OfferController {

    private final OfferManagementService offerManagementService;

    @GetMapping("/{id}")
    @Operation(summary = "Get Offer by ID", description = "Fetch loan sanction offer details by offer ID")
    public ResponseEntity<ApiResponse<LoanOfferResponse>> getOfferById(@PathVariable Long id) {
        LoanOfferResponse offer = offerManagementService.getOfferById(id);
        return ResponseEntity.ok(ApiResponse.success(offer, "Loan offer retrieved"));
    }

    @GetMapping("/application/{applicationId}")
    @Operation(summary = "Get Offer by Application ID", description = "Fetch loan sanction offer details for application")
    public ResponseEntity<ApiResponse<LoanOfferResponse>> getOfferByApplicationId(@PathVariable Long applicationId) {
        LoanOfferResponse offer = offerManagementService.getOfferByApplicationId(applicationId);
        return ResponseEntity.ok(ApiResponse.success(offer, "Loan offer retrieved"));
    }

    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept Loan Offer", description = "Applicant accepts sanction terms & conditions")
    public ResponseEntity<ApiResponse<LoanOfferResponse>> acceptOffer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LoanOfferResponse offer = offerManagementService.acceptOffer(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(offer, "Loan offer accepted successfully"));
    }
}
