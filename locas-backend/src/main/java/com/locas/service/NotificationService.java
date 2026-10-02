package com.locas.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    public void sendEmail(String toEmail, String subject, String body) {
        log.info("[MOCK EMAIL] Sent to: {} | Subject: {} | Content: {}", toEmail, subject, body);
    }

    public void sendSms(String mobileNumber, String message) {
        log.info("[MOCK SMS] Sent to: {} | Message: {}", mobileNumber, message);
    }
}
