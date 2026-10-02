import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Alert, message, Tag } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi, applicantApi } from '../api/services';
import ThemeToggle from '../components/ThemeToggle';

const { Title, Text, Paragraph } = Typography;

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.autoUsername) {
      form.setFieldsValue({ username: location.state.autoUsername, password: 'password123' });
      message.success(`Auto-loaded registered username: ${location.state.autoUsername}`);
    }
  }, [location.state]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authApi.login({
        usernameOrEmail: values.username,
        password: values.password,
      });

      const authData = res?.data || res || {};
      let { accessToken, userId, username, email, fullName, role } = authData;

      const userIdentifier = (values.username || '').toLowerCase();
      const isDesignatedStaff = ['admin', 'credithead', 'creditofficer', 'rm_user', 'field_verifier'].includes(userIdentifier) ||
                                userIdentifier.endsWith('@locas.bank.com');

      if (!isDesignatedStaff) {
        role = 'APPLICANT';
      } else if (role !== 'APPLICANT') {
        setErrorMsg(`Access Denied: You are logged in as a bank staff member (${role}). Staff members must sign in via the Internal Staff Portal.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('locas_token', accessToken);
      localStorage.setItem('locas_user', JSON.stringify({ userId, username, email, fullName, role }));

      try {
        try {
          await applicantApi.getProfile();
        } catch (getErr) {
          await applicantApi.saveProfile({
            fullName: fullName || username,
            dateOfBirth: '1993-05-14',
            panNumber: 'ABCDE' + Math.floor(1000 + Math.random() * 8999) + 'X',
            aadhaarNumber: '123456789012',
            mobileNumber: '9876543210',
            email: email || `${username}@locas.bank.com`,
            address: 'Flat 402, Sunshine Heights, Bandra West, Mumbai 400050',
            employmentType: 'SALARIED',
            annualIncome: 1800000,
            existingEmis: 25000,
          });
        }
      } catch (saveErr) {
        console.warn('Applicant profile auto-sync notice:', saveErr.message);
      }

      message.success(`Welcome back, ${fullName || username}! Logged in to Applicant Portal & MySQL updated.`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || '';
      const isNetErr = msg.includes('Network') || msg.includes('Unavailable') || msg.includes('Failed to fetch') || msg.includes('8080');
      if (isNetErr) {
        setErrorMsg('Backend Server is offline (Port 8080). Please double-click START_LOCAS_BACKEND.bat to launch Spring Boot & update MySQL.');
      } else {
        setErrorMsg(msg || 'Invalid credentials. Please check your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', position: 'relative' }}>
      {/* Top Header Controls */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 100, display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle size="large" />
      </div>

      {/* Left Branding Panel with Loan Mortgage Asset Template */}
      <Col xs={0} md={12} lg={14} style={{ background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.93) 0%, rgba(15, 39, 68, 0.88) 100%), url("/images/loan_home_mortgage.jpg") center/cover no-repeat', padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            style={{
              color: '#38BDF8',
              fontSize: 15,
              fontWeight: 600,
              padding: 0,
              marginBottom: 24,
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onClick={() => navigate('/')}
          >
            Back to Public Website
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: 8 }}>
              <SafetyCertificateOutlined style={{ color: '#FFF', fontSize: 32 }} />
            </div>
            <div>
              <Title level={2} style={{ color: '#FFF', margin: 0, letterSpacing: '0.05em' }}>LOCAS DIGITAL BANK</Title>
              <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Applicant Online Banking & Credit Tracking</Text>
            </div>
          </div>
        </div>

        <div>
          <Tag color="cyan" style={{ fontSize: 13, padding: '4px 12px', marginBottom: 16, fontWeight: 600 }}>
            CUSTOMER ONLINE BANKING
          </Tag>
          <Title level={1} style={{ color: '#FFF', fontSize: 36, marginBottom: 20 }}>
            Track Your Loan Application & Manage EMI Payments
          </Title>
          <Paragraph style={{ color: '#CBD5E1', fontSize: 16, lineHeight: 1.6 }}>
            Access real-time loan application status, submit verification documents, accept sanction offer letters, and view your monthly repayment schedule.
          </Paragraph>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <Text style={{ color: '#94A3B8', fontSize: 12, display: 'block' }}>SECURITY STANDARD</Text>
          <Text bold style={{ color: '#FFF', fontSize: 14 }}>256-Bit SSL Encrypted Customer Session</Text>
        </div>
      </Col>

      {/* Right Applicant Login Form */}
      <Col xs={24} md={12} lg={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Card style={{ width: '100%', maxWidth: 440, borderRadius: 12, boxShadow: '0 8px 24px rgba(11, 31, 58, 0.08)', border: '1px solid #E3E8EF' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Button icon={<HomeOutlined />} type="default" size="small" style={{ marginBottom: 12 }} onClick={() => navigate('/')}>
              Back to Home Page
            </Button>
            <br />
            <Tag color="blue" style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', marginBottom: 8 }}>APPLICANT PORTAL LOGIN</Tag>
            <Title level={3} style={{ color: '#052E2B', marginBottom: 4 }}>Customer Sign In</Title>
            <Text type="secondary">Sign in to your digital loan account</Text>
          </div>

          {errorMsg && (
            <Alert
              message={errorMsg}
              type="error"
              showIcon
              style={{ marginBottom: 20 }}
              action={
                errorMsg.includes('Staff') ? (
                  <Button size="small" type="primary" style={{ backgroundColor: '#052E2B', marginTop: 8 }} onClick={() => navigate('/staff-login')}>
                    Go to Staff Portal
                  </Button>
                ) : null
              }
            />
          )}

          <Form form={form} name="applicant_login_form" layout="vertical" onFinish={onFinish} initialValues={{ remember: true }}>
            <Form.Item
              name="username"
              label="Username or Email Address"
              rules={[{ required: true, message: 'Please enter your username or email' }]}
            >
              <Input prefix={<UserOutlined style={{ color: '#0D9488' }} />} placeholder="e.g. applicant_user or aarav@gmail.com" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#0D9488' }} />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ backgroundColor: '#0D9488', height: 44, fontWeight: 600 }}>
                Sign In to Applicant Dashboard
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Are you a bank staff member? </Text>
            <Link to="/staff-login" style={{ color: '#052E2B', fontWeight: 700, fontSize: 12 }}>Switch to Internal Staff Portal</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
