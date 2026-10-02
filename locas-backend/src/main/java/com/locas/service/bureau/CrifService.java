package com.locas.service.bureau;

import com.locas.entity.BureauReport;
import com.locas.entity.LoanApplication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service("crifService")
public class CrifService implements CreditBureauService {

    @Override
    public String getBureauName() {
        return "CRIF";
    }

    @Override
    public BureauReport fetchCreditReport(LoanApplication application, String consentRecordId) {
        int baseScore = 770;
        String reportJson = String.format("{\"bureau\":\"CRIF\",\"score\":%d,\"tradeLines\":5,\"dpd30\":0,\"dpd90\":0,\"summary\":\"Consistent Repayment Record\"}", baseScore);

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
