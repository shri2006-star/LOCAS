package com.locas.service.bureau;

import com.locas.entity.BureauReport;
import com.locas.entity.LoanApplication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service("equifaxService")
public class EquifaxService implements CreditBureauService {

    @Override
    public String getBureauName() {
        return "EQUIFAX";
    }

    @Override
    public BureauReport fetchCreditReport(LoanApplication application, String consentRecordId) {
        int baseScore = 772;
        String reportJson = String.format("{\"bureau\":\"EQUIFAX\",\"score\":%d,\"tradeLines\":4,\"dpd30\":0,\"dpd90\":0,\"summary\":\"Low Credit Risk Profile\"}", baseScore);

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
