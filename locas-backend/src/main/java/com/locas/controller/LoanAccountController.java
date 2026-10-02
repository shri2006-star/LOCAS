package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.LoanAccountResponse;
import com.locas.entity.LoanAccount;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.LoanAccountRepository;
import com.locas.service.DisbursementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "Loans", description = "Active loan account details and portfolio tracking APIs")
public class LoanAccountController {

    private final LoanAccountRepository accountRepository;
    private final DisbursementService disbursementService;

    @GetMapping("/{id}")
    @Operation(summary = "Get Loan Account by ID", description = "Fetch active loan account details")
    public ResponseEntity<ApiResponse<LoanAccountResponse>> getLoanAccountById(@PathVariable Long id) {
        LoanAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.success(disbursementService.mapToResponse(account), "Loan account details retrieved"));
    }

    @GetMapping("/application/{applicationId}")
    @Operation(summary = "Get Loan Account by Application ID", description = "Fetch loan account associated with application")
    public ResponseEntity<ApiResponse<LoanAccountResponse>> getLoanAccountByApplicationId(@PathVariable Long applicationId) {
        LoanAccount account = accountRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found for application id: " + applicationId));
        return ResponseEntity.ok(ApiResponse.success(disbursementService.mapToResponse(account), "Loan account details retrieved"));
    }

    @GetMapping
    @Operation(summary = "Get All Loan Accounts", description = "Fetch active loan accounts in portfolio")
    public ResponseEntity<ApiResponse<List<LoanAccountResponse>>> getAllLoanAccounts() {
        List<LoanAccountResponse> accounts = accountRepository.findAll().stream()
                .map(disbursementService::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(accounts, "Loan accounts retrieved"));
    }
}
