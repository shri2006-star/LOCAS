package com.locas.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BureauFetchRequest {
    @NotBlank(message = "Bureau name is required (e.g. CIBIL, EXPERIAN, EQUIFAX, CRIF)")
    private String bureauName;

    @NotBlank(message = "Applicant consent record ID is required")
    private String consentRecordId;
}
