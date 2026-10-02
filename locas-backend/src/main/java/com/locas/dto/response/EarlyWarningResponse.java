package com.locas.dto.response;

import com.locas.entity.enums.EarlyWarningSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EarlyWarningResponse {
    private Long id;
    private Long loanAccountId;
    private String accountNumber;
    private String customerName;
    private Integer dpd;
    private String warningType;
    private EarlyWarningSeverity severity;
    private LocalDateTime triggeredDate;
    private String assignedRecoveryOfficerName;
    private String status;
    private String actionTaken;
}
