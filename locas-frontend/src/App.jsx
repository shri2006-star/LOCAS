import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StaffLoginPage from './pages/StaffLoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicantDashboard from './pages/ApplicantDashboard';
import ApplicationWizard from './pages/ApplicationWizard';
import ApplicationQueuePage from './pages/ApplicationQueuePage';
import UnderwritingWorkbench from './pages/UnderwritingWorkbench';
import CreditHeadApprovals from './pages/CreditHeadApprovals';
import LoanAccountView from './pages/LoanAccountView';
import PortfolioDashboard from './pages/PortfolioDashboard';
import EarlyWarningsView from './pages/EarlyWarningsView';
import FieldVerificationView from './pages/FieldVerificationView';
import AdminDashboard from './pages/AdminDashboard';
import TrackLoanPage from './pages/TrackLoanPage';
import LoanHistoryPage from './pages/LoanHistoryPage';
import './styles/global.css';

const DashboardRouter = () => {
  let user = {};
  try {
    const userStr = localStorage.getItem('locas_user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = {};
  }

  if (user.role === 'ADMIN') {
    return <AdminDashboard />;
  } else if (user.role === 'CREDIT_HEAD') {
    return <CreditHeadApprovals />;
  } else if (user.role === 'CREDIT_OFFICER' || user.role === 'RELATIONSHIP_MANAGER') {
    return <ApplicationQueuePage />;
  } else if (user.role === 'FIELD_VERIFIER') {
    return <FieldVerificationView />;
  }
  return <ApplicantDashboard />;
};

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Customer & Staff Authentication Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/staff-login" element={<StaffLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Protected Shell Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/track-loan" element={<TrackLoanPage />} />
                <Route path="/loan-history" element={<LoanHistoryPage />} />
                <Route path="/apply/:product" element={<ApplicationWizard />} />
                <Route path="/applications" element={<ApplicationQueuePage />} />
                <Route path="/underwrite/:id" element={<UnderwritingWorkbench />} />
                <Route path="/approvals" element={<CreditHeadApprovals />} />
                <Route path="/loans/:id" element={<LoanAccountView />} />
                <Route path="/portfolio" element={<PortfolioDashboard />} />
                <Route path="/early-warnings" element={<EarlyWarningsView />} />
                <Route path="/verifications" element={<FieldVerificationView />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
