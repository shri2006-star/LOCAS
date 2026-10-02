CREATE TABLE field_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    verification_type VARCHAR(30) NOT NULL,
    assigned_to BIGINT,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visit_date DATE,
    status VARCHAR(30) NOT NULL,
    findings TEXT,
    gps_coordinates VARCHAR(100),
    document_url VARCHAR(255),
    CONSTRAINT fk_verif_app FOREIGN KEY (application_id) REFERENCES loan_applications(id),
    CONSTRAINT fk_verif_user FOREIGN KEY (assigned_to) REFERENCES users(id)
);
