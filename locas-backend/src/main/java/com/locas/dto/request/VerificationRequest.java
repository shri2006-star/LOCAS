package com.locas.dto.request;

import com.locas.entity.enums.VerificationStatus;
import com.locas.entity.enums.VerificationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VerificationRequest {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Verification type is required")
    private VerificationType verificationType; // RESIDENCE, EMPLOYMENT, BUSINESS, BUSINESS_PREMISES, COLLATERAL, COLLATERAL_VALUATION

    private Long assignedToId;
    private LocalDate visitDate;
    private VerificationStatus status = VerificationStatus.PENDING;
    private String findings;
    private String gpsCoordinates;
    private String documentUrl;
}
