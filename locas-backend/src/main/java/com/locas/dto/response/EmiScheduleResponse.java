package com.locas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmiScheduleResponse {
    private Long id;
    private Integer installmentNumber;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private BigDecimal emiAmount;
    private BigDecimal principalPaid;
    private BigDecimal interestPaid;
    private BigDecimal outstandingBalance;
    private String status; // PENDING, PAID, OVERDUE, BOUNCED
    private Boolean bounceFlag;
    private String paymentMode;
}
