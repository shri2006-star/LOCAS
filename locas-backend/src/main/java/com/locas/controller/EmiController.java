package com.locas.controller;

import com.locas.dto.request.EmiPaymentRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.EmiScheduleResponse;
import com.locas.security.UserPrincipal;
import com.locas.service.EmiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "EMI", description = "EMI amortization schedule, payment posting and prepayment APIs")
public class EmiController {

    private final EmiService emiService;

    @GetMapping("/{loanId}/emi-schedule")
    @Operation(summary = "Get EMI Schedule", description = "Fetch complete monthly EMI schedule and repayment status")
    public ResponseEntity<ApiResponse<List<EmiScheduleResponse>>> getEmiSchedule(@PathVariable Long loanId) {
        List<EmiScheduleResponse> schedule = emiService.getEmiSchedule(loanId);
        return ResponseEntity.ok(ApiResponse.success(schedule, "EMI schedule retrieved successfully"));
    }

    @PostMapping("/{loanId}/payments")
    @Operation(summary = "Record EMI Payment", description = "Post monthly EMI payment (NACH, NetBanking, UPI, Cash)")
    public ResponseEntity<ApiResponse<EmiScheduleResponse>> recordPayment(
            @PathVariable Long loanId,
            @Valid @RequestBody EmiPaymentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        EmiScheduleResponse response = emiService.recordPayment(loanId, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "EMI payment of ₹" + request.getAmount() + " recorded successfully"));
    }
}
