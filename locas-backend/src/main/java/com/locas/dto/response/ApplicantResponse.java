package com.locas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String maskedPan;
    private String maskedAadhaar;
    private String mobileNumber;
    private String email;
    private String address;
    private String employmentType;
    private BigDecimal annualIncome;
    private BigDecimal existingEmis;
    private LocalDateTime createdAt;
}
