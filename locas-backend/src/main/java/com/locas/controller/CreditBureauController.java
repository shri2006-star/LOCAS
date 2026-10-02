package com.locas.controller;

import com.locas.dto.request.BureauFetchRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.BureauReportResponse;
import com.locas.entity.BureauReport;
import com.locas.entity.LoanApplication;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.BureauReportRepository;
import com.locas.repository.LoanApplicationRepository;
import com.locas.service.bureau.CreditBureauService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bureau")
@RequiredArgsConstructor
@Tag(name = "Bureau", description = "Credit Bureau (CIBIL, Experian, Equifax, CRIF) integration APIs")
public class CreditBureauController {

    private final Map<String, CreditBureauService> bureauServiceMap;
    private final LoanApplicationRepository applicationRepository;
    private final BureauReportRepository bureauReportRepository;

    @PostMapping("/fetch/{applicationId}")
    @Operation(summary = "Fetch Credit Bureau Report", description = "Trigger credit bureau pull (CIBIL / Experian / Equifax / CRIF)")
    public ResponseEntity<ApiResponse<BureauReportResponse>> fetchBureauReport(
            @PathVariable Long applicationId,
            @Valid @RequestBody BureauFetchRequest request) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        String serviceKey = request.getBureauName().toLowerCase() + "Service";
        CreditBureauService bureauService = bureauServiceMap.get(serviceKey);

        if (bureauService == null) {
            // Default to CIBIL if service name match not found directly
            bureauService = bureauServiceMap.get("cibilService");
        }

        BureauReport report = bureauService.fetchCreditReport(application, request.getConsentRecordId());
        report = bureauReportRepository.save(report);

        // Update application bureau score
        application.setCreditScore(report.getCreditScore());
        applicationRepository.save(application);

        BureauReportResponse response = mapToResponse(report);
        return ResponseEntity.ok(ApiResponse.success(response, "Bureau report fetched successfully from " + report.getBureauName()));
    }

    @GetMapping("/{applicationId}/reports")
    @Operation(summary = "Get Bureau Reports for Application", description = "Fetch all bureau report history for an application")
    public ResponseEntity<ApiResponse<List<BureauReportResponse>>> getReports(@PathVariable Long applicationId) {
        List<BureauReportResponse> reports = bureauReportRepository.findByApplicationIdOrderByFetchDateDesc(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(reports, "Bureau reports retrieved"));
    }

    private BureauReportResponse mapToResponse(BureauReport report) {
        return BureauReportResponse.builder()
                .id(report.getId())
                .applicationId(report.getApplication().getId())
                .bureauName(report.getBureauName())
                .fetchDate(report.getFetchDate())
                .creditScore(report.getCreditScore())
                .reportData(report.getReportData())
                .dpd90PlusCount(report.getDpd90PlusCount())
                .enquiryCount(report.getEnquiryCount())
                .consentRecordId(report.getConsentRecordId())
                .build();
    }
}
