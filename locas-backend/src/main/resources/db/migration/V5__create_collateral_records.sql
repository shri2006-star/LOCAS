CREATE TABLE collateral_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    collateral_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    market_value DECIMAL(15, 2) NOT NULL,
    distress_value DECIMAL(15, 2) NOT NULL,
    ltv_ratio DECIMAL(5, 2) NOT NULL,
    valuer_id BIGINT,
    valuation_date DATE,
    CONSTRAINT fk_collateral_app FOREIGN KEY (application_id) REFERENCES loan_applications(id),
    CONSTRAINT fk_collateral_valuer FOREIGN KEY (valuer_id) REFERENCES users(id)
);
