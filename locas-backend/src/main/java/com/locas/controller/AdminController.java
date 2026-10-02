package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.AuditLogResponse;
import com.locas.dto.response.PagedResponse;
import com.locas.dto.response.UserResponse;
import com.locas.entity.CreditPolicy;
import com.locas.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Administration", description = "User management, credit policies, audit logs, and regulatory reporting APIs")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @Operation(summary = "Get All Users", description = "Fetch list of all system users across roles")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "Users retrieved successfully"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get System Audit Logs", description = "Fetch system audit log trail with pagination")
    public ResponseEntity<PagedResponse<AuditLogResponse>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<AuditLogResponse> logs = adminService.getAuditLogs(page, size);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/credit-policy")
    @Operation(summary = "Save Credit Policy", description = "Create or update credit policy parameters (FOIR, LTV, interest rate)")
    public ResponseEntity<ApiResponse<CreditPolicy>> saveCreditPolicy(@RequestBody CreditPolicy policy) {
        CreditPolicy saved = adminService.saveCreditPolicy(policy);
        return ResponseEntity.ok(ApiResponse.success(saved, "Credit policy saved successfully"));
    }

    @GetMapping("/credit-policy")
    @Operation(summary = "Get Credit Policies", description = "Fetch credit policies for all loan products")
    public ResponseEntity<ApiResponse<List<CreditPolicy>>> getCreditPolicies() {
        List<CreditPolicy> policies = adminService.getAllCreditPolicies();
        return ResponseEntity.ok(ApiResponse.success(policies, "Credit policies retrieved successfully"));
    }

    @GetMapping("/regulatory-reports")
    @Operation(summary = "Generate Regulatory Report", description = "Download RBI compliant regulatory reporting summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRegulatoryReports() {
        Map<String, Object> report = new HashMap<>();
        report.put("reportName", "RBI Statutory Return - Digital Lending");
        report.put("generatedAt", java.time.LocalDateTime.now());
        report.put("totalPortfolioValue", 1254000000);
        report.put("npaPercentage", 2.8);
        report.put("capitalAdequacyRatio", 18.5);
        return ResponseEntity.ok(ApiResponse.success(report, "Regulatory report generated"));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get System Analytics", description = "Fetch system usage & turnaround time analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("averageTatDays", 1.8);
        analytics.put("autoApprovalRate", 42.0);
        analytics.put("bureauSuccessRate", 99.4);
        return ResponseEntity.ok(ApiResponse.success(analytics, "Analytics retrieved"));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete User & Applicant Account", description = "Delete user account and associated applicant profile from MySQL database")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account and applicant profile deleted successfully from MySQL"));
    }

    @DeleteMapping("/applications/{id}")
    @Operation(summary = "Delete Loan Application", description = "Delete loan application, child records, and applicant user if no other applications exist")
    public ResponseEntity<ApiResponse<String>> deleteApplication(@PathVariable Long id) {
        adminService.deleteApplication(id);
        return ResponseEntity.ok(ApiResponse.success("Loan application and applicant profile deleted successfully from MySQL"));
    }
}
