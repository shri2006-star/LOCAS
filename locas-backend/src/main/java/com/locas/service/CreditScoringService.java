package com.locas.service;

import com.locas.dto.response.CreditScoreResponse;
import com.locas.entity.Applicant;
import com.locas.entity.CollateralRecord;
import com.locas.entity.CreditPolicy;
import com.locas.entity.LoanApplication;
import com.locas.entity.enums.RiskBand;
import com.locas.repository.CollateralRecordRepository;
import com.locas.repository.CreditPolicyRepository;
import com.locas.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditScoringService {

    private final LoanApplicationRepository applicationRepository;
    private final CollateralRecordRepository collateralRecordRepository;
    private final CreditPolicyRepository creditPolicyRepository;
    private final FinancialCalculatorService financialCalculatorService;

    @Transactional
    public CreditScoreResponse calculateCreditScore(LoanApplication application) {
        Applicant applicant = application.getApplicant();
        CreditPolicy policy = creditPolicyRepository.findByProductType(application.getProductType()).orElse(null);

        int bureauScore = application.getCreditScore() != null ? application.getCreditScore() : 750;
        int scorePoints = 0;
        List<String> explanation = new ArrayList<>();

        // 1. Bureau Score Component (Weight: 40%)
        if (bureauScore >= 750) {
            scorePoints += 40;
            explanation.add("High bureau score (>750) added +40 points.");
        } else if (bureauScore >= 680) {
            scorePoints += 30;
            explanation.add("Good bureau score (680-749) added +30 points.");
        } else if (bureauScore >= 600) {
            scorePoints += 15;
            explanation.add("Moderate bureau score (600-679) added +15 points.");
        } else {
            explanation.add("Low bureau score (<600) added 0 points.");
        }

        // 2. Income Stability & Employment Type Component (Weight: 20%)
        if ("SALARIED".equalsIgnoreCase(applicant.getEmploymentType())) {
            scorePoints += 20;
            explanation.add("Salaried employment provides stable cash flow (+20 points).");
        } else {
            scorePoints += 15;
            explanation.add("Self-employed profile added +15 points.");
        }

        // 3. FOIR Component (Weight: 20%)
        BigDecimal proposedEmi = financialCalculatorService.calculateEmi(application.getRequestedAmount(), policy != null ? policy.getBaseInterestRate() : BigDecimal.valueOf(10.0), application.getTenureMonths());
        BigDecimal monthlyIncome = applicant.getAnnualIncome().divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal foir = financialCalculatorService.calculateFoir(monthlyIncome, applicant.getExistingEmis(), proposedEmi);

        if (foir.compareTo(BigDecimal.valueOf(40)) <= 0) {
            scorePoints += 20;
            explanation.add("Healthy FOIR (" + foir + "%) below 40% (+20 points).");
        } else if (foir.compareTo(BigDecimal.valueOf(50)) <= 0) {
            scorePoints += 12;
            explanation.add("Acceptable FOIR (" + foir + "%) between 40-50% (+12 points).");
        } else {
            explanation.add("High FOIR (" + foir + "%) exceeding 50% (+0 points).");
        }

        // 4. LTV Component (Weight: 20%)
        List<CollateralRecord> collaterals = collateralRecordRepository.findByApplicationId(application.getId());
        if (!collaterals.isEmpty()) {
            BigDecimal totalCollateral = collaterals.stream()
                    .map(CollateralRecord::getMarketValue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal ltv = financialCalculatorService.calculateLtv(application.getRequestedAmount(), totalCollateral);
            if (ltv.compareTo(BigDecimal.valueOf(70)) <= 0) {
                scorePoints += 20;
                explanation.add("Low LTV (" + ltv + "%) below 70% (+20 points).");
            } else if (ltv.compareTo(BigDecimal.valueOf(80)) <= 0) {
                scorePoints += 10;
                explanation.add("Standard LTV (" + ltv + "%) between 70-80% (+10 points).");
            }
        } else {
            scorePoints += 10; // Unsecured default benchmark
            explanation.add("Unsecured product baseline (+10 points).");
        }

        // Determine Risk Band & Decision Recommendation
        RiskBand riskBand;
        String recommendation;
        if (scorePoints >= 70 && bureauScore >= 680) {
            riskBand = RiskBand.APPROVE;
            recommendation = "Recommended for Sanction. Low risk borrower profile.";
        } else if (scorePoints >= 50 && bureauScore >= 600) {
            riskBand = RiskBand.REVIEW;
            recommendation = "Requires Credit Officer detailed underwriting & manual review.";
        } else {
            riskBand = RiskBand.DECLINE;
            recommendation = "Decline recommended due to elevated credit risk metrics.";
        }

        // Save scorecard score on application
        application.setScorecardScore(scorePoints);
        applicationRepository.save(application);

        return CreditScoreResponse.builder()
                .applicationId(application.getId())
                .bureauScore(bureauScore)
                .scorecardScore(scorePoints)
                .compositeScore(scorePoints)
                .riskBand(riskBand)
                .decisionRecommendation(recommendation)
                .scoreExplanation(explanation)
                .build();
    }
}
