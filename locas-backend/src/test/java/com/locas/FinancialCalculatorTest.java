package com.locas;

import com.locas.service.FinancialCalculatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.junit.jupiter.api.Assertions.*;

public class FinancialCalculatorTest {

    private FinancialCalculatorService calculatorService;

    @BeforeEach
    void setUp() {
        calculatorService = new FinancialCalculatorService();
    }

    @Test
    @DisplayName("Should accurately calculate EMI for ₹5,00,000 at 8.5% for 60 months")
    void testEmiCalculation() {
        BigDecimal principal = BigDecimal.valueOf(500000);
        BigDecimal roi = BigDecimal.valueOf(8.5);
        int tenure = 60;

        BigDecimal emi = calculatorService.calculateEmi(principal, roi, tenure);
        assertNotNull(emi);
        // Expected EMI ~ ₹10,257.65
        assertTrue(emi.compareTo(BigDecimal.valueOf(10000)) > 0);
        assertTrue(emi.compareTo(BigDecimal.valueOf(11000)) < 0);
    }

    @Test
    @DisplayName("Should accurately calculate FOIR")
    void testFoirCalculation() {
        BigDecimal monthlyIncome = BigDecimal.valueOf(100000);
        BigDecimal existingEmis = BigDecimal.valueOf(20000);
        BigDecimal proposedEmi = BigDecimal.valueOf(25000);

        BigDecimal foir = calculatorService.calculateFoir(monthlyIncome, existingEmis, proposedEmi);
        assertEquals(BigDecimal.valueOf(45.00).setScale(2, RoundingMode.HALF_UP), foir);
    }

    @Test
    @DisplayName("Should accurately calculate LTV")
    void testLtvCalculation() {
        BigDecimal loanAmount = BigDecimal.valueOf(5000000);
        BigDecimal collateralValue = BigDecimal.valueOf(7000000);

        BigDecimal ltv = calculatorService.calculateLtv(loanAmount, collateralValue);
        // 5000000 / 7000000 * 100 = 71.43%
        assertEquals(BigDecimal.valueOf(71.43), ltv);
    }

    @Test
    @DisplayName("Negative Scenario: Should return 0 EMI for negative or zero principal")
    void testNegativeEmi() {
        BigDecimal emi = calculatorService.calculateEmi(BigDecimal.valueOf(-1000), BigDecimal.valueOf(10), 12);
        assertEquals(BigDecimal.ZERO, emi);
    }
}
