import React, { useState } from 'react';
import { Button, Row, Col, Card, Typography, Tag, Space, Divider, Modal, Tabs, message, Select, Input } from 'antd';
import {
  SafetyCertificateOutlined, CheckCircleOutlined, ThunderboltOutlined,
  HomeOutlined, UserOutlined, CarOutlined, ReadOutlined, ShopOutlined,
  GoldOutlined, BankOutlined, ArrowRightOutlined, LockOutlined, AuditOutlined,
  UserAddOutlined, LoginOutlined, CalculatorOutlined, CompassOutlined, SafetyOutlined,
  EnvironmentOutlined, SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EMICalculator from '../components/EMICalculator';
import EligibilityChecker from '../components/EligibilityChecker';
import ThemeToggle from '../components/ThemeToggle';
import { INDIAN_CITIES, CITY_BRANCHES, getBranchesForCity } from '../utils/bankLocations';

const { Title, Paragraph, Text } = Typography;

export const INDIAN_BANKS = [
  { id: 'sbi', name: 'State Bank of India', code: 'SBI', type: 'Public Sector', logo: '🏛️' },
  { id: 'ib', name: 'Indian Bank', code: 'IB', type: 'Public Sector', logo: '🏛️' },
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', type: 'Private Sector', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI', type: 'Private Sector', logo: '🏦' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS', type: 'Private Sector', logo: '🏦' },
  { id: 'bob', name: 'Bank of Baroda', code: 'BOB', type: 'Public Sector', logo: '🏛️' },
  { id: 'cnb', name: 'Canara Bank', code: 'CNB', type: 'Public Sector', logo: '🏛️' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB', type: 'Public Sector', logo: '🏛️' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isInstantApprovalModalOpen, setIsInstantApprovalModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  
  // Separate states for Bank Name and Branch Location
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(localStorage.getItem('locas_selected_bank') || 'State Bank of India');
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeCityId, setActiveCityId] = useState(localStorage.getItem('locas_selected_city_id') || 'chennai');
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem('locas_selected_location') || 'Chennai - Anna Nagar Branch'
  );
  const [branchSearchQuery, setBranchSearchQuery] = useState('');

  const loanProducts = [
    { key: 'HOME', title: 'Home Loan', icon: <HomeOutlined style={{ fontSize: 28, color: '#0D9488' }} />, rate: '8.50% p.a.', tenure: 'Up to 30 Yrs', foir: '50% Max FOIR', desc: 'Finance your dream home with low floating rates and zero pre-closure penalty.' },
    { key: 'PERSONAL', title: 'Personal Loan', icon: <UserOutlined style={{ fontSize: 28, color: '#10B981' }} />, rate: '11.50% p.a.', tenure: 'Up to 5 Yrs', foir: '50% Max FOIR', desc: 'Instant collateral-free loan up to ₹25 Lakhs disbursed within 24 hours.' },
    { key: 'VEHICLE', title: 'Vehicle Loan', icon: <CarOutlined style={{ fontSize: 28, color: '#168A5B' }} />, rate: '9.25% p.a.', tenure: 'Up to 7 Yrs', foir: '50% Max FOIR', desc: 'Drive your new vehicle home with up to 85% on-road funding and flexible EMIs.' },
    { key: 'EDUCATION', title: 'Education Loan', icon: <ReadOutlined style={{ fontSize: 28, color: '#D98C00' }} />, rate: '9.75% p.a.', tenure: 'Up to 15 Yrs', foir: '45% Max FOIR', desc: 'Empower premier higher education in India & overseas with easy moratorium.' },
    { key: 'BUSINESS', title: 'Business Loan', icon: <ShopOutlined style={{ fontSize: 28, color: '#052E2B' }} />, rate: '12.00% p.a.', tenure: 'Up to 10 Yrs', foir: '60% Max FOIR', desc: 'Working capital & business expansion loans up to ₹2 Crores for MSMEs.' },
    { key: 'GOLD', title: 'Gold Loan', icon: <GoldOutlined style={{ fontSize: 28, color: '#D98C00' }} />, rate: '8.00% p.a.', tenure: 'Up to 3 Yrs', foir: '65% Max FOIR', desc: 'Instant liquidity against gold ornaments with secure vault custody.' },
    { key: 'LAP', title: 'Loan Against Property', icon: <BankOutlined style={{ fontSize: 28, color: '#0D9488' }} />, rate: '10.25% p.a.', tenure: 'Up to 15 Yrs', foir: '50% Max FOIR', desc: 'Unlock maximum value from commercial or residential real estate property.' },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Header Bar */}
      <div
        className="glass-header"
        style={{
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: '#031716',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Corner Group: Brand Logo & Navigation Links (up to Security & Compliance) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ backgroundColor: '#0D9488', padding: '8px 12px', borderRadius: 8 }}>
              <SafetyCertificateOutlined style={{ color: '#FFF', fontSize: 22 }} />
            </div>
            <div>
              <Text bold style={{ color: '#FFF', fontSize: 20, letterSpacing: '0.04em', display: 'block', lineHeight: 1.1 }}>LOCAS DIGITAL BANK</Text>
              <Text style={{ color: '#94A3B8', fontSize: 11 }}>RBI Compliant Credit Engine</Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Button
              type="text"
              icon={<ShopOutlined style={{ color: '#06B6D4' }} />}
              style={{ color: '#CBD5E1', fontWeight: 600, fontSize: 14 }}
              onClick={() => scrollToSection('products')}
            >
              Loan Products
            </Button>
            <Button
              type="text"
              icon={<CalculatorOutlined style={{ color: '#06B6D4' }} />}
              style={{ color: '#CBD5E1', fontWeight: 600, fontSize: 14 }}
              onClick={() => setIsCalculatorModalOpen(true)}
            >
              Calculators
            </Button>
            <Button
              type="text"
              icon={<LockOutlined style={{ color: '#06B6D4' }} />}
              style={{ color: '#CBD5E1', fontWeight: 600, fontSize: 14 }}
              onClick={() => scrollToSection('features')}
            >
              Security & Compliance
            </Button>
          </div>
        </div>

        {/* Right Corner Group: Bank Name Selector, Location Selector & Theme Toggle */}
        <Space size="small">
          {/* Button 1: Select Bank Name */}
          <Button
            type="default"
            ghost
            icon={<BankOutlined style={{ color: '#F59E0B' }} />}
            style={{
              color: '#FFF',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.18)',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              height: 38,
            }}
            onClick={() => setIsBankModalOpen(true)}
          >
            🏦 {selectedBank} ▾
          </Button>

          {/* Button 2: Select Branch Location */}
          <Button
            type="default"
            ghost
            icon={<EnvironmentOutlined style={{ color: '#06B6D4' }} />}
            style={{
              color: '#FFF',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.18)',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              height: 38,
            }}
            onClick={() => setIsLocationModalOpen(true)}
          >
            📍 {selectedLocation} ▾
          </Button>

          <ThemeToggle size="middle" />
        </Space>
      </div>

      {/* Hero Banner Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #031716 0%, #052E2B 60%, #0A4740 100%)',
          color: '#FFF',
          padding: '64px 24px 72px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <Tag color="cyan" style={{ fontSize: 13, padding: '6px 18px', marginBottom: 20, borderRadius: 20, fontWeight: 700 }}>
            <ThunderboltOutlined /> Real-Time Automated Credit Underwriting & Decisioning
          </Tag>
          
          <Title level={1} style={{ color: '#FFF', fontSize: 46, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
            Digital Lending Powered by Real-Time Credit Intelligence
          </Title>

          <Paragraph style={{ color: '#CBD5E1', fontSize: 17, maxWidth: 780, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Experience instant CIBIL/Experian bureau checks, automated FOIR & LTV risk assessment, transparent sanction offers, and fast direct-account disbursements.
          </Paragraph>

          {/* Action Buttons */}
          <div style={{ marginBottom: 44, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', height: 48, padding: '0 28px', fontWeight: 700, borderRadius: 8, fontSize: 15 }}
              onClick={() => navigate('/register')}
            >
              Apply / Register Account
            </Button>

            <Button
              type="default"
              size="large"
              icon={<LoginOutlined />}
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)', height: 48, padding: '0 28px', fontWeight: 600, borderRadius: 8, fontSize: 15 }}
              onClick={() => navigate('/login')}
            >
              Applicant Portal Sign In
            </Button>

            <Button
              type="default"
              size="large"
              icon={<CalculatorOutlined />}
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.4)', height: 48, padding: '0 28px', fontWeight: 700, borderRadius: 8, fontSize: 15 }}
              onClick={() => setIsCalculatorModalOpen(true)}
            >
              Open Financial Calculators
            </Button>
          </div>

          {/* Key Metrics Strip */}
          <Row gutter={[24, 24]} style={{ paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <Col xs={12} sm={6}>
              <Text bold style={{ color: '#FFF', fontSize: 24, display: 'block' }}>₹125+ Cr</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12 }}>Total Disbursed Portfolio</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text bold style={{ color: '#FFF', fontSize: 24, display: 'block' }}>&lt; 24 Hours</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12 }}>Average Turnaround Time</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text bold style={{ color: '#FFF', fontSize: 24, display: 'block' }}>4 Credit Bureaus</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12 }}>CIBIL • Experian • Equifax • CRIF</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text bold style={{ color: '#FFF', fontSize: 24, display: 'block' }}>100% Paperless</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12 }}>Digital KYC & NACH Mandate</Text>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: 1280, margin: '48px auto 60px', padding: '0 24px' }}>

        {/* Section 1: Feature Banners */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          <Col xs={24} md={12}>
            <Card
              bodyStyle={{ padding: 28 }}
              style={{
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(3, 23, 22, 0.94) 0%, rgba(5, 46, 43, 0.88) 100%), url("/images/digital_bank_building.jpg") center/cover no-repeat',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                color: '#FFF',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 14 }}>
                  <BankOutlined /> NEXT-GEN DIGITAL BANKING
                </Tag>
                <Title level={3} style={{ color: '#FFF', marginBottom: 12 }}>
                  Automated Digital Credit Engine
                </Title>
                <Paragraph style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.6 }}>
                  Direct API integration with CIBIL, Experian & NSDL for automated KYC verification, bank statement parsing, and instant loan decisioning.
                </Paragraph>
              </div>
              <Button
                type="primary"
                style={{ backgroundColor: '#06B6D4', borderColor: '#06B6D4', fontWeight: 700, borderRadius: 6, width: 'fit-content', marginTop: 16 }}
                onClick={() => setIsInstantApprovalModalOpen(true)}
              >
                Check Instant Pre-Approval →
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              bodyStyle={{ padding: 28 }}
              style={{
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(3, 23, 22, 0.94) 0%, rgba(5, 46, 43, 0.88) 100%), url("/images/loan_home_mortgage.jpg") center/cover no-repeat',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                color: '#FFF',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Tag color="green" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 14 }}>
                  <HomeOutlined /> MORTGAGE & PROPERTY LOANS
                </Tag>
                <Title level={3} style={{ color: '#FFF', marginBottom: 12 }}>
                  Low EMI Housing & Property Loans
                </Title>
                <Paragraph style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.6 }}>
                  Finance your dream property starting at 8.50% p.a. with zero pre-closure penalty and flexible tenure up to 30 years.
                </Paragraph>
              </div>
              <Button
                type="primary"
                style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700, borderRadius: 6, width: 'fit-content', marginTop: 16 }}
                onClick={() => setIsEmiModalOpen(true)}
              >
                Calculate Home Loan EMI →
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Section 2: Loan Products Grid */}
        <div id="products" style={{ marginBottom: 48 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Tag color="gold" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              CREDIT PRODUCTS & INTEREST RATES
            </Tag>
            <Title level={2} style={{ color: '#052E2B', margin: 0 }}>Tailored Financial Loan Solutions</Title>
            <Text type="secondary" style={{ fontSize: 15 }}>Select a credit product designed for your personal and commercial goals</Text>
          </div>

          <Row gutter={[20, 20]} justify="center">
            {loanProducts.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p.key} style={{ display: 'flex' }}>
                <Card
                  hoverable
                  bodyStyle={{ padding: 22, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  style={{ width: '100%', borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      {p.icon}
                      <Tag color="blue" style={{ fontWeight: 700, fontSize: 12, margin: 0 }}>{p.rate}</Tag>
                    </div>
                    <Text bold style={{ fontSize: 17, color: '#052E2B', display: 'block', marginBottom: 8 }}>{p.title}</Text>
                    <Paragraph type="secondary" style={{ fontSize: 12, minHeight: 44, lineHeight: 1.5, marginBottom: 16 }}>{p.desc}</Paragraph>
                    <div style={{ fontSize: 11, color: '#475569', background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, marginBottom: 18, border: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>Tenure:</span> <strong>{p.tenure}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Policy Cap:</span> <strong>{p.foir}</strong>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    block
                    style={{ backgroundColor: '#052E2B', height: 40, fontWeight: 600, borderRadius: 6 }}
                    onClick={() => navigate(`/apply/${p.key}`)}
                  >
                    Apply for {p.title}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section 3: Security & RBI Compliance */}
        <div id="features" style={{ marginBottom: 40 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 12, textAlign: 'center', height: '100%', border: '1px solid #E2E8F0' }}>
                <LockOutlined style={{ fontSize: 36, color: '#0D9488', marginBottom: 14 }} />
                <Title level={4} style={{ color: '#052E2B', marginBottom: 8 }}>Bank-Grade 256-Bit Security</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>Encrypted API channels and strict data protection standards for confidential customer KYC records.</Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 12, textAlign: 'center', height: '100%', border: '1px solid #E2E8F0' }}>
                <AuditOutlined style={{ fontSize: 36, color: '#168A5B', marginBottom: 14 }} />
                <Title level={4} style={{ color: '#052E2B', marginBottom: 8 }}>Transparent Pricing & Zero Hidden Fees</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>Complete transparency on APR, processing fees, FOIR thresholds, and sanction conditions.</Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 12, textAlign: 'center', height: '100%', border: '1px solid #E2E8F0' }}>
                <CheckCircleOutlined style={{ fontSize: 36, color: '#10B981', marginBottom: 14 }} />
                <Title level={4} style={{ color: '#052E2B', marginBottom: 8 }}>RBI Digital Lending Compliant</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>Adheres strictly to RBI Fair Practices Code, Key Fact Statement (KFS) rules, and DL guidelines.</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Corporate Footer */}
      <div style={{ backgroundColor: '#031716', color: '#CBD5E1', padding: '48px 40px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <SafetyCertificateOutlined style={{ color: '#0D9488', fontSize: 24 }} />
                <Text bold style={{ color: '#FFF', fontSize: 20, letterSpacing: '0.04em' }}>LOCAS DIGITAL BANK</Text>
              </div>
              <Paragraph style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.6, maxWidth: 400 }}>
                Next-generation automated credit origination platform built with real-time multi-bureau integration, FOIR/LTV rule evaluation, and end-to-end digital lending workflows.
              </Paragraph>
              <Tag color="gold" style={{ fontWeight: 700 }}>RBI REGISTERED DIGITAL LENDING PLATFORM</Tag>
            </Col>

            <Col xs={12} md={7}>
              <Text bold style={{ color: '#FFF', fontSize: 14, display: 'block', marginBottom: 16 }}>QUICK ACCESS PORTALS</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <a onClick={() => navigate('/login')} style={{ color: '#94A3B8' }}>Applicant Account Sign In</a>
                <a onClick={() => navigate('/register')} style={{ color: '#94A3B8' }}>New Loan Application Register</a>
                <a onClick={() => navigate('/staff-login')} style={{ color: '#94A3B8' }}>Bank Operations & Credit Staff Console</a>
                <a onClick={() => setIsCalculatorModalOpen(true)} style={{ color: '#94A3B8' }}>Open Financial Calculators</a>
              </div>
            </Col>

            <Col xs={12} md={7}>
              <Text bold style={{ color: '#FFF', fontSize: 14, display: 'block', marginBottom: 16 }}>GOVERNANCE & COMPLIANCE</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <span style={{ color: '#94A3B8' }}>RBI Digital Lending Framework (2026)</span>
                <span style={{ color: '#94A3B8' }}>Key Fact Statement (KFS) Disclosure</span>
                <span style={{ color: '#94A3B8' }}>256-Bit SSL Data Encryption</span>
                <span style={{ color: '#94A3B8' }}>Fair Practices Code & Ombudsman</span>
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '32px 0 20px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <Text style={{ color: '#64748B', fontSize: 12 }}>
              © 2026 LOCAS Digital Lending Systems. All rights reserved. Registered with Reserve Bank of India (RBI).
            </Text>
            <Text style={{ color: '#64748B', fontSize: 12 }}>
              System Status: <span style={{ color: '#10B981', fontWeight: 600 }}>● ALL APIS ONLINE</span>
            </Text>
          </div>
        </div>
      </div>

      {/* Main Interactive Financial Calculator Modal */}
      <Modal
        open={isCalculatorModalOpen}
        onCancel={() => setIsCalculatorModalOpen(false)}
        footer={null}
        width={950}
        centered
        destroyOnClose
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 6 }}>
            INTERACTIVE FINANCIAL PLANNING SUITE
          </Tag>
          <Title level={3} style={{ color: '#052E2B', margin: 0 }}>Instant Loan Eligibility & EMI Calculator</Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Select a calculator to estimate your sanction power and monthly installments</Text>
        </div>

        <Tabs
          defaultActiveKey="eligibility"
          centered
          size="large"
          items={[
            {
              key: 'eligibility',
              label: (
                <span style={{ fontWeight: 700, fontSize: 15, padding: '0 8px' }}>
                  🎯 Loan Eligibility & Max Sanction Power
                </span>
              ),
              children: <EligibilityChecker />,
            },
            {
              key: 'emi',
              label: (
                <span style={{ fontWeight: 700, fontSize: 15, padding: '0 8px' }}>
                  📊 Interactive EMI & Interest Calculator
                </span>
              ),
              children: <EMICalculator />,
            },
          ]}
        />
      </Modal>

      {/* Interactive Home Loan EMI Modal */}
      <Modal
        open={isEmiModalOpen}
        onCancel={() => setIsEmiModalOpen(false)}
        footer={null}
        width={850}
        centered
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <Tag color="green" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 4 }}>
            MORTGAGE & LOAN CALCULATOR
          </Tag>
          <Title level={3} style={{ margin: 0, color: '#052E2B' }}>
            Calculate Your Home Loan Monthly EMI
          </Title>
        </div>
        <EMICalculator initialAmount={5000000} initialRate={8.5} initialTenure={240} />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '16px 20px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
          <div>
            <Text bold style={{ color: '#0F172A', display: 'block' }}>Ready to proceed with your calculated EMI?</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>Instant paperless application with 0 pre-closure charges.</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700, borderRadius: 8, height: 44 }}
            onClick={() => {
              setIsEmiModalOpen(false);
              navigate('/apply/HOME');
            }}
          >
            Apply for Home Loan →
          </Button>
        </div>
      </Modal>

      {/* Instant Credit Engine & Eligibility Modal */}
      <Modal
        open={isInstantApprovalModalOpen}
        onCancel={() => setIsInstantApprovalModalOpen(false)}
        footer={null}
        width={900}
        centered
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 4 }}>
            AUTOMATED CREDIT ENGINE
          </Tag>
          <Title level={3} style={{ margin: 0, color: '#052E2B' }}>
            Instant Loan Eligibility & Pre-Approval Check
          </Title>
        </div>
        <EligibilityChecker />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDF4', padding: '16px 20px', borderRadius: 10, border: '1px solid #BBF7D0' }}>
          <div>
            <Text bold style={{ color: '#166534', display: 'block' }}>Lock in your Pre-Approved Credit Sanction Limit!</Text>
            <Text style={{ color: '#15803D', fontSize: 13 }}>Complete 2-minute paperless registration to claim your sanctioned offer.</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            style={{ backgroundColor: '#06B6D4', borderColor: '#06B6D4', fontWeight: 700, borderRadius: 8, height: 44 }}
            onClick={() => {
              setIsInstantApprovalModalOpen(false);
              navigate('/register');
            }}
          >
            Register for Pre-Approved Limit →
          </Button>
        </div>
      </Modal>

      {/* 1. Select Bank Institution Modal */}
      <Modal
        open={isBankModalOpen}
        onCancel={() => setIsBankModalOpen(false)}
        footer={null}
        width={750}
        centered
        destroyOnClose
        title={
          <div>
            <Tag color="gold" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 4 }}>
              BANKING PARTNER DIRECTORY
            </Tag>
            <Title level={3} style={{ margin: 0, color: '#052E2B' }}>
              Select Lending Bank Institution
            </Title>
          </div>
        }
      >
        <div style={{ marginTop: 12 }}>
          <Row gutter={[16, 16]}>
            {INDIAN_BANKS.map((bk) => {
              const isSelected = selectedBank === bk.name;
              return (
                <Col xs={24} sm={12} key={bk.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      borderColor: isSelected ? '#D97706' : '#E2E8F0',
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected ? '#FFFBEB' : '#FFFFFF',
                    }}
                    onClick={() => {
                      setSelectedBank(bk.name);
                      localStorage.setItem('locas_selected_bank', bk.name);
                      message.success(`Selected Bank: ${bk.name} (${bk.code})`);
                      setIsBankModalOpen(false);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 26 }}>{bk.logo}</span>
                        <div>
                          <Tag color={isSelected ? 'warning' : 'blue'} style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>
                            {bk.type} • {bk.code}
                          </Tag>
                          <Text bold style={{ display: 'block', color: '#0F172A', fontSize: 15 }}>{bk.name}</Text>
                        </div>
                      </div>
                      {isSelected && <CheckCircleOutlined style={{ color: '#D97706', fontSize: 22 }} />}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Modal>

      {/* 2. Select City & Local Neighborhood Branch Modal */}
      <Modal
        open={isLocationModalOpen}
        onCancel={() => setIsLocationModalOpen(false)}
        footer={null}
        width={850}
        centered
        destroyOnClose
        title={
          <div>
            <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 4 }}>
              CITY & NEIGHBORHOOD BRANCH LOCATOR
            </Tag>
            <Title level={3} style={{ margin: 0, color: '#052E2B' }}>
              Select City & Local Bank Branch
            </Title>
          </div>
        }
      >
        <div style={{ marginTop: 12 }}>
          {/* Choose City (Searchable) & Search Branch Area Bar */}
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }} align="middle">
            <Col xs={24} sm={12}>
              <Text bold style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>
                SELECT CITY (SEARCHABLE):
              </Text>
              <Select
                showSearch
                size="large"
                style={{ width: '100%' }}
                value={activeCityId}
                placeholder="Type to Search City (e.g. Chennai, Mumbai)..."
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const city = INDIAN_CITIES.find((c) => c.id === option.value);
                  if (!city) return false;
                  return (
                    city.name.toLowerCase().includes(input.toLowerCase()) ||
                    city.state.toLowerCase().includes(input.toLowerCase())
                  );
                }}
                onChange={(val) => {
                  setActiveCityId(val);
                  setBranchSearchQuery('');
                  localStorage.setItem('locas_selected_city_id', val);
                }}
              >
                {INDIAN_CITIES.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    📍 <strong>{c.name}</strong> ({c.state}) • {c.count} Local Branches
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12}>
              <Text bold style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>
                SEARCH NEIGHBORHOOD AREA / PIN CODE:
              </Text>
              <Input
                size="large"
                placeholder="Search area (e.g. Anna Nagar, T. Nagar, BKC)..."
                prefix={<SearchOutlined style={{ color: '#0D9488' }} />}
                value={branchSearchQuery}
                onChange={(e) => setBranchSearchQuery(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0 20px' }} />

          {/* Step 2: Show 15-20 Local Branches inside the Selected City */}
          {(() => {
            const currentCity = INDIAN_CITIES.find((c) => c.id === activeCityId) || INDIAN_CITIES[0];
            const cityBranches = getBranchesForCity(activeCityId);
            const filteredBranches = cityBranches.filter(
              (b) =>
                !branchSearchQuery ||
                b.name.toLowerCase().includes(branchSearchQuery.toLowerCase()) ||
                b.area.toLowerCase().includes(branchSearchQuery.toLowerCase()) ||
                b.pin.includes(branchSearchQuery) ||
                b.ifsc.toLowerCase().includes(branchSearchQuery.toLowerCase())
            );

            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <Text bold style={{ fontSize: 14, color: '#052E2B' }}>
                    Showing {filteredBranches.length} Local Branches in <span style={{ color: '#0D9488' }}>{currentCity.name}, {currentCity.state}</span>:
                  </Text>
                  <Tag color="cyan" style={{ fontWeight: 700 }}>
                    IFSC Prefix: {filteredBranches[0]?.ifsc.slice(0, 8)}...
                  </Tag>
                </div>

                <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
                  <Row gutter={[14, 14]}>
                    {filteredBranches.map((br) => {
                      const fullLocationName = `${currentCity.name} - ${br.name}`;
                      const isSelected = selectedLocation === fullLocationName;

                      return (
                        <Col xs={24} sm={12} key={br.id}>
                          <Card
                            hoverable
                            bodyStyle={{ padding: 14 }}
                            style={{
                              borderRadius: 10,
                              borderColor: isSelected ? '#0D9488' : '#E2E8F0',
                              borderWidth: isSelected ? 2 : 1,
                              backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                            }}
                            onClick={() => {
                              setSelectedLocation(fullLocationName);
                              localStorage.setItem('locas_selected_location', fullLocationName);
                              message.success(`Selected Local Branch: ${fullLocationName} (${br.ifsc})`);
                              setIsLocationModalOpen(false);
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <Tag color={isSelected ? 'teal' : 'blue'} style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>
                                  PIN: {br.pin} • {br.ifsc}
                                </Tag>
                                <Text bold style={{ display: 'block', color: '#0F172A', fontSize: 14, lineHeight: 1.3 }}>
                                  {br.name}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
                                  📍 {br.area}
                                </Text>
                              </div>
                              {isSelected && <CheckCircleOutlined style={{ color: '#0D9488', fontSize: 20 }} />}
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;

