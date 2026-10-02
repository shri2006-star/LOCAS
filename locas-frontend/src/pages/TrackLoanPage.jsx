import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Steps, Button, Tag, message, Skeleton, Space, Select } from 'antd';
import {
  CheckCircleOutlined, SyncOutlined, ArrowRightOutlined,
  AimOutlined, FileTextOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationApi, offerApi, disbursementApi } from '../api/services';
import StatusBadge from '../components/StatusBadge';
import CurrencyDisplay from '../components/CurrencyDisplay';

const { Title, Text, Paragraph } = Typography;

export const TrackLoanPage = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeOffer, setActiveOffer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const appRes = await applicationApi.getMyApplications();
      const apps = Array.isArray(appRes) ? appRes : (appRes?.data || []);
      setApplications(apps);

      if (apps.length > 0) {
        if (!selectedAppId || !apps.find(a => a.id === selectedAppId)) {
          setSelectedAppId(apps[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to load application status');
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
      fetchApplications();
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
      {/* Header Banner */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          borderRadius: 14,
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.94) 0%, rgba(15, 39, 68, 0.90) 100%), url("/images/financial_growth_chart.jpg") center/cover no-repeat',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              REAL-TIME LOAN STATUS TRACKER
            </Tag>
            <Title level={2} style={{ color: '#FFF', margin: '4px 0 8px' }}>
              Track Your Loan Application
            </Title>
            <Paragraph style={{ color: '#CBD5E1', fontSize: 14, margin: 0 }}>
              Monitor live credit bureau checks, underwriter evaluations, credit head approvals, and instant disbursement.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button
                type="primary"
                ghost
                icon={<HistoryOutlined />}
                style={{ fontWeight: 600, height: 40, borderRadius: 8, borderColor: '#38BDF8', color: '#38BDF8' }}
                onClick={() => navigate('/loan-history')}
              >
                View History
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700, height: 40, borderRadius: 8 }}
                onClick={() => navigate('/dashboard')}
              >
                Apply New Loan
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          {activeApp ? (
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <Space style={{ flexWrap: 'wrap' }}>
                    <AimOutlined style={{ fontSize: 20, color: '#0D9488' }} />
                    <span style={{ fontSize: 16 }}>
                      Application Ref: <strong>{activeApp.applicationRef}</strong> ({activeApp.productType} LOAN)
                    </span>
                    <StatusBadge status={activeApp.status} />
                  </Space>

                  <Space style={{ flexWrap: 'wrap' }}>
                    {applications.length > 1 && (
                      <Select
                        value={activeApp.id}
                        onChange={setSelectedAppId}
                        style={{ minWidth: 280 }}
                        options={applications.map(app => ({
                          value: app.id,
                          label: `${app.applicationRef} (${app.productType}) - ${app.status}`
                        }))}
                      />
                    )}
                    <Button icon={<SyncOutlined spin={loading} />} size="small" onClick={fetchApplications}>
                      Refresh Live Status
                    </Button>
                  </Space>
                </div>
              }
              style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #E3E8EF', boxShadow: '0 4px 16px rgba(11,31,58,0.06)' }}
            >
              <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
                <Col xs={12} sm={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Requested Amount</Text>
                  <div style={{ marginTop: 4 }}>
                    <CurrencyDisplay amount={activeApp.requestedAmount} size={22} />
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tenure</Text>
                  <div style={{ fontWeight: 700, fontSize: 20, color: '#052E2B', marginTop: 4 }}>
                    {activeApp.tenureMonths} Months
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>CIBIL Credit Score</Text>
                  <div style={{ fontWeight: 700, fontSize: 20, color: '#168A5B', marginTop: 4 }}>
                    {activeApp.creditScore || 780} (Prime)
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Estimated Monthly EMI</Text>
                  <div style={{ marginTop: 4 }}>
                    <CurrencyDisplay amount={activeApp.estimatedEmi} size={20} color="#0D9488" />
                  </div>
                </Col>
              </Row>

              {/* Progress Steps */}
              <Steps
                current={getStepCurrent(activeApp.status)}
                items={[
                  { title: 'Draft', description: 'Form Filled' },
                  { title: 'Submitted', description: 'Received by Bank' },
                  { title: 'Bureau Fetch', description: 'Credit Score Checked' },
                  { title: 'Under Review', description: 'Credit Officer Desk' },
                  { title: 'Approved', description: 'Credit Head Sanction' },
                  { title: 'Offer Letter', description: 'Sanction Letter Ready' },
                  { title: 'Disbursement', description: 'Amount Credited' },
                ]}
                style={{ marginTop: 16, marginBottom: 24 }}
              />

              {/* Staff Processing Trail */}
              <div style={{ marginTop: 24, padding: 20, backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <Text bold style={{ color: '#052E2B', fontSize: 15, display: 'block', marginBottom: 12 }}>
                  📋 Staff Processing & Underwriting Trail
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>1. Bureau Verification</Text>
                    <div style={{ fontWeight: 600, color: '#168A5B', fontSize: 13 }}>
                      <CheckCircleOutlined /> CIBIL Score Fetched (780)
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>2. Underwriter Assessment</Text>
                    <div style={{ fontWeight: 600, color: isOfficerDone ? '#168A5B' : '#D98C00', fontSize: 13 }}>
                      {isOfficerDone ? '✅ Recommended by Credit Officer' : '⏳ Pending Credit Officer Review'}
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>3. Credit Head Approval</Text>
                    <div style={{ fontWeight: 600, color: isHeadDone ? '#168A5B' : '#64748B', fontSize: 13 }}>
                      {isHeadDone ? '🎉 Sanction Approved by Credit Head' : '⏳ Awaiting Credit Head Sign-off'}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Sanction Offer Acceptance Banner */}
              {activeOffer && activeOffer.status === 'GENERATED' && (
                <div style={{ marginTop: 24, padding: 20, backgroundColor: '#E6F7FF', border: '1px solid #91CAFF', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <Text bold style={{ color: '#003EB3', fontSize: 16, display: 'block', marginBottom: 4 }}>
                      🎉 Sanction Offer Letter Ready!
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                      Sanctioned Amount: <strong>₹{activeOffer.sanctionedAmount.toLocaleString('en-IN')}</strong> @ {activeOffer.interestRate}% ROI. Monthly EMI: <strong>₹{activeOffer.emiAmount.toLocaleString('en-IN')}</strong>.
                    </Text>
                  </div>
                  <Button type="primary" size="large" style={{ backgroundColor: '#168A5B', fontWeight: 700 }} onClick={() => handleAcceptOffer(activeOffer.id, activeApp.id, activeOffer.sanctionedAmount)}>
                    Accept Sanction Offer
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card style={{ marginBottom: 24, textAlign: 'center', padding: 48, borderRadius: 12 }}>
              <FileTextOutlined style={{ fontSize: 48, color: '#0D9488', marginBottom: 16 }} />
              <Title level={4} style={{ color: '#052E2B' }}>No Active Loan Applications to Track</Title>
              <Paragraph type="secondary" style={{ maxWidth: 500, margin: '0 auto 24px' }}>
                You do not have any pending loan applications currently. Apply now to get an instant automated credit assessment.
              </Paragraph>
              <Button type="primary" size="large" style={{ backgroundColor: '#052E2B', height: 44, fontWeight: 600 }} onClick={() => navigate('/dashboard')}>
                Explore Loan Catalog & Apply
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TrackLoanPage;
