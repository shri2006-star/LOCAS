-- Credit Policies Seed Data (Required for loan product rules & calculations)
INSERT INTO credit_policies (product_type, max_foir_salaried, max_foir_self_employed, max_ltv, min_credit_score, min_income, max_loan_amount, base_interest_rate) VALUES
('HOME', 50.00, 60.00, 80.00, 700, 300000.00, 50000000.00, 8.50),
('PERSONAL', 50.00, 50.00, 0.00, 650, 250000.00, 2500000.00, 11.50),
('VEHICLE', 50.00, 55.00, 85.00, 680, 240000.00, 5000000.00, 9.25),
('EDUCATION', 45.00, 45.00, 0.00, 650, 300000.00, 7500000.00, 9.75),
('BUSINESS', 60.00, 60.00, 75.00, 700, 500000.00, 20000000.00, 12.00),
('GOLD', 65.00, 65.00, 75.00, 600, 100000.00, 10000000.00, 8.00),
('LAP', 50.00, 55.00, 70.00, 680, 400000.00, 30000000.00, 10.25);
