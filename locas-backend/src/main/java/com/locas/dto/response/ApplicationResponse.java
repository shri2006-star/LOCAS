package com.locas.dto.response;

import com.locas.entity.enums.ApplicationStatus;
import com.locas.entity.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private String applicationRef;
    private ApplicantResponse applicant;
    private ProductType productType;
    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private String purpose;
    private ApplicationStatus status;
    private String assignedOfficerName;
    private Long assignedOfficerId;
    private Integer creditScore;
    private Integer scorecardScore;
    private String riskBand;
    private LocalDateTime decisionDate;
    private String decidedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Financial Metrics computed on demand
    private BigDecimal foirPercentage;
    private BigDecimal ltvPercentage;
    private BigDecimal estimatedEmi;
}
