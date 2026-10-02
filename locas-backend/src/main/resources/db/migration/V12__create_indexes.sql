CREATE INDEX idx_app_status ON loan_applications(status);
CREATE INDEX idx_app_applicant ON loan_applications(applicant_id);
CREATE INDEX idx_emi_acc ON emi_payments(loan_account_id);
CREATE INDEX idx_early_warn_acc ON early_warnings(loan_account_id);
