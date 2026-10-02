import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const applicantApi = {
  getProfile: () => api.get('/applicants/me'),
  saveProfile: (data) => api.post('/applicants', data),
  getById: (id) => api.get(`/applicants/${id}`),
};

export const applicationApi = {
  create: (data) => api.post('/applications', data),
  submit: (id) => api.post(`/applications/${id}/submit`),
  getById: (id) => api.get(`/applications/${id}`),
  getMyApplications: () => api.get('/applications/my-applications'),
  search: (params) => api.get('/applications', { params }),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, null, { params: { status } }),
  uploadDocument: (id, documentType, file) => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);
    return api.post(`/applications/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getDocuments: (id) => api.get(`/applications/${id}/documents`),
};

export const bureauApi = {
  fetchReport: (applicationId, bureauName, consentRecordId) =>
    api.post(`/bureau/fetch/${applicationId}`, { bureauName, consentRecordId }),
  getReports: (applicationId) => api.get(`/bureau/${applicationId}/reports`),
};

export const scoringApi = {
  calculateScore: (applicationId) => api.post(`/scoring/calculate/${applicationId}`),
  getScore: (applicationId) => api.get(`/scoring/${applicationId}`),
};

export const underwritingApi = {
  submitDecision: (applicationId, decisionData) =>
    api.post(`/underwriting/decision/${applicationId}`, decisionData),
};

export const offerApi = {
  getByApplicationId: (applicationId) => api.get(`/offers/application/${applicationId}`),
  acceptOffer: (id) => api.put(`/offers/${id}/accept`),
};

export const disbursementApi = {
  disburse: (disbursementData) => api.post('/disbursements', disbursementData),
};

export const loanApi = {
  getAccountByApplication: (applicationId) => api.get(`/loans/application/${applicationId}`),
  getById: (id) => api.get(`/loans/${id}`),
  getAll: () => api.get('/loans'),
  getEmiSchedule: (id) => api.get(`/loans/${id}/emi-schedule`),
  recordPayment: (id, paymentData) => api.post(`/loans/${id}/payments`, paymentData),
};

export const npaApi = {
  getEarlyWarnings: () => api.get('/portfolio/early-warnings'),
  getNpaCategory: (id) => api.get(`/loans/${id}/npa`),
  triggerWarning: (id, warningType, severity, actionTaken) =>
    api.post(`/loans/${id}/early-warning`, null, { params: { warningType, severity, actionTaken } }),
};

export const verificationApi = {
  getAll: () => api.get('/verifications'),
  getByApplication: (applicationId) => api.get(`/verifications/application/${applicationId}`),
  create: (data) => api.post('/verifications', data),
  update: (id, data) => api.put(`/verifications/${id}`, data),
  complete: (id, findings, gpsCoordinates) =>
    api.post(`/verifications/${id}/complete`, null, { params: { findings, gpsCoordinates } }),
};

export const dashboardApi = {
  getApplicationMetrics: () => api.get('/dashboard/applications'),
  getPortfolioMetrics: () => api.get('/dashboard/portfolio'),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteApplication: (id) => api.delete(`/admin/applications/${id}`),
  getAuditLogs: (page = 0, size = 20) => api.get('/admin/audit-logs', { params: { page, size } }),
  getCreditPolicies: () => api.get('/admin/credit-policy'),
  saveCreditPolicy: (policy) => api.post('/admin/credit-policy', policy),
  getRegulatoryReports: () => api.get('/admin/regulatory-reports'),
};
