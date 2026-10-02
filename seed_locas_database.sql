-- ===================================================================
-- LOCAS BANKING SYSTEM - MASTER MYSQL DATABASE INITIALIZATION SCRIPT
-- Open and Execute this file in MySQL Workbench to instantly populate tables!
-- ===================================================================

CREATE DATABASE IF NOT EXISTS locas;
USE locas;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Applicants Table
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
    CONSTRAINT fk_applicant_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Credit Policies Table
CREATE TABLE IF NOT EXISTS credit_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_type VARCHAR(30) NOT NULL UNIQUE,
    max_foir_salaried DECIMAL(5, 2) NOT NULL,
    max_foir_self_employed DECIMAL(5, 2) NOT NULL,
    max_ltv DECIMAL(5, 2) NOT NULL,
    min_credit_score INT NOT NULL,
    min_income DECIMAL(15, 2) NOT NULL,
    max_loan_amount DECIMAL(15, 2) NOT NULL,
    base_interest_rate DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Loan Applications Table
CREATE TABLE IF NOT EXISTS loan_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_ref VARCHAR(50) NOT NULL UNIQUE,
    applicant_id BIGINT NOT NULL,
    product_type VARCHAR(30) NOT NULL,
    requested_amount DECIMAL(15, 2) NOT NULL,
    tenure_months INT NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(30) NOT NULL,
    assigned_officer_id BIGINT,
    credit_score INT,
    scorecard_score INT,
    decision_date TIMESTAMP,
    decided_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_officer FOREIGN KEY (assigned_officer_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_app_decided_by FOREIGN KEY (decided_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Initial Users
INSERT INTO users (id, username, email, password_hash, full_name, role, active) VALUES
(1, 'sneha_nair', 'sneha.nair@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Sneha Nair', 'APPLICANT', TRUE),
(2, 'aarav_patel', 'aarav.patel@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Aarav Patel', 'APPLICANT', TRUE),
(3, 'rohan_deshmukh', 'rohan.deshmukh@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Rohan Deshmukh', 'APPLICANT', TRUE),
(4, 'applicant_user', 'applicant@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Sneha Nair', 'APPLICANT', TRUE),
(5, 'creditofficer', 'officer@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Kavita Menon', 'CREDIT_OFFICER', TRUE),
(6, 'credithead', 'head@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Rajesh Sharma', 'CREDIT_HEAD', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Initial Applicants
INSERT INTO applicants (id, user_id, full_name, date_of_birth, pan_number, aadhaar_hash, mobile_number, email, address, employment_type, annual_income, existing_emis) VALUES
(1, 1, 'Sneha Nair', '1993-05-14', 'ABCDE1234F', '123456789012', '9876543210', 'sneha.nair@locas.bank.com', 'Flat 402, Sunshine Heights, Bandra West, Mumbai 400050', 'SALARIED', 1800000.00, 25000.00),
(2, 2, 'Aarav Patel', '1990-08-22', 'BCDEF2345G', '234567890123', '9876543211', 'aarav.patel@locas.bank.com', 'Plot 12, Indiranagar, Bengaluru 560034', 'SALARIED', 2400000.00, 30000.00),
(3, 3, 'Rohan Deshmukh', '1988-11-10', 'CDEFG3456H', '345678901234', '9876543212', 'rohan.deshmukh@locas.bank.com', 'Baner Road, Pune 411007', 'SELF_EMPLOYED', 3200000.00, 45000.00),
(4, 4, 'Sneha Nair', '1993-05-14', 'DEFGH4567I', '456789012345', '9876543213', 'applicant@locas.bank.com', 'Flat 402, Sunshine Heights, Bandra West, Mumbai 400050', 'SALARIED', 1800000.00, 25000.00)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Credit Policies
INSERT INTO credit_policies (product_type, max_foir_salaried, max_foir_self_employed, max_ltv, min_credit_score, min_income, max_loan_amount, base_interest_rate) VALUES
('HOME', 50.00, 60.00, 80.00, 700, 300000.00, 50000000.00, 8.50),
('PERSONAL', 50.00, 50.00, 0.00, 650, 250000.00, 2500000.00, 11.50),
('VEHICLE', 50.00, 55.00, 85.00, 680, 240000.00, 5000000.00, 9.25),
('EDUCATION', 45.00, 45.00, 0.00, 650, 300000.00, 7500000.00, 9.75),
('BUSINESS', 60.00, 60.00, 75.00, 700, 500000.00, 20000000.00, 12.00),
('GOLD', 65.00, 65.00, 75.00, 600, 100000.00, 10000000.00, 8.00),
('LAP', 50.00, 55.00, 70.00, 680, 400000.00, 30000000.00, 10.25)
ON DUPLICATE KEY UPDATE base_interest_rate=VALUES(base_interest_rate);

-- Seed Sample Loan Applications
INSERT INTO loan_applications (id, application_ref, applicant_id, product_type, requested_amount, tenure_months, purpose, status, assigned_officer_id, credit_score, scorecard_score) VALUES
(1, 'APP-2026-1001', 1, 'HOME', 3500000.00, 240, 'Purchase of 2BHK flat in Bandra West', 'SUBMITTED', 5, 780, 82),
(2, 'APP-2026-1002', 2, 'PERSONAL', 500000.00, 36, 'Medical Emergency & Interior Setup', 'UNDER_REVIEW', 5, 720, 68),
(3, 'APP-2026-1003', 3, 'BUSINESS', 5000000.00, 60, 'MSME Business Expansion', 'APPROVED', 6, 750, 75)
ON DUPLICATE KEY UPDATE status=VALUES(status);
