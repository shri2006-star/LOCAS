package com.locas.controller;

import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.DashboardMetricsResponse;
import com.locas.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Executive KPI, portfolio overview, and analytics APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/applications")
    @Operation(summary = "Get Application Dashboard Metrics", description = "Fetch total, pending, approved, and declined application counts")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getApplicationMetrics() {
        DashboardMetricsResponse metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Application metrics retrieved"));
    }

    @GetMapping("/portfolio")
    @Operation(summary = "Get Portfolio Executive Dashboard Metrics", description = "Fetch total portfolio volume, NPA %, and collection efficiency")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getPortfolioMetrics() {
        DashboardMetricsResponse metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Portfolio metrics retrieved"));
    }

    @GetMapping("/disbursements")
    @Operation(summary = "Get Disbursement Summary", description = "Fetch disbursement volume summary")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getDisbursements() {
        DashboardMetricsResponse metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Disbursement metrics retrieved"));
    }

    @GetMapping("/npa")
    @Operation(summary = "Get NPA Summary", description = "Fetch NPA account metrics")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getNpaSummary() {
        DashboardMetricsResponse metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "NPA metrics retrieved"));
    }
}
