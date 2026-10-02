package com.locas.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bureau_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BureauReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @Column(name = "bureau_name", nullable = false, length = 50)
    private String bureauName;

    @Column(name = "fetch_date")
    private LocalDateTime fetchDate;

    @Column(name = "credit_score", nullable = false)
    private Integer creditScore;

    @Column(name = "report_data", nullable = false, columnDefinition = "TEXT")
    private String reportData;

    @Builder.Default
    @Column(name = "dpd_90_plus_count")
    private Integer dpd90PlusCount = 0;

    @Builder.Default
    @Column(name = "enquiry_count")
    private Integer enquiryCount = 0;

    @Column(name = "consent_record_id", length = 100)
    private String consentRecordId;

    @PrePersist
    protected void onCreate() {
        if (fetchDate == null) {
            fetchDate = LocalDateTime.now();
        }
    }
}
