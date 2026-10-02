package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.service.NachService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/nach")
@RequiredArgsConstructor
@Tag(name = "NACH", description = "NACH auto-debit mandate integration APIs")
public class NachController {

    private final NachService nachService;

    @PostMapping("/mandate")
    @Operation(summary = "Register NACH Auto-Debit Mandate", description = "Create NACH mandate for automated EMI collections")
    public ResponseEntity<ApiResponse<Map<String, String>>> registerMandate(
            @RequestParam String accountNumber,
            @RequestParam String ifsc,
            @RequestParam String bankName,
            @RequestParam double maxAmount) {
        String umrn = nachService.registerMandate(accountNumber, ifsc, bankName, maxAmount);
        Map<String, String> response = new HashMap<>();
        response.put("umrn", umrn);
        response.put("status", "ACTIVE");
        return ResponseEntity.ok(ApiResponse.success(response, "NACH mandate registered with UMRN: " + umrn));
    }
}
