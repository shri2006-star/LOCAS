CREATE TABLE IF NOT EXISTS applicants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    pan_number VARCHAR(10) NOT NULL UNIQUE,
    aadhaar_hash VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    employment_type VARCHAR(30) NOT NULL,
    annual_income DECIMAL(15, 2) NOT NULL,
    existing_emis DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_applicant_user FOREIGN KEY (user_id) REFERENCES users(id)
);
