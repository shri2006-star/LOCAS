CREATE TABLE loan_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    disbursed_amount DECIMAL(15, 2) NOT NULL,
    outstanding_principal DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    emi_due_date INT DEFAULT 5,
    next_due_date DATE NOT NULL,
    dpd INT DEFAULT 0,
    npa_category VARCHAR(30) DEFAULT 'STANDARD',
    nach_mandate_status VARCHAR(30) DEFAULT 'ACTIVE',
    maturity_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_account_app FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);
