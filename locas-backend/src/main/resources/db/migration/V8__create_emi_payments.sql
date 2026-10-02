CREATE TABLE emi_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_account_id BIGINT NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    principal_paid DECIMAL(15, 2) DEFAULT 0.00,
    interest_paid DECIMAL(15, 2) DEFAULT 0.00,
    bounce_flag BOOLEAN DEFAULT FALSE,
    payment_mode VARCHAR(30),
    status VARCHAR(30) DEFAULT 'PENDING',
    CONSTRAINT fk_emi_loan_account FOREIGN KEY (loan_account_id) REFERENCES loan_accounts(id)
);
