package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.EarlyWarningResponse;
import com.locas.entity.LoanAccount;
import com.locas.entity.enums.EarlyWarningSeverity;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.LoanAccountRepository;
import com.locas.service.NpaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Portfolio & Early Warning", description = "NPA monitoring, DPD tracking, and Early Warning alert APIs")
public class NpaController {

    private final NpaService npaService;
    private final LoanAccountRepository accountRepository;

    @GetMapping("/portfolio/early-warnings")
    @Operation(summary = "Get Portfolio Early Warnings", description = "Fetch all active early warning triggers (DPD spike, EMI bounce, stress)")
    public ResponseEntity<ApiResponse<List<EarlyWarningResponse>>> getEarlyWarnings() {
        List<EarlyWarningResponse> warnings = npaService.getEarlyWarnings();
        return ResponseEntity.ok(ApiResponse.success(warnings, "Early warning signals retrieved"));
    }

    @GetMapping("/loans/{id}/npa")
    @Operation(summary = "Get Loan NPA Classification", description = "Get DPD and NPA categorization (STANDARD, SMA_0..2, SUB_STANDARD, DOUBTFUL, LOSS)")
    public ResponseEntity<ApiResponse<String>> getNpaCategory(@PathVariable Long id) {
        LoanAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.success(account.getNpaCategory().name(), "NPA Category: " + account.getNpaCategory().name() + " (DPD: " + account.getDpd() + ")"));
    }

    @PostMapping("/loans/{id}/early-warning")
    @Operation(summary = "Trigger Early Warning Alert", description = "Manually trigger an early warning alert for risk officer review")
    public ResponseEntity<ApiResponse<EarlyWarningResponse>> triggerWarning(
            @PathVariable Long id,
            @RequestParam String warningType,
            @RequestParam EarlyWarningSeverity severity,
            @RequestParam(required = false) String actionTaken) {
        EarlyWarningResponse response = npaService.triggerEarlyWarning(id, warningType, severity, actionTaken);
        return ResponseEntity.ok(ApiResponse.success(response, "Early warning alert created"));
    }
}
