import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Alert, message, Tag } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/services';
import ThemeToggle from '../components/ThemeToggle';

const { Title, Text, Paragraph } = Typography;

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: 'APPLICANT',
      });

      const authData = res?.data || res || {};
      const targetUser = authData.username || values.username;

      message.success(`Account created successfully for ${targetUser}! Please sign in to continue.`);
      navigate('/login', { state: { autoUsername: targetUser } });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check input parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', position: 'relative' }}>
      {/* Top Header Navigation Controls */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 100, display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle size="large" />
      </div>

      {/* Left Branding Panel with Mortgage Template Asset */}
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
              <IdcardOutlined style={{ color: '#FFF', fontSize: 32 }} />
            </div>
            <div>
              <Title level={2} style={{ color: '#FFF', margin: 0, letterSpacing: '0.05em' }}>LOCAS DIGITAL BANK</Title>
              <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Instant Paperless Account & Loan Registration</Text>
            </div>
          </div>
        </div>

        <div>
          <Tag color="cyan" style={{ fontSize: 13, padding: '4px 12px', marginBottom: 16, fontWeight: 600 }}>
            RBI COMPLIANT REGISTRATION
          </Tag>
          <Title level={1} style={{ color: '#FFF', fontSize: 36, marginBottom: 20, lineHeight: 1.2 }}>
            Open Your Banking Portal in under 2 Minutes
          </Title>
          <Paragraph style={{ color: '#CBD5E1', fontSize: 16, lineHeight: 1.6 }}>
            Get immediate access to automated CIBIL bureau pulls, instant eligibility checks, low EMI housing loans, and real-time application tracking.
          </Paragraph>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <Text style={{ color: '#94A3B8', fontSize: 12, display: 'block' }}>DATA PRIVACY & GUARANTEE</Text>
          <Text bold style={{ color: '#FFF', fontSize: 14 }}>256-Bit SSL Encrypted NSDL & CIBIL Direct Link</Text>
        </div>
      </Col>

      {/* Right Form Column */}
      <Col xs={24} md={12} lg={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Card style={{ width: '100%', maxWidth: 440, borderRadius: 12, boxShadow: '0 8px 24px rgba(11, 31, 58, 0.08)', border: '1px solid #E3E8EF' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ color: '#0B1F3A', marginBottom: 6 }}>Create LOCAS Account</Title>
            <Text type="secondary">Register for digital loan application & tracking</Text>
          </div>

          {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 20 }} />}

          <Form form={form} name="register_form" layout="vertical" onFinish={onFinish} initialValues={{ role: 'APPLICANT' }}>
            <Form.Item
              name="fullName"
              label="Full Name (as per PAN)"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input prefix={<IdcardOutlined style={{ color: '#1769AA' }} />} placeholder="e.g. Aarav Patel" size="large" />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please choose a unique username' }]}
            >
              <Input prefix={<UserOutlined style={{ color: '#1769AA' }} />} placeholder="e.g. aarav_patel" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input prefix={<MailOutlined style={{ color: '#1769AA' }} />} placeholder="aarav@gmail.com" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#1769AA' }} />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ backgroundColor: '#0B1F3A', height: 44, fontWeight: 600 }}>
                Complete Registration
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>Already registered? </Text>
              <Link to="/login" style={{ color: '#1769AA', fontWeight: 600 }}>Sign In</Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;
