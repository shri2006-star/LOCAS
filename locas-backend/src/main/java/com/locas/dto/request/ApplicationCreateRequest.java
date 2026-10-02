package com.locas.dto.request;

import com.locas.entity.enums.ProductType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ApplicationCreateRequest {
    private Long applicantId; // Optional if logged in as applicant

    @NotNull(message = "Product type is required")
    private ProductType productType;

    @NotNull(message = "Requested amount is required")
    @Positive(message = "Requested amount must be positive")
    private BigDecimal requestedAmount;

    @NotNull(message = "Tenure in months is required")
    @Positive(message = "Tenure must be positive")
    private Integer tenureMonths;

    private String purpose;

    // Optional collateral details for LAP/Home/Vehicle loans
    private String collateralType;
    private String collateralDescription;
    private BigDecimal collateralMarketValue;
}
