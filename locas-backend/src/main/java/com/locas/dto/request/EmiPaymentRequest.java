package com.locas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EmiPaymentRequest {
    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be positive")
    private BigDecimal amount;

    @NotBlank(message = "Payment mode is required (NACH_AUTODEBIT, NET_BANKING, UPI, CASH)")
    private String paymentMode;

    private String transactionRef;
}
