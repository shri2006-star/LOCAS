-- Seed initial users and applicant profiles for instant MySQL database visibility
INSERT INTO users (id, username, email, password_hash, full_name, role, active) VALUES
(1, 'sneha_nair', 'sneha.nair@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Sneha Nair', 'APPLICANT', TRUE),
(2, 'aarav_patel', 'aarav.patel@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Aarav Patel', 'APPLICANT', TRUE),
(3, 'rohan_deshmukh', 'rohan.deshmukh@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Rohan Deshmukh', 'APPLICANT', TRUE),
(4, 'applicant_user', 'applicant@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Sneha Nair', 'APPLICANT', TRUE),
(5, 'creditofficer', 'officer@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Kavita Menon', 'CREDIT_OFFICER', TRUE),
(6, 'credithead', 'head@locas.bank.com', '$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K', 'Rajesh Sharma', 'CREDIT_HEAD', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO applicants (id, user_id, full_name, date_of_birth, pan_number, aadhaar_hash, mobile_number, email, address, employment_type, annual_income, existing_emis) VALUES
(1, 1, 'Sneha Nair', '1993-05-14', 'ABCDE1234F', '123456789012', '9876543210', 'sneha.nair@locas.bank.com', 'Flat 402, Sunshine Heights, Bandra West, Mumbai 400050', 'SALARIED', 1800000.00, 25000.00),
(2, 2, 'Aarav Patel', '1990-08-22', 'BCDEF2345G', '234567890123', '9876543211', 'aarav.patel@locas.bank.com', 'Plot 12, Indiranagar, Bengaluru 560034', 'SALARIED', 2400000.00, 30000.00),
(3, 3, 'Rohan Deshmukh', '1988-11-10', 'CDEFG3456H', '345678901234', '9876543212', 'rohan.deshmukh@locas.bank.com', 'Baner Road, Pune 411007', 'SELF_EMPLOYED', 3200000.00, 45000.00),
(4, 4, 'Sneha Nair', '1993-05-14', 'DEFGH4567I', '456789012345', '9876543213', 'applicant@locas.bank.com', 'Flat 402, Sunshine Heights, Bandra West, Mumbai 400050', 'SALARIED', 1800000.00, 25000.00)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
