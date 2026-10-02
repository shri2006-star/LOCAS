package com.locas.dto.response;

import com.locas.entity.enums.VerificationStatus;
import com.locas.entity.enums.VerificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {
    private Long id;
    private Long applicationId;
    private String applicationRef;
    private String applicantName;
    private VerificationType verificationType;
    private String assignedToName;
    private Long assignedToId;
    private LocalDateTime assignedDate;
    private LocalDate visitDate;
    private VerificationStatus status;
    private String findings;
    private String gpsCoordinates;
    private String documentUrl;
}
