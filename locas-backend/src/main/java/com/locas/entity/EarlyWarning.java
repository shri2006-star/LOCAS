package com.locas.entity;

import com.locas.entity.enums.EarlyWarningSeverity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "early_warnings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EarlyWarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_account_id", nullable = false)
    private LoanAccount loanAccount;

    @Column(name = "warning_type", nullable = false, length = 50)
    private String warningType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EarlyWarningSeverity severity;

    @Column(name = "triggered_date")
    private LocalDateTime triggeredDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_recovery_officer")
    private User assignedRecoveryOfficer;

    @Builder.Default
    @Column(length = 30)
    private String status = "OPEN";

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;

    @PrePersist
    protected void onCreate() {
        if (triggeredDate == null) {
            triggeredDate = LocalDateTime.now();
        }
    }
}
