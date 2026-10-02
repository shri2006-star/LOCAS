package com.locas;

import com.locas.entity.enums.NpaCategory;
import com.locas.repository.EarlyWarningRepository;
import com.locas.repository.LoanAccountRepository;
import com.locas.service.NpaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class NpaServiceTest {

    private NpaService npaService;

    @BeforeEach
    void setUp() {
        LoanAccountRepository accountRepository = Mockito.mock(LoanAccountRepository.class);
        EarlyWarningRepository warningRepository = Mockito.mock(EarlyWarningRepository.class);
        npaService = new NpaService(accountRepository, warningRepository);
    }

    @Test
    @DisplayName("Should correctly classify NPA categories based on DPD")
    void testNpaClassification() {
        assertEquals(NpaCategory.STANDARD, npaService.classifyNpa(0));
        assertEquals(NpaCategory.SMA_0, npaService.classifyNpa(15));
        assertEquals(NpaCategory.SMA_1, npaService.classifyNpa(45));
        assertEquals(NpaCategory.SMA_2, npaService.classifyNpa(75));
        assertEquals(NpaCategory.SUB_STANDARD, npaService.classifyNpa(120));
        assertEquals(NpaCategory.DOUBTFUL, npaService.classifyNpa(200));
        assertEquals(NpaCategory.LOSS, npaService.classifyNpa(400));
    }
}
