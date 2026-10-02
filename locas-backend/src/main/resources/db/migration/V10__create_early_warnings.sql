CREATE TABLE early_warnings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_account_id BIGINT NOT NULL,
    warning_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    triggered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_recovery_officer BIGINT,
    status VARCHAR(30) DEFAULT 'OPEN',
    action_taken TEXT,
    CONSTRAINT fk_warning_loan_account FOREIGN KEY (loan_account_id) REFERENCES loan_accounts(id),
    CONSTRAINT fk_warning_officer FOREIGN KEY (assigned_recovery_officer) REFERENCES users(id)
);
