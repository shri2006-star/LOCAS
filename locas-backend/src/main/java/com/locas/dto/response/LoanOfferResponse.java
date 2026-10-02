package com.locas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanOfferResponse {
    private Long id;
    private Long applicationId;
    private String applicationRef;
    private BigDecimal sanctionedAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private BigDecimal emiAmount;
    private BigDecimal processingFee;
    private String conditions;
    private LocalDate acceptanceDeadline;
    private String status; // GENERATED, ACCEPTED, REJECTED, EXPIRED
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
}
