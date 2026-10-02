package com.locas.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "applicants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "pan_number", nullable = false, unique = true, length = 10)
    private String panNumber;

    @Column(name = "aadhaar_hash", nullable = false)
    private String aadhaarHash;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "employment_type", nullable = false, length = 30)
    private String employmentType;

    @Column(name = "annual_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal annualIncome;

    @Builder.Default
    @Column(name = "existing_emis", precision = 15, scale = 2)
    private BigDecimal existingEmis = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getMaskedPan() {
        if (panNumber == null || panNumber.length() < 10) return "XXXXX0000X";
        return panNumber.substring(0, 2) + "XXX" + panNumber.substring(5, 9) + panNumber.substring(9);
    }

    public String getMaskedAadhaar() {
        if (aadhaarHash == null || aadhaarHash.length() < 12) return "XXXX-XXXX-0000";
        return "XXXX-XXXX-" + aadhaarHash.substring(aadhaarHash.length() - 4);
    }
}
