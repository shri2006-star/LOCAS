package com.locas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialMetricsResponse {
    private BigDecimal monthlyIncome;
    private BigDecimal existingEmis;
    private BigDecimal proposedEmi;
    private BigDecimal foirPercentage;
    private BigDecimal maxAllowedFoir;
    private Boolean foirStatus; // true = within policy limit
    private BigDecimal dtiPercentage;
    private BigDecimal collateralValue;
    private BigDecimal ltvPercentage;
    private BigDecimal maxAllowedLtv;
    private Boolean ltvStatus;
    private BigDecimal repaymentCapacity;
}
