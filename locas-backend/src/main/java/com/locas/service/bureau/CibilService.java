package com.locas.service.bureau;

import com.locas.entity.BureauReport;
import com.locas.entity.LoanApplication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service("cibilService")
public class CibilService implements CreditBureauService {

    @Override
    public String getBureauName() {
        return "CIBIL";
    }

    @Override
    public BureauReport fetchCreditReport(LoanApplication application, String consentRecordId) {
        // Mock CIBIL report generation logic based on applicant income/PAN
        int baseScore = 780;
        String reportJson = String.format("{\"bureau\":\"CIBIL\",\"score\":%d,\"tradeLines\":5,\"dpd30\":0,\"dpd90\":0,\"summary\":\"High Credit Worthiness Prime Customer\"}", baseScore);

        return BureauReport.builder()
                .application(application)
                .bureauName(getBureauName())
                .fetchDate(LocalDateTime.now())
                .creditScore(baseScore)
                .reportData(reportJson)
                .dpd90PlusCount(0)
                .enquiryCount(1)
                .consentRecordId(consentRecordId)
                .build();
    }
}
