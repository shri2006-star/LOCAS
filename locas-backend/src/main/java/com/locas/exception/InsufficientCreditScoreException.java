package com.locas.exception;

public class InsufficientCreditScoreException extends RuntimeException {
    public InsufficientCreditScoreException(String message) {
        super(message);
    }
}
