import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Tag, Button } from 'antd';
import {
  DashboardOutlined, FileAddOutlined, AuditOutlined, CheckSquareOutlined,
  BankOutlined, PieChartOutlined, SettingOutlined, UserOutlined,
  LogoutOutlined, BellOutlined, SafetyCertificateOutlined,
  MenuUnfoldOutlined, MenuFoldOutlined, AimOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let user = { fullName: 'Guest User', role: 'APPLICANT' };
  try {
    const userStr = localStorage.getItem('locas_user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = { fullName: 'Guest User', role: 'APPLICANT' };
  }

  const isStaff = user.role !== 'APPLICANT';

  const handleLogout = () => {
    const wasStaff = isStaff;
    localStorage.removeItem('locas_token');
    localStorage.removeItem('locas_user');
    if (wasStaff) {
      navigate('/staff-login');
    } else {
      navigate('/login');
    }
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: `Logged in: ${user.fullName}` },
    { key: 'role', label: <Tag color={isStaff ? 'gold' : 'blue'}>{user.role}</Tag> },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true, onClick: handleLogout },
  ];

  // Dynamic Navigation Items by Role
  const menuItemsByRole = {
    APPLICANT: [
      { key: '/dashboard', icon: <DashboardOutlined />, label: 'My Dashboard' },
      { key: '/apply/HOME', icon: <FileAddOutlined />, label: 'Apply for New Loan' },
      { key: '/track-loan', icon: <AimOutlined />, label: 'Track Application' },
      { key: '/loan-history', icon: <HistoryOutlined />, label: 'Loan History' },
    ],
    CREDIT_OFFICER: [
      { key: '/applications', icon: <FileAddOutlined />, label: 'Application Queue' },
      { key: '/early-warnings', icon: <BellOutlined />, label: 'Early Warnings' },
    ],
    CREDIT_HEAD: [
      { key: '/approvals', icon: <CheckSquareOutlined />, label: 'Sanction Approvals' },
      { key: '/portfolio', icon: <PieChartOutlined />, label: 'Portfolio Risk' },
      { key: '/early-warnings', icon: <BellOutlined />, label: 'Early Warnings' },
    ],
    FIELD_VERIFIER: [
      { key: '/verifications', icon: <AimOutlined />, label: 'Field Verifications' },
    ],
    RELATIONSHIP_MANAGER: [
      { key: '/applications', icon: <FileAddOutlined />, label: 'RM Applications' },
    ],
    ADMIN: [
      { key: '/admin', icon: <SettingOutlined />, label: 'System Governance' },
      { key: '/applications', icon: <FileAddOutlined />, label: 'Application Queue' },
      { key: '/portfolio', icon: <PieChartOutlined />, label: 'Portfolio Analytics' },
      { key: '/early-warnings', icon: <BellOutlined />, label: 'Early Warnings' },
      { key: '/verifications', icon: <AimOutlined />, label: 'Field Verifications' },
    ],
  };

  const navItems = menuItemsByRole[user.role] || menuItemsByRole.APPLICANT;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        theme="dark"
        style={{
          background: isStaff ? '#031716' : '#052E2B',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ padding: '16px 12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyCertificateOutlined style={{ color: isStaff ? '#06B6D4' : '#0D9488', fontSize: 24 }} />
            {!collapsed && (
              <Text bold style={{ color: '#FFF', fontSize: 18, letterSpacing: '0.05em', lineHeight: 1 }}>
                {isStaff ? 'LOCAS OPS' : 'LOCAS BANK'}
              </Text>
            )}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: isStaff ? '#031716' : '#052E2B', padding: '12px 4px' }}
        />
      </Sider>

      <Layout>
        {/* Header Bar */}
        <Header
          style={{
            background: isStaff ? '#052E2B' : '#FFFFFF',
            padding: '0 24px',
            height: 64,
            lineHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isStaff ? '1px solid #1E293B' : '1px solid #E3E8EF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            width: '100%',
          }}
        >
          {/* Left Side Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: isStaff ? '#FFF' : '#0F172A', fontSize: 16 }}
            />

            {/* Portal Type Indicator Tag */}
            {isStaff ? (
              <Tag color="gold" style={{ fontWeight: 700, padding: '4px 12px', borderRadius: 4, margin: 0, lineHeight: '20px' }}>
                INTERNAL BANK OPERATIONS CONSOLE ({user.role})
              </Tag>
            ) : (
              <Tag color="cyan" style={{ fontWeight: 600, padding: '4px 10px', borderRadius: 4, margin: 0, lineHeight: '20px' }}>
                CUSTOMER ONLINE BANKING PORTAL
              </Tag>
            )}

            <Tag color="success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, margin: 0 }}>
              ● LIVE • RBI DIGITAL LENDING ENGINE
            </Tag>

            <Tag color="gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, margin: 0 }}>
              🏦 {localStorage.getItem('locas_selected_bank') || 'State Bank of India'}
            </Tag>

            <Tag color="purple" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, margin: 0 }}>
              📍 {localStorage.getItem('locas_selected_location') || 'Chennai - Anna Nagar Branch'}
            </Tag>
          </div>

          {/* Far Right Corner User Dropdown & Dark/Light Theme Toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, height: '100%' }}>
            <ThemeToggle size="middle" />

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 12px', borderRadius: 6, backgroundColor: isStaff ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: isStaff ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                <Avatar style={{ backgroundColor: isStaff ? '#D98C00' : '#0D9488' }} icon={<UserOutlined />} size={34} />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <Text bold style={{ color: isStaff ? '#FFF' : '#0F172A', display: 'block', fontSize: 13, lineHeight: '16px' }}>
                    {user.fullName}
                  </Text>
                  <Text style={{ color: isStaff ? '#94A3B8' : '#64748B', fontSize: 11, lineHeight: '14px', display: 'block' }}>
                    {user.role}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content Area */}
        <Content style={{ margin: '24px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
