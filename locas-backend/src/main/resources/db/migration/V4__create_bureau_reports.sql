CREATE TABLE IF NOT EXISTS bureau_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    bureau_name VARCHAR(50) NOT NULL,
    fetch_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    credit_score INT NOT NULL,
    report_data TEXT NOT NULL,
    dpd_90_plus_count INT DEFAULT 0,
    enquiry_count INT DEFAULT 0,
    consent_record_id VARCHAR(100),
    CONSTRAINT fk_bureau_app FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);
