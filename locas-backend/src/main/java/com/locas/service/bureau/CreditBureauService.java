package com.locas.service.bureau;

import com.locas.entity.BureauReport;
import com.locas.entity.LoanApplication;

public interface CreditBureauService {
    String getBureauName();
    BureauReport fetchCreditReport(LoanApplication application, String consentRecordId);
}
