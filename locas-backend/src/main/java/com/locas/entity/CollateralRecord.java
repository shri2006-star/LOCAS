package com.locas.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "collateral_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollateralRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @Column(name = "collateral_type", nullable = false, length = 50)
    private String collateralType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "market_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal marketValue;

    @Column(name = "distress_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal distressValue;

    @Column(name = "ltv_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal ltvRatio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "valuer_id")
    private User valuer;

    @Column(name = "valuation_date")
    private LocalDate valuationDate;
}
