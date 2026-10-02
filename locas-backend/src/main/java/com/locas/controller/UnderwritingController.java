package com.locas.controller;

import com.locas.dto.request.UnderwritingDecisionRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.ApplicationResponse;
import com.locas.security.UserPrincipal;
import com.locas.service.UnderwritingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/underwriting")
@RequiredArgsConstructor
@Tag(name = "Underwriting", description = "Underwriting decisions and Maker-Checker approval workflow APIs")
public class UnderwritingController {

    private final UnderwritingService underwritingService;

    @PostMapping("/decision/{applicationId}")
    @Operation(summary = "Submit Underwriting Decision", description = "Credit Officer / Credit Head decision (Approve, Recommend, Decline, Request Clarification)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitDecision(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UnderwritingDecisionRequest request) {
        ApplicationResponse response = underwritingService.processUnderwritingDecision(applicationId, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Underwriting decision recorded successfully"));
    }
}
