package com.locas.service;

import com.locas.dto.response.FinancialMetricsResponse;
import com.locas.dto.response.EmiScheduleResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinancialCalculatorService {

    /**
     * Calculate monthly EMI using reducing balance formula:
     * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
     */
    public BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualInterestRate, int tenureMonths) {
        if (principal == null || principal.compareTo(BigDecimal.ZERO) <= 0 || tenureMonths <= 0) {
            return BigDecimal.ZERO;
        }
        if (annualInterestRate == null || annualInterestRate.compareTo(BigDecimal.ZERO) <= 0) {
            return principal.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        }

        double p = principal.doubleValue();
        double r = annualInterestRate.doubleValue() / (12 * 100);
        int n = tenureMonths;

        double emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate FOIR (Fixed Obligation to Income Ratio):
     * FOIR = (Existing EMIs + Proposed EMI) / Monthly Income * 100
     */
    public BigDecimal calculateFoir(BigDecimal monthlyIncome, BigDecimal existingEmis, BigDecimal proposedEmi) {
        if (monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal totalEmis = (existingEmis != null ? existingEmis : BigDecimal.ZERO).add(proposedEmi != null ? proposedEmi : BigDecimal.ZERO);
        return totalEmis.multiply(BigDecimal.valueOf(100)).divide(monthlyIncome, 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate LTV (Loan to Value Ratio):
     * LTV = Requested Loan Amount / Collateral Market Value * 100
     */
    public BigDecimal calculateLtv(BigDecimal loanAmount, BigDecimal collateralValue) {
        if (collateralValue == null || collateralValue.compareTo(BigDecimal.ZERO) <= 0 || loanAmount == null) {
            return BigDecimal.ZERO;
        }
        return loanAmount.multiply(BigDecimal.valueOf(100)).divide(collateralValue, 2, RoundingMode.HALF_UP);
    }

    /**
     * Generate full Amortization Schedule
     */
    public List<EmiScheduleResponse> generateAmortizationSchedule(BigDecimal principal, BigDecimal annualInterestRate, int tenureMonths, LocalDate startDate) {
        List<EmiScheduleResponse> schedule = new ArrayList<>();
        BigDecimal emi = calculateEmi(principal, annualInterestRate, tenureMonths);
        BigDecimal monthlyRate = annualInterestRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal balance = principal;

        for (int i = 1; i <= tenureMonths; i++) {
            BigDecimal interestPayment = balance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalPayment = emi.subtract(interestPayment);

            if (i == tenureMonths || balance.compareTo(principalPayment) < 0) {
                principalPayment = balance;
                emi = principalPayment.add(interestPayment);
                balance = BigDecimal.ZERO;
            } else {
                balance = balance.subtract(principalPayment);
            }

            LocalDate dueDate = startDate.plusMonths(i);
            schedule.add(EmiScheduleResponse.builder()
                    .installmentNumber(i)
                    .dueDate(dueDate)
                    .emiAmount(emi)
                    .principalPaid(principalPayment)
                    .interestPaid(interestPayment)
                    .outstandingBalance(balance)
                    .status("PENDING")
                    .bounceFlag(false)
                    .build());
        }

        return schedule;
    }

    public FinancialMetricsResponse computeMetrics(BigDecimal annualIncome, BigDecimal existingEmis, BigDecimal proposedLoanAmount, BigDecimal interestRate, int tenureMonths, BigDecimal collateralMarketValue, String employmentType, BigDecimal maxFoirLimit, BigDecimal maxLtvLimit) {
        BigDecimal monthlyIncome = annualIncome != null ? annualIncome.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal proposedEmi = calculateEmi(proposedLoanAmount, interestRate, tenureMonths);
        BigDecimal foir = calculateFoir(monthlyIncome, existingEmis, proposedEmi);
        BigDecimal ltv = calculateLtv(proposedLoanAmount, collateralMarketValue);

        boolean foirStatus = maxFoirLimit != null && foir.compareTo(maxFoirLimit) <= 0;
        boolean ltvStatus = collateralMarketValue == null || (maxLtvLimit != null && ltv.compareTo(maxLtvLimit) <= 0);

        BigDecimal dti = foir; // Debt-to-income aligned with FOIR
        BigDecimal maxAllowedObligation = monthlyIncome.multiply(maxFoirLimit != null ? maxFoirLimit.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP) : BigDecimal.valueOf(0.50));
        BigDecimal repaymentCapacity = maxAllowedObligation.subtract(existingEmis != null ? existingEmis : BigDecimal.ZERO).max(BigDecimal.ZERO);

        return FinancialMetricsResponse.builder()
                .monthlyIncome(monthlyIncome)
                .existingEmis(existingEmis != null ? existingEmis : BigDecimal.ZERO)
                .proposedEmi(proposedEmi)
                .foirPercentage(foir)
                .maxAllowedFoir(maxFoirLimit != null ? maxFoirLimit : BigDecimal.valueOf(50.00))
                .foirStatus(foirStatus)
                .dtiPercentage(dti)
                .collateralValue(collateralMarketValue != null ? collateralMarketValue : BigDecimal.ZERO)
                .ltvPercentage(ltv)
                .maxAllowedLtv(maxLtvLimit != null ? maxLtvLimit : BigDecimal.valueOf(80.00))
                .ltvStatus(ltvStatus)
                .repaymentCapacity(repaymentCapacity)
                .build();
    }
}
