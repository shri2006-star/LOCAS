package com.locas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BureauReportResponse {
    private Long id;
    private Long applicationId;
    private String bureauName;
    private LocalDateTime fetchDate;
    private Integer creditScore;
    private String reportData;
    private Integer dpd90PlusCount;
    private Integer enquiryCount;
    private String consentRecordId;
}
