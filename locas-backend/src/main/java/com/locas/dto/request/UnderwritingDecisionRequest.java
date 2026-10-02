package com.locas.dto.request;

import com.locas.entity.enums.DecisionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UnderwritingDecisionRequest {
    @NotNull(message = "Decision type is required")
    private DecisionType decisionType; // APPROVE, RECOMMEND, DECLINE, REQUEST_CLARIFICATION, SEND_BACK

    @NotNull(message = "Recommended amount is required")
    private BigDecimal recommendedAmount;

    @NotNull(message = "Recommended tenure is required")
    private Integer recommendedTenure;

    @NotNull(message = "Rate of interest (ROI) is required")
    private BigDecimal roi;

    @NotBlank(message = "Rationale is mandatory for underwriting decisions")
    private String rationale;

    private String deviations;
}
