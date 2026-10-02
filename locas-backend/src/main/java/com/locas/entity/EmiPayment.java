package com.locas.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "emi_payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_account_id", nullable = false)
    private LoanAccount loanAccount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Builder.Default
    @Column(name = "paid_amount", precision = 15, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "principal_paid", precision = 15, scale = 2)
    private BigDecimal principalPaid = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "interest_paid", precision = 15, scale = 2)
    private BigDecimal interestPaid = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "bounce_flag")
    private Boolean bounceFlag = false;

    @Column(name = "payment_mode", length = 30)
    private String paymentMode;

    @Builder.Default
    @Column(length = 30)
    private String status = "PENDING";
}
