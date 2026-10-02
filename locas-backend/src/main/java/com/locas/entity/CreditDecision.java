package com.locas.entity;

import com.locas.entity.enums.DecisionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_decisions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision_type", nullable = false, length = 30)
    private DecisionType decisionType;

    @Column(name = "recommended_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal recommendedAmount;

    @Column(name = "recommended_tenure", nullable = false)
    private Integer recommendedTenure;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal roi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decided_by", nullable = false)
    private User decidedBy;

    @Column(name = "decision_date")
    private LocalDateTime decisionDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String rationale;

    @Column(columnDefinition = "TEXT")
    private String deviations;

    @PrePersist
    protected void onCreate() {
        if (decisionDate == null) {
            decisionDate = LocalDateTime.now();
        }
    }
}
