package com.locas.exception;

public class ApplicationAlreadyDisbursedException extends RuntimeException {
    public ApplicationAlreadyDisbursedException(String message) {
        super(message);
    }
}
