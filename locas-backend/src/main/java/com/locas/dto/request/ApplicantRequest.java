package com.locas.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ApplicantRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "PAN number is required")
    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "Invalid PAN number format")
    private String panNumber;

    @NotBlank(message = "Aadhaar number or hash is required")
    private String aadhaarNumber;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Employment type is required")
    private String employmentType; // SALARIED, SELF_EMPLOYED

    @NotNull(message = "Annual income is required")
    @Positive(message = "Annual income must be positive")
    private BigDecimal annualIncome;

    private BigDecimal existingEmis = BigDecimal.ZERO;
}
