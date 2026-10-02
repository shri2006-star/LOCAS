import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Alert, Tag, message, Select, Space } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined, ArrowLeftOutlined, HomeOutlined, SafetyOutlined, CrownOutlined, AuditOutlined, CompassOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api/services';
import ThemeToggle from '../components/ThemeToggle';

const { Title, Text, Paragraph } = Typography;

const STAFF_ROLES = [
  {
    key: 'creditofficer',
    username: 'creditofficer',
    roleName: 'Credit Officer',
    badge: 'Underwriting',
    icon: <AuditOutlined style={{ color: '#0D9488' }} />,
    color: 'cyan',
    desc: 'Verify applications, review documents & run CIBIL checks',
  },
  {
    key: 'credithead',
    username: 'credithead',
    roleName: 'Credit Head / Risk Manager',
    badge: 'Sanction Approval',
    icon: <CrownOutlined style={{ color: '#D97706' }} />,
    color: 'gold',
    desc: 'Approve high-value loans, policy exceptions & portfolio risk',
  },
  {
    key: 'rm_user',
    username: 'rm_user',
    roleName: 'Relationship Manager',
    badge: 'Intake & Sales',
    icon: <SafetyOutlined style={{ color: '#2563EB' }} />,
    color: 'blue',
    desc: 'Manage applicant onboarding & customer relationship',
  },
  {
    key: 'field_verifier',
    username: 'field_verifier',
    roleName: 'Field Inspection Officer',
    badge: 'Site Verifier',
    icon: <CompassOutlined style={{ color: '#7C3AED' }} />,
    color: 'purple',
    desc: 'Physical site visits, property valuation & employment verification',
  },
  {
    key: 'admin',
    username: 'admin',
    roleName: 'Bank System Admin',
    badge: 'Superuser',
    icon: <SettingOutlined style={{ color: '#DC2626' }} />,
    color: 'red',
    desc: 'System configuration, credit policy rules & audit management',
  }
];

export const StaffLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRoleKey, setSelectedRoleKey] = useState('creditofficer');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.autoUsername) {
      const matchedRole = STAFF_ROLES.find(r => r.username === location.state.autoUsername);
      if (matchedRole) setSelectedRoleKey(matchedRole.key);
      form.setFieldsValue({ username: location.state.autoUsername, password: 'password123' });
      message.success(`Auto-loaded registered username: ${location.state.autoUsername}`);
    } else {
      // Default auto-fill for smooth testing
      form.setFieldsValue({ username: 'creditofficer', password: 'password123' });
    }
  }, [location.state, form]);

  const handleRoleSelect = (roleKey) => {
    setSelectedRoleKey(roleKey);
    const targetRole = STAFF_ROLES.find(r => r.key === roleKey);
    if (targetRole) {
      form.setFieldsValue({
        username: targetRole.username,
        password: 'password123',
      });
      message.info(`Selected ${targetRole.roleName} credentials (${targetRole.username})`);
    } else {
      form.setFieldsValue({ username: '', password: '' });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authApi.login({
        usernameOrEmail: values.username,
        password: values.password,
      });

      const authData = res?.data || res || {};
      const { accessToken, userId, username, email, fullName, role } = authData;

      if (role === 'APPLICANT') {
        setErrorMsg('Access Denied: Customer / Applicant credentials cannot access the Internal Bank Operations Portal. Please sign in via the Applicant Portal.');
        setLoading(false);
        return;
      }

      localStorage.setItem('locas_token', accessToken);
      localStorage.setItem('locas_user', JSON.stringify({ userId, username, email, fullName, role }));

      message.success(`Staff Authentication Successful. Logged in as ${fullName} (${role})`);

      if (role === 'CREDIT_HEAD' || role === 'ADMIN') {
        navigate('/portfolio');
      } else if (role === 'CREDIT_OFFICER' || role === 'RELATIONSHIP_MANAGER') {
        navigate('/applications');
      } else if (role === 'FIELD_VERIFIER') {
        navigate('/verifications');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid staff credentials or unauthorized role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: '100vh', backgroundColor: '#031716', position: 'relative' }}>
      {/* Top Header Controls */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 100, display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle size="large" />
      </div>

      {/* Left Corporate Panel with 3D Digital Bank Building Asset Template */}
      <Col xs={0} md={12} lg={13} style={{ background: 'linear-gradient(135deg, rgba(3, 23, 22, 0.94) 0%, rgba(5, 46, 43, 0.88) 100%), url("/images/digital_bank_building.jpg") center/cover no-repeat', padding: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ backgroundColor: '#0D9488', padding: '12px 16px', borderRadius: 8 }}>
              <BankOutlined style={{ color: '#FFF', fontSize: 32 }} />
            </div>
            <div>
              <Title level={2} style={{ color: '#FFF', margin: 0, letterSpacing: '0.05em' }}>LOCAS ENTERPRISE</Title>
              <Text style={{ color: '#06B6D4', fontSize: 13, fontWeight: 600 }}>Internal Bank Operations & Credit Risk Console</Text>
            </div>
          </div>
        </div>

        <div>
          <Tag color="gold" style={{ fontSize: 13, padding: '4px 12px', marginBottom: 16, fontWeight: 600 }}>
            INTERNAL RESTRICTED SYSTEM
          </Tag>
          <Title level={1} style={{ color: '#FFF', fontSize: 34, marginBottom: 20, lineHeight: 1.2 }}>
            Credit Underwriting, Maker-Checker & Governance Portal
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>
            Authorized personnel only. Access to multi-bureau CIBIL data, automated risk scorecards, policy exception approval workflows, and RBI statutory reporting.
          </Paragraph>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
          <Text style={{ color: '#64748B', fontSize: 12, display: 'block' }}>AUDIT & COMPLIANCE</Text>
          <Text style={{ color: '#94A3B8', fontSize: 13 }}>All staff sessions are geo-logged and audited per RBI Cyber Security Framework.</Text>
        </div>
      </Col>

      {/* Right Form */}
      <Col xs={24} md={12} lg={11} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', backgroundColor: '#052E2B' }}>
        <Card style={{ width: '100%', maxWidth: 480, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)', border: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Button icon={<HomeOutlined />} type="default" size="small" style={{ marginBottom: 8 }} onClick={() => navigate('/')}>
              Back to Home Page
            </Button>
            <br />
            <Tag color="volcano" style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', marginBottom: 6 }}>INTERNAL BANK STAFF ONLY</Tag>
            <Title level={3} style={{ color: '#052E2B', margin: '2px 0 2px' }}>Staff Authentication</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>Select staff role or enter corporate credentials</Text>
          </div>

          {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}

          {/* Multiple Choice Staff Role Dropdown */}
          <div style={{ marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <Text bold style={{ fontSize: 12, color: '#334155', display: 'block', marginBottom: 6 }}>
              🎯 MULTIPLE CHOICE STAFF ROLE SELECTOR:
            </Text>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={selectedRoleKey}
              onChange={handleRoleSelect}
              placeholder="Select Staff Account Role"
            >
              {STAFF_ROLES.map((r) => (
                <Select.Option key={r.key} value={r.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{r.icon} <strong style={{ marginLeft: 6 }}>{r.roleName}</strong> ({r.username})</span>
                    <Tag color={r.color} style={{ fontSize: 10, margin: 0 }}>{r.badge}</Tag>
                  </div>
                </Select.Option>
              ))}
              <Select.Option value="custom">
                <span>✏️ <em>Custom Corporate Credentials (Manual Input)</em></span>
              </Select.Option>
            </Select>
          </div>

          <Form form={form} name="staff_login_form" layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="username"
              label="Corporate Username / Email"
              rules={[{ required: true, message: 'Please enter corporate username' }]}
              style={{ marginBottom: 12 }}
            >
              <Input prefix={<UserOutlined style={{ color: '#0D9488' }} />} placeholder="e.g. creditofficer or credithead" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#0D9488' }} />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ backgroundColor: '#052E2B', height: 44, fontWeight: 700 }}>
                Sign In to Bank Console
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Are you a loan applicant? </Text>
            <Link to="/login" style={{ color: '#0D9488', fontWeight: 600, fontSize: 12 }}>Go to Applicant Portal Login</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default StaffLoginPage;
