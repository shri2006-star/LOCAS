package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.CreditScoreResponse;
import com.locas.entity.LoanApplication;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.LoanApplicationRepository;
import com.locas.service.CreditScoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scoring")
@RequiredArgsConstructor
@Tag(name = "Credit Scoring", description = "Automated credit scorecard and risk band classification APIs")
public class CreditScoringController {

    private final CreditScoringService creditScoringService;
    private final LoanApplicationRepository applicationRepository;

    @PostMapping("/calculate/{applicationId}")
    @Operation(summary = "Calculate Credit Scorecard", description = "Compute composite credit score, risk band, and recommendation")
    public ResponseEntity<ApiResponse<CreditScoreResponse>> calculateScore(@PathVariable Long applicationId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        CreditScoreResponse response = creditScoringService.calculateCreditScore(application);
        return ResponseEntity.ok(ApiResponse.success(response, "Credit scoring computed successfully"));
    }

    @GetMapping("/{applicationId}")
    @Operation(summary = "Get Credit Score by Application ID", description = "Fetch credit scorecard evaluation for application")
    public ResponseEntity<ApiResponse<CreditScoreResponse>> getScore(@PathVariable Long applicationId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        CreditScoreResponse response = creditScoringService.calculateCreditScore(application);
        return ResponseEntity.ok(ApiResponse.success(response, "Credit score retrieved"));
    }
}
