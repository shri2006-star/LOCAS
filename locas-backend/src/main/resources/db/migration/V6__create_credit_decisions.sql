CREATE TABLE credit_decisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    decision_type VARCHAR(30) NOT NULL,
    recommended_amount DECIMAL(15, 2) NOT NULL,
    recommended_tenure INT NOT NULL,
    roi DECIMAL(5, 2) NOT NULL,
    decided_by BIGINT NOT NULL,
    decision_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rationale TEXT NOT NULL,
    deviations TEXT,
    CONSTRAINT fk_decision_app FOREIGN KEY (application_id) REFERENCES loan_applications(id),
    CONSTRAINT fk_decision_user FOREIGN KEY (decided_by) REFERENCES users(id)
);
