package com.locas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsResponse {
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long declinedApplications;
    private BigDecimal totalDisbursedAmount;
    private BigDecimal outstandingPrincipal;
    private long npaAccounts;
    private BigDecimal approvalRate;
    private BigDecimal collectionEfficiency;
    private Map<String, Long> applicationsByProduct;
    private Map<String, Long> applicationsByStatus;
}
