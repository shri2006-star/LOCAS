package com.locas.controller;

import com.locas.dto.request.DisbursementRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.LoanAccountResponse;
import com.locas.security.UserPrincipal;
import com.locas.service.DisbursementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disbursements")
@RequiredArgsConstructor
@Tag(name = "Disbursement", description = "Loan fund disbursement and account creation APIs")
public class DisbursementController {

    private final DisbursementService disbursementService;

    @PostMapping
    @Operation(summary = "Disburse Loan Funds", description = "Process loan disbursement and create active Loan Account")
    public ResponseEntity<ApiResponse<LoanAccountResponse>> disburseLoan(
            @Valid @RequestBody DisbursementRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LoanAccountResponse account = disbursementService.disburseLoan(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(account, "Loan disbursed and Loan Account " + account.getAccountNumber() + " created successfully"));
    }
}
