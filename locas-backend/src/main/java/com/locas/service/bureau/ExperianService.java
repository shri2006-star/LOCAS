package com.locas.service.bureau;

import com.locas.entity.BureauReport;
import com.locas.entity.LoanApplication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service("experianService")
public class ExperianService implements CreditBureauService {

    @Override
    public String getBureauName() {
        return "EXPERIAN";
    }

    @Override
    public BureauReport fetchCreditReport(LoanApplication application, String consentRecordId) {
        int baseScore = 765;
        String reportJson = String.format("{\"bureau\":\"EXPERIAN\",\"score\":%d,\"tradeLines\":6,\"dpd30\":0,\"dpd90\":0,\"summary\":\"Prime Risk Grade A1\"}", baseScore);

        return BureauReport.builder()
                .application(application)
                .bureauName(getBureauName())
                .fetchDate(LocalDateTime.now())
                .creditScore(baseScore)
                .reportData(reportJson)
                .dpd90PlusCount(0)
                .enquiryCount(2)
                .consentRecordId(consentRecordId)
                .build();
    }
}
