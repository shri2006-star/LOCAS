package com.locas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DisbursementRequest {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Disbursement amount is required")
    @Positive(message = "Disbursement amount must be positive")
    private BigDecimal disbursementAmount;

    @NotBlank(message = "Payment mode is required (e.g. NEFT, RTGS, DIRECT_CREDIT)")
    private String paymentMode;

    @NotBlank(message = "Beneficiary account number is required")
    private String beneficiaryAccountNumber;

    @NotBlank(message = "Beneficiary IFSC code is required")
    private String beneficiaryIfsc;

    private String beneficiaryName;
    private Boolean isTranche = false;
    private Integer trancheNumber = 1;
}
