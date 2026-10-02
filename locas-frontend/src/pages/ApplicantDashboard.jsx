import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Steps, Button, Table, Tag, Modal, message, Skeleton, Space, Select } from 'antd';
import {
  FileTextOutlined, CheckCircleOutlined, DollarOutlined, 
  ArrowRightOutlined, SyncOutlined, CreditCardOutlined, PlusOutlined,
  HomeOutlined, UserOutlined, CarOutlined, ReadOutlined, ShopOutlined, GoldOutlined, BankOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationApi, offerApi, loanApi, applicantApi, disbursementApi } from '../api/services';
import StatusBadge from '../components/StatusBadge';
import CurrencyDisplay from '../components/CurrencyDisplay';

const { Title, Text, Paragraph } = Typography;

const LOAN_PRODUCTS = [
  { key: 'HOME', title: 'Home Loan', icon: <HomeOutlined style={{ fontSize: 26, color: '#0D9488' }} />, rate: '8.50% p.a.', tenure: 'Up to 30 Yrs', foir: '50% Max FOIR', desc: 'Finance your dream home with low floating rates and 0 pre-closure charges.' },
  { key: 'PERSONAL', title: 'Personal Loan', icon: <UserOutlined style={{ fontSize: 26, color: '#10B981' }} />, rate: '11.50% p.a.', tenure: 'Up to 5 Yrs', foir: '50% Max FOIR', desc: 'Instant collateral-free loan up to ₹25 Lakhs disbursed within 24 hours.' },
  { key: 'VEHICLE', title: 'Vehicle Loan', icon: <CarOutlined style={{ fontSize: 26, color: '#168A5B' }} />, rate: '9.25% p.a.', tenure: 'Up to 7 Yrs', foir: '50% Max FOIR', desc: 'Drive your new car home with up to 85% on-road funding and flexible EMIs.' },
  { key: 'EDUCATION', title: 'Education Loan', icon: <ReadOutlined style={{ fontSize: 26, color: '#D98C00' }} />, rate: '9.75% p.a.', tenure: 'Up to 15 Yrs', foir: '45% Max FOIR', desc: 'Empower premier education in India & overseas with moratorium period.' },
  { key: 'BUSINESS', title: 'Business Loan', icon: <ShopOutlined style={{ fontSize: 26, color: '#052E2B' }} />, rate: '12.00% p.a.', tenure: 'Up to 10 Yrs', foir: '60% Max FOIR', desc: 'Working capital & business expansion loans up to ₹2 Crores for MSMEs.' },
  { key: 'GOLD', title: 'Gold Loan', icon: <GoldOutlined style={{ fontSize: 26, color: '#D98C00' }} />, rate: '8.00% p.a.', tenure: 'Up to 3 Yrs', foir: '65% Max FOIR', desc: 'Instant liquidity against gold ornaments with safe vault custody.' },
  { key: 'LAP', title: 'Loan Against Property', icon: <BankOutlined style={{ fontSize: 26, color: '#0D9488' }} />, rate: '10.25% p.a.', tenure: 'Up to 15 Yrs', foir: '50% Max FOIR', desc: 'Unlock maximum value from commercial or residential property.' },
];

export const ApplicantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeOffer, setActiveOffer] = useState(null);
  const [loanAccounts, setLoanAccounts] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const navigate = useNavigate();

  let user = { fullName: 'Applicant' };
  try {
    const userStr = localStorage.getItem('locas_user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = { fullName: 'Applicant' };
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      try {
        await applicantApi.getProfile();
      } catch (profErr) {
        if (user && user.role === 'APPLICANT') {
          await applicantApi.saveProfile({
            fullName: user.fullName || 'Applicant User',
            dateOfBirth: '1993-05-14',
            panNumber: 'ABCDE' + Math.floor(1000 + Math.random() * 8999) + 'X',
            aadhaarNumber: '123456789012',
            mobileNumber: '9876543210',
            email: user.email || 'applicant@locas.bank.com',
            address: 'Flat 402, Sunshine Heights, Bandra West, Mumbai 400050',
            employmentType: 'SALARIED',
            annualIncome: 1800000,
            existingEmis: 25000,
          });
        }
      }

      const appRes = await applicationApi.getMyApplications();
      const apps = Array.isArray(appRes) ? appRes : (appRes?.data || []);
      setApplications(apps);

      if (apps.length > 0) {
        if (!selectedAppId || !apps.find(a => a.id === selectedAppId)) {
          setSelectedAppId(apps[0].id);
        }
      }

      const loansRes = await loanApi.getAll();
      const loans = Array.isArray(loansRes) ? loansRes : (loansRes?.data || []);
      setLoanAccounts(loans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  useEffect(() => {
    if (activeApp) {
      fetchActiveOffer(activeApp.id, activeApp.status);
    }
  }, [selectedAppId, applications]);

  const fetchActiveOffer = async (appId, status) => {
    if (['OFFER_GENERATED', 'APPROVED', 'OFFER_ACCEPTED'].includes(status)) {
      try {
        const offerRes = await offerApi.getByApplicationId(appId);
        setActiveOffer(offerRes?.data || offerRes);
      } catch (e) {
        setActiveOffer(null);
      }
    } else {
      setActiveOffer(null);
    }
  };

  const handleAcceptOffer = async (offerId, appId, sanctionedAmount) => {
    try {
      await offerApi.acceptOffer(offerId);
      if (appId && sanctionedAmount) {
        await disbursementApi.disburse({
          applicationId: appId,
          disbursementAmount: sanctionedAmount,
        });
      }
      message.success('🎉 Loan Offer Accepted & Loan Amount Disbursed to your Bank Account!');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to process disbursement');
    }
  };

  const getStepCurrent = (status) => {
    switch (status) {
      case 'DRAFT': return 0;
      case 'SUBMITTED': return 1;
      case 'BUREAU_CHECK': return 2;
      case 'UNDER_REVIEW':
      case 'RECOMMENDED': return 3;
      case 'APPROVED': return 4;
      case 'OFFER_GENERATED': return 5;
      case 'OFFER_ACCEPTED':
      case 'DISBURSED': return 6;
      default: return 0;
    }
  };

  const isOfficerDone = activeApp && ['RECOMMENDED', 'APPROVED', 'OFFER_GENERATED', 'OFFER_ACCEPTED', 'DISBURSED'].includes(activeApp.status);
  const isHeadDone = activeApp && ['APPROVED', 'OFFER_GENERATED', 'OFFER_ACCEPTED', 'DISBURSED'].includes(activeApp.status);

  return (
    <div>
      {/* Top Welcome Hero Banner with Stock Chart Asset Template */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          borderRadius: 14,
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.92) 0%, rgba(15, 39, 68, 0.88) 100%), url("/images/financial_growth_chart.jpg") center/cover no-repeat',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              REAL-TIME APPLICANT DASHBOARD
            </Tag>
            <Title level={2} style={{ color: '#FFF', margin: '4px 0 8px' }}>
              Welcome back, {user.fullName}!
            </Title>
            <Paragraph style={{ color: '#CBD5E1', fontSize: 14, margin: 0 }}>
              Track active loan origination, bureau credit scores, underwriting approvals, and direct disbursement status in real time.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700, height: 44, borderRadius: 8 }}
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply for New Loan
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          {/* Available Loan Products Grid Card */}
          <Card
            bodyStyle={{ padding: '28px 24px' }}
            style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 4px 16px rgba(11,31,58,0.06)', border: '1px solid #E3E8EF' }}
          >
            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 4 }}>
                INSTANT ONLINE CREDIT CATALOG
              </Tag>
              <Title level={3} style={{ color: '#052E2B', margin: 0 }}>
                Explore & Apply for Digital Loan Products
              </Title>
              <Text type="secondary">
                Select a credit product designed for your personal and commercial goals to start your instant paperless application.
              </Text>
            </div>

            <Row gutter={[20, 20]}>
              {LOAN_PRODUCTS.map((p) => (
                <Col xs={24} sm={12} md={8} lg={6} key={p.key} style={{ display: 'flex' }}>
                  <Card
                    hoverable
                    bodyStyle={{ padding: 18, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    style={{ width: '100%', borderRadius: 12, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        {p.icon}
                        <Tag color="blue" style={{ fontWeight: 700, fontSize: 11, margin: 0 }}>{p.rate}</Tag>
                      </div>
                      <Text bold style={{ fontSize: 16, color: '#052E2B', display: 'block', marginBottom: 6 }}>{p.title}</Text>
                      <Paragraph type="secondary" style={{ fontSize: 12, minHeight: 44, lineHeight: 1.5, marginBottom: 12 }}>{p.desc}</Paragraph>
                      <div style={{ fontSize: 11, color: '#475569', background: '#F8FAFC', padding: '8px 10px', borderRadius: 6, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
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
                      style={{ backgroundColor: '#052E2B', height: 38, fontWeight: 600, borderRadius: 6 }}
                      onClick={() => navigate(`/apply/${p.key}`)}
                    >
                      Apply for {p.title}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Quick Action Navigation Strip for Track Loan & Loan History */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card
                bodyStyle={{ padding: 20 }}
                style={{ borderRadius: 12, border: '1px solid #91CAFF', backgroundColor: '#F0F5FF', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Tag color="blue" style={{ fontWeight: 700, borderRadius: 10, marginBottom: 6 }}>
                      LIVE UNDERWRITING TRACKER
                    </Tag>
                    <Title level={4} style={{ margin: 0, color: '#003EB3' }}>
                      Track the Loan Status
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
                      Monitor real-time CIBIL checks, officer review, sanction letters, and direct disbursement.
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    style={{ backgroundColor: '#003EB3', borderRadius: 8, fontWeight: 600 }}
                    onClick={() => navigate('/track-loan')}
                  >
                    Track Loan →
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                bodyStyle={{ padding: 20 }}
                style={{ borderRadius: 12, border: '1px solid #A7F3D0', backgroundColor: '#F0FDF4', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Tag color="green" style={{ fontWeight: 700, borderRadius: 10, marginBottom: 6 }}>
                      AUDIT & PAST APPLICATIONS
                    </Tag>
                    <Title level={4} style={{ margin: 0, color: '#065F46' }}>
                      Loan Application History
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
                      View all past applications, approved credit limits, active EMI schedules, and repayments.
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    style={{ backgroundColor: '#065F46', borderColor: '#065F46', borderRadius: 8, fontWeight: 600 }}
                    onClick={() => navigate('/loan-history')}
                  >
                    View History →
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Quick Apply Loan Selection Modal */}
          <Modal
            title={
              <div>
                <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 4 }}>LOCAS CREDIT CATALOG</Tag>
                <Title level={4} style={{ margin: 0, color: '#052E2B' }}>Select Loan Product to Apply</Title>
              </div>
            }
            open={isApplyModalOpen}
            onCancel={() => setIsApplyModalOpen(false)}
            footer={null}
            width={850}
            centered
            destroyOnClose
          >
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              {LOAN_PRODUCTS.map((p) => (
                <Col xs={24} sm={12} md={8} key={p.key}>
                  <Card
                    hoverable
                    bodyStyle={{ padding: 16 }}
                    style={{ borderRadius: 10, border: '1px solid #E2E8F0' }}
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      navigate(`/apply/${p.key}`);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      {p.icon}
                      <Tag color="blue" style={{ fontWeight: 700, fontSize: 11 }}>{p.rate}</Tag>
                    </div>
                    <Text bold style={{ fontSize: 15, color: '#052E2B', display: 'block', marginBottom: 4 }}>{p.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12, minHeight: 36 }}>{p.desc}</Text>
                    <Button type="primary" block size="small" style={{ backgroundColor: '#0D9488', fontWeight: 600 }}>
                      Apply Now →
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ApplicantDashboard;
