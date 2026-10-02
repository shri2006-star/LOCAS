package com.locas.entity;

import com.locas.entity.enums.ProductType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false, unique = true, length = 30)
    private ProductType productType;

    @Column(name = "max_foir_salaried", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxFoirSalaried;

    @Column(name = "max_foir_self_employed", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxFoirSelfEmployed;

    @Column(name = "max_ltv", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxLtv;

    @Column(name = "min_credit_score", nullable = false)
    private Integer minCreditScore;

    @Column(name = "min_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal minIncome;

    @Column(name = "max_loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal maxLoanAmount;

    @Column(name = "base_interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal baseInterestRate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = LocalDateTime.now();
    }
}
