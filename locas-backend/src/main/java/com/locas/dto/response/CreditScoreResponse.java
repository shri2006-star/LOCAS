package com.locas.dto.response;

import com.locas.entity.enums.RiskBand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditScoreResponse {
    private Long applicationId;
    private Integer bureauScore;
    private Integer scorecardScore;
    private Integer compositeScore;
    private RiskBand riskBand;
    private String decisionRecommendation;
    private List<String> scoreExplanation;
}
