CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_app FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);

CREATE TABLE credit_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_type VARCHAR(30) NOT NULL UNIQUE,
    max_foir_salaried DECIMAL(5,2) NOT NULL,
    max_foir_self_employed DECIMAL(5,2) NOT NULL,
    max_ltv DECIMAL(5,2) NOT NULL,
    min_credit_score INT NOT NULL,
    min_income DECIMAL(15,2) NOT NULL,
    max_loan_amount DECIMAL(15,2) NOT NULL,
    base_interest_rate DECIMAL(5,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loan_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    sanctioned_amount DECIMAL(15, 2) NOT NULL,
    tenure_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    processing_fee DECIMAL(15, 2) NOT NULL,
    conditions TEXT,
    acceptance_deadline DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'GENERATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    CONSTRAINT fk_offer_app FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);
