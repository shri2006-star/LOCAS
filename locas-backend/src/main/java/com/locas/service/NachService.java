package com.locas.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NachService {

    public String registerMandate(String accountNumber, String ifsc, String bankName, double maxAmount) {
        return "UMRN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public String getMandateStatus(String umrn) {
        return "ACTIVE";
    }

    public boolean cancelMandate(String umrn) {
        return true;
    }
}
