package com.locas.service;

import com.locas.dto.response.EarlyWarningResponse;
import com.locas.entity.EarlyWarning;
import com.locas.entity.LoanAccount;
import com.locas.entity.enums.EarlyWarningSeverity;
import com.locas.entity.enums.NpaCategory;
import com.locas.exception.ResourceNotFoundException;
import com.locas.repository.EarlyWarningRepository;
import com.locas.repository.LoanAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NpaService {

    private final LoanAccountRepository accountRepository;
    private final EarlyWarningRepository earlyWarningRepository;

    public NpaCategory classifyNpa(int dpd) {
        if (dpd == 0) return NpaCategory.STANDARD;
        if (dpd <= 30) return NpaCategory.SMA_0;
        if (dpd <= 60) return NpaCategory.SMA_1;
        if (dpd <= 90) return NpaCategory.SMA_2;
        if (dpd <= 180) return NpaCategory.SUB_STANDARD;
        if (dpd <= 365) return NpaCategory.DOUBTFUL;
        return NpaCategory.LOSS;
    }

    @Transactional(readOnly = true)
    public List<EarlyWarningResponse> getEarlyWarnings() {
        return earlyWarningRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EarlyWarningResponse triggerEarlyWarning(Long loanAccountId, String warningType, EarlyWarningSeverity severity, String actionTaken) {
        LoanAccount account = accountRepository.findById(loanAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found with id: " + loanAccountId));

        EarlyWarning warning = EarlyWarning.builder()
                .loanAccount(account)
                .warningType(warningType)
                .severity(severity)
                .status("OPEN")
                .actionTaken(actionTaken)
                .build();

        warning = earlyWarningRepository.save(warning);

        return mapToResponse(warning);
    }

    public EarlyWarningResponse mapToResponse(EarlyWarning warning) {
        return EarlyWarningResponse.builder()
                .id(warning.getId())
                .loanAccountId(warning.getLoanAccount().getId())
                .accountNumber(warning.getLoanAccount().getAccountNumber())
                .customerName(warning.getLoanAccount().getApplication().getApplicant().getFullName())
                .dpd(warning.getLoanAccount().getDpd())
                .warningType(warning.getWarningType())
                .severity(warning.getSeverity())
                .triggeredDate(warning.getTriggeredDate())
                .assignedRecoveryOfficerName(warning.getAssignedRecoveryOfficer() != null ? warning.getAssignedRecoveryOfficer().getFullName() : "Unassigned")
                .status(warning.getStatus())
                .actionTaken(warning.getActionTaken())
                .build();
    }
}
