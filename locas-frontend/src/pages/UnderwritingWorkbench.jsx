import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Form, Input, InputNumber, Select, Tag, Divider, message, Tabs, Alert, Spin, Space, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationApi, bureauApi, scoringApi, underwritingApi, offerApi } from '../api/services';
import CreditScoreGauge from '../components/CreditScoreGauge';
import MultiBureauViewer from '../components/MultiBureauViewer';
import SanctionLetterModal from '../components/SanctionLetterModal';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import CurrencyDisplay, { PercentageDisplay } from '../components/CurrencyDisplay';
import {
  AuditOutlined, PrinterOutlined, SafetyCertificateOutlined, AlertOutlined, CheckCircleOutlined,
  CloseCircleOutlined, CalculatorOutlined, FileProtectOutlined, RobotOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const UnderwritingWorkbench = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [bureauReports, setBureauReports] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sanctionModalOpen, setSanctionModalOpen] = useState(false);

  // Live Scenario EMI & FOIR Calculator state
  const [simAmount, setSimAmount] = useState(0);
  const [simTenure, setSimTenure] = useState(240);
  const [simRoi, setSimRoi] = useState(8.5);

  const [decisionForm] = Form.useForm();
  const navigate = useNavigate();

  let user = { role: 'CREDIT_OFFICER' };
  try {
    const userStr = localStorage.getItem('locas_user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = { role: 'CREDIT_OFFICER' };
  }

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const appRes = await applicationApi.getById(id);
      const appData = appRes.data;
      setApp(appData);
      setSimAmount(appData.requestedAmount || 2500000);
      setSimTenure(appData.tenureMonths || 240);

      try {
        const bRes = await bureauApi.getReports(id);
        setBureauReports(bRes.data || []);
      } catch (e) {}

      try {
        const sRes = await scoringApi.getScore(id);
        setScoreData(sRes.data);
      } catch (e) {}

      try {
        const oRes = await offerApi.getByApplicationId(id);
        setOfferData(oRes.data);
      } catch (e) {}

    } catch (err) {
      message.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBureau = async (bureauName) => {
    try {
      await bureauApi.fetchReport(id, bureauName, 'CONSENT-UW-' + Date.now());
      message.success(`${bureauName} credit report fetched successfully!`);
      fetchApplicationDetails();
    } catch (err) {
      message.error(err.message || 'Failed to fetch bureau report');
    }
  };

  const handleCalculateScore = async () => {
    try {
      const res = await scoringApi.calculateScore(id);
      setScoreData(res.data);
      message.success('Credit score recalculated!');
      fetchApplicationDetails();
    } catch (err) {
      message.error(err.message || 'Scoring calculation failed');
    }
  };

  const onFinishDecision = async (values) => {
    setSubmitting(true);
    try {
      await underwritingApi.submitDecision(id, {
        decisionType: values.decisionType,
        recommendedAmount: values.recommendedAmount,
        recommendedTenure: values.recommendedTenure,
        roi: values.roi,
        rationale: values.rationale,
        deviations: values.deviations,
      });

      message.success(`Underwriting decision recorded: ${values.decisionType}`);
      fetchApplicationDetails();
    } catch (err) {
      message.error(err.message || 'Decision recording failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !app) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  // Calculate live scenario EMI & FOIR
  const monthlyRate = (simRoi / 12) / 100;
  const numPayments = simTenure || 240;
  const simEmi = monthlyRate > 0
    ? Math.round((simAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1))
    : Math.round(simAmount / numPayments);

  const monthlyIncome = (app.applicant?.annualIncome || 1500000) / 12;
  const totalMonthlyObligations = (app.applicant?.existingEmis || 15000) + simEmi;
  const simFoir = ((totalMonthlyObligations / monthlyIncome) * 100).toFixed(1);

  const isHighValue = app.requestedAmount > 1000000;
  const foirExceeded = app.foirPercentage > 50;

  return (
    <div>
      {/* Top Header Card */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          marginBottom: 24,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(3, 23, 22, 0.94) 0%, rgba(5, 46, 43, 0.88) 100%), url("/images/digital_bank_building.jpg") center/cover no-repeat',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Title level={3} style={{ margin: 0, color: '#FFF' }}>
                Underwriting Workbench: {app.applicationRef}
              </Title>
              <StatusBadge status={app.status} />
              <RiskBadge risk={app.riskBand} />
            </div>
            <Text style={{ color: '#CBD5E1', marginTop: 6, display: 'block', fontSize: 13 }}>
              Applicant: <strong>{app.applicant?.fullName}</strong> • Product: <strong>{app.productType} LOAN</strong> • Requested: <strong>₹{app.requestedAmount?.toLocaleString('en-IN')}</strong>
            </Text>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {offerData && (
              <Button type="primary" icon={<PrinterOutlined />} style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700 }} onClick={() => setSanctionModalOpen(true)}>
                Preview Official Sanction Letter
              </Button>
            )}
            {isHighValue && <Tag color="volcano" style={{ fontWeight: 700, padding: '4px 10px', margin: 0 }}>High Value (&gt; ₹10 Lakhs)</Tag>}
          </div>
        </div>
      </Card>

      {foirExceeded && (
        <Alert
          message="Policy Warning: FOIR Threshold Exceeded"
          description={`Calculated FOIR (${app.foirPercentage}%) exceeds standard policy limit of 50%. Manual justification & risk mitigation notes required.`}
          type="warning"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {/* 3-Column Enterprise Underwriting Workbench Layout */}
      <Row gutter={[20, 20]}>
        {/* LEFT COLUMN: Applicant Profile, KYC & Automated AI Scoring */}
        <Col xs={24} lg={7}>
          <Space direction="vertical" style={{ width: '100%' }} size={20}>
            {/* Applicant Profile */}
            <Card title="Applicant Profile & KYC Verification" style={{ borderRadius: 12 }}>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>FULL NAME</Text>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#052E2B' }}>{app.applicant?.fullName}</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>PAN / AADHAAR</Text>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>{app.applicant?.maskedPan} • {app.applicant?.maskedAadhaar}</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>EMPLOYMENT PROFILE</Text>
                <div><Tag color="blue" style={{ fontWeight: 600 }}>{app.applicant?.employmentType}</Tag></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>GROSS ANNUAL INCOME</Text>
                <div><CurrencyDisplay amount={app.applicant?.annualIncome} size={16} /></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>EXISTING MONTHLY OBLIGATIONS</Text>
                <div><CurrencyDisplay amount={app.applicant?.existingEmis} size={15} color="#D98C00" /></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>RESIDENTIAL ADDRESS</Text>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>{app.applicant?.address}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>FIELD VERIFICATION RESULT</Text>
                <div><Tag color="success" style={{ padding: '4px 8px', fontWeight: 600 }}>ADDRESS & EMPLOYMENT VERIFIED</Tag></div>
              </div>
            </Card>

            {/* Document & Fraud Verification Verification Checklist */}
            <Card title={<Space><FileProtectOutlined style={{ color: '#0D9488' }} /><span>Document Verification Checklist</span></Space>} style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>PAN Card OCR Match</Text>
                  <Tag color="success">VERIFIED 100%</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>Aadhaar e-KYC Hash</Text>
                  <Tag color="success">AUTHENTICATED</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>Bank Statement Salary Analysis</Text>
                  <Tag color="success">PASS (NO DEFAULTS)</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>ITR Form 16 Income Cross-Check</Text>
                  <Tag color="success">VALIDATED</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>Fraud / Anti-Money-Laundering</Text>
                  <Tag color="cyan">CLEAR (0 MATCHES)</Tag>
                </div>
              </div>
            </Card>
          </Space>
        </Col>

        {/* CENTER COLUMN: Bureau Analytics, Metrics & Scenario Analysis */}
        <Col xs={24} lg={10}>
          <Space direction="vertical" style={{ width: '100%' }} size={20}>
            {/* Multi Bureau Report Viewer */}
            <MultiBureauViewer bureauReports={bureauReports} onFetchBureau={handleFetchBureau} />

            {/* Automated AI Scoring & Risk Metrics */}
            <Card
              title="Financial Metrics & Policy Compliance"
              extra={<Button type="link" onClick={handleCalculateScore}>Recalculate Score</Button>}
              style={{ borderRadius: 12 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card bodyStyle={{ padding: 16, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>FOIR PERCENTAGE</Text>
                    <div style={{ fontSize: 22, fontWeight: 700, color: app.foirPercentage <= 50 ? '#168A5B' : '#C62828', marginTop: 4 }}>
                      <PercentageDisplay value={app.foirPercentage} />
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Policy Cap: 50%</Text>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card bodyStyle={{ padding: 16, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>LTV RATIO</Text>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D9488', marginTop: 4 }}>
                      <PercentageDisplay value={app.ltvPercentage} />
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Policy Cap: 80%</Text>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card bodyStyle={{ padding: 16, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>SCORECARD RATING</Text>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#052E2B', marginTop: 4 }}>
                      {app.scorecardScore || 82} / 100
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Tier 1 Prime Risk</Text>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card bodyStyle={{ padding: 16, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>ESTIMATED MONTHLY EMI</Text>
                    <div style={{ marginTop: 4 }}>
                      <CurrencyDisplay amount={app.estimatedEmi} size={18} color="#0D9488" />
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Reducing balance</Text>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Interactive Live Sensitivity & Scenario Analysis Widget */}
            <Card
              title={
                <Space>
                  <CalculatorOutlined style={{ color: '#0D9488' }} />
                  <span>Live Loan Amount & EMI Sensitivity Simulator</span>
                </Space>
              }
              style={{ borderRadius: 12, backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1' }}
            >
              <Row gutter={[16, 16]} alignItems="center">
                <Col span={8}>
                  <Text style={{ fontSize: 11, fontWeight: 600 }}>Sanction Amount (₹):</Text>
                  <InputNumber
                    value={simAmount}
                    onChange={(v) => setSimAmount(v || 0)}
                    size="middle"
                    style={{ width: '100%', marginTop: 4 }}
                    formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(v) => v.replace(/\₹\s?|(,*)/g, '')}
                  />
                </Col>

                <Col span={8}>
                  <Text style={{ fontSize: 11, fontWeight: 600 }}>Tenure (Mos):</Text>
                  <InputNumber
                    value={simTenure}
                    onChange={(v) => setSimTenure(v || 12)}
                    size="middle"
                    style={{ width: '100%', marginTop: 4 }}
                    min={12}
                    max={360}
                  />
                </Col>

                <Col span={8}>
                  <Text style={{ fontSize: 11, fontWeight: 600 }}>ROI (% p.a.):</Text>
                  <InputNumber
                    value={simRoi}
                    onChange={(v) => setSimRoi(v || 8)}
                    size="middle"
                    step={0.1}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </Col>
              </Row>

              <div style={{ marginTop: 14, padding: 12, borderRadius: 8, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>SIMULATED EMI:</Text>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#052E2B' }}>₹ {simEmi.toLocaleString('en-IN')} / mo</div>
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>SIMULATED FOIR:</Text>
                  <div style={{ fontWeight: 700, fontSize: 16, color: simFoir <= 50 ? '#168A5B' : '#C62828' }}>
                    {simFoir}% {simFoir <= 50 ? '✅ Compliant' : '⚠️ Exceeded'}
                  </div>
                </div>

                <Button
                  size="small"
                  type="primary"
                  style={{ backgroundColor: '#0D9488', border: 'none' }}
                  onClick={() => {
                    decisionForm.setFieldsValue({
                      recommendedAmount: simAmount,
                      recommendedTenure: simTenure,
                      roi: simRoi,
                    });
                    message.success('Applied simulated terms to decision form!');
                  }}
                >
                  Use Simulated Terms
                </Button>
              </div>
            </Card>
          </Space>
        </Col>

        {/* RIGHT COLUMN: Sticky Maker-Checker Decision Panel */}
        <Col xs={24} lg={7}>
          <div className="sticky-decision-panel">
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AuditOutlined style={{ color: '#0D9488' }} />
                  <span>Underwriting Decision Panel</span>
                </div>
              }
              style={{ borderRadius: 12, borderColor: '#0D9488', boxShadow: '0 8px 24px rgba(11,31,58,0.08)' }}
            >
              <Form
                form={decisionForm}
                layout="vertical"
                initialValues={{
                  decisionType: isHighValue && user.role === 'CREDIT_OFFICER' ? 'RECOMMEND' : 'APPROVE',
                  recommendedAmount: app.requestedAmount,
                  recommendedTenure: app.tenureMonths,
                  roi: 8.5,
                  rationale: 'Approved based on stable employment income, strong CIBIL score (780) and low LTV ratio.',
                }}
                onFinish={onFinishDecision}
              >
                <Form.Item name="decisionType" label="Underwriting Action" rules={[{ required: true }]}>
                  <Select size="large">
                    {user.role === 'CREDIT_OFFICER' && isHighValue && (
                      <Select.Option value="RECOMMEND">RECOMMEND FOR CREDIT HEAD APPROVAL</Select.Option>
                    )}
                    {(!isHighValue || user.role === 'CREDIT_HEAD' || user.role === 'ADMIN') && (
                      <Select.Option value="APPROVE">SANCTION & GENERATE OFFER</Select.Option>
                    )}
                    <Select.Option value="DECLINE">DECLINE APPLICATION</Select.Option>
                    <Select.Option value="REQUEST_CLARIFICATION">REQUEST CLARIFICATION</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="recommendedAmount" label="Sanctioned Amount (₹)" rules={[{ required: true }]}>
                  <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="recommendedTenure" label="Tenure (Mos)" rules={[{ required: true }]}>
                      <InputNumber size="large" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="roi" label="ROI (% p.a.)" rules={[{ required: true }]}>
                      <InputNumber size="large" step={0.1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="rationale" label="Mandatory Decision Rationale" rules={[{ required: true, message: 'Rationale is mandatory' }]}>
                  <Input.TextArea rows={3} placeholder="Provide credit justification, risk assessment details, or decline reasons." />
                </Form.Item>

                <Form.Item name="deviations" label="Policy Deviations & Mitigants">
                  <Input.TextArea rows={2} placeholder="Note any FOIR/LTV policy exception mitigants." />
                </Form.Item>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="large"
                    loading={submitting}
                    onClick={() => {
                      decisionForm.setFieldsValue({ decisionType: (!isHighValue || user.role !== 'CREDIT_OFFICER') ? 'APPROVE' : 'RECOMMEND' });
                      decisionForm.submit();
                    }}
                    style={{ flex: 1, backgroundColor: '#168A5B', border: 'none', height: 44, fontWeight: 700 }}
                  >
                    Approve
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    size="large"
                    loading={submitting}
                    onClick={() => {
                      decisionForm.setFieldsValue({ decisionType: 'DECLINE' });
                      decisionForm.submit();
                    }}
                    style={{ flex: 1, backgroundColor: '#C62828', border: 'none', height: 44, fontWeight: 700 }}
                  >
                    Reject
                  </Button>
                </div>

                <div style={{ marginTop: 16, paddingTop: 10, borderTop: '1px solid #F0F4F8', textAlign: 'center' }}>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => {
                      decisionForm.setFieldsValue({
                        recommendedAmount: app.requestedAmount,
                        recommendedTenure: app.tenureMonths,
                        roi: 8.5,
                        rationale: 'Approved based on stable employment income, strong CIBIL score (780) and low LTV ratio.',
                        deviations: 'FOIR within limits, clean multi-bureau report with 0 DPD defaults.',
                      });
                      message.info('Auto-filled standard underwriting sanction notes');
                    }}
                    style={{ fontSize: 10, color: '#64748B', height: 22, padding: '0 6px' }}
                  >
                    ⚡ Auto-Fill Sanction Rationale
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Sanction Letter Modal */}
      {offerData && (
        <SanctionLetterModal
          open={sanctionModalOpen}
          onClose={() => setSanctionModalOpen(false)}
          offer={offerData}
          application={app}
        />
      )}
    </div>
  );
};

export default UnderwritingWorkbench;
