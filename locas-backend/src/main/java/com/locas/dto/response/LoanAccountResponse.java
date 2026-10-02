package com.locas.dto.response;

import com.locas.entity.enums.NpaCategory;
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
public class LoanAccountResponse {
    private Long id;
    private Long applicationId;
    private String applicationRef;
    private String applicantName;
    private String accountNumber;
    private BigDecimal disbursedAmount;
    private BigDecimal outstandingPrincipal;
    private BigDecimal interestRate;
    private BigDecimal emiAmount;
    private Integer emiDueDate;
    private LocalDate nextDueDate;
    private Integer dpd;
    private NpaCategory npaCategory;
    private String nachMandateStatus;
    private LocalDate maturityDate;
    private LocalDateTime createdAt;
}
