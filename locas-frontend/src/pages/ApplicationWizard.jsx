import React, { useState, useEffect } from 'react';
import { Steps, Form, Input, InputNumber, Select, Button, Card, Row, Col, Typography, message, Checkbox, Space, Tag, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { applicationApi, applicantApi } from '../api/services';
import DocumentUploader from '../components/DocumentUploader';
import { ArrowLeftOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { generateRandomWizardData } from '../utils/demoDataGenerator';

const { Title, Text, Paragraph } = Typography;

const PRODUCT_CONFIGS = {
  HOME: {
    code: 'HOME',
    name: 'Home Loan',
    subtitle: 'Finance your dream residential home or property with low floating rates up to 30 years.',
    steps: ['Personal', 'Employment', 'Obligations', 'Home Loan Request', 'Property & Mortgage', 'Property Documents', 'Review & Submit'],
    defaultAmount: 3500000,
    defaultTenure: 240,
    collateralTitle: 'Step 5: Property & Mortgage Collateral Details',
    docsTitle: 'Property & Financial Documents Upload',
    docs: [
      { type: 'PAN_CARD', label: 'Applicant PAN Card', required: true },
      { type: 'AADHAAR_CARD', label: 'Applicant Aadhaar Card', required: true },
      { type: 'PROPERTY_TITLE_DEED', label: 'Property Title Deed / Sale Agreement', required: true },
      { type: 'BUILDER_NOC', label: 'Builder NOC & Approved Sanction Plan', required: true },
      { type: 'BANK_STATEMENT', label: '6-Month Bank Statement', required: true },
      { type: 'SALARY_SLIP', label: 'Salary Slips / 2-Yr ITR', required: true },
    ]
  },
  PERSONAL: {
    code: 'PERSONAL',
    name: 'Personal Loan',
    subtitle: 'Instant collateral-free loan up to ₹25 Lakhs disbursed within 24 hours.',
    steps: ['Personal', 'Employment', 'Obligations', 'Loan Purpose', 'Bank & Salary Account', 'Income Documents', 'Review & Submit'],
    defaultAmount: 500000,
    defaultTenure: 36,
    collateralTitle: 'Step 5: Bank Account & Income Verification (Collateral-Free)',
    docsTitle: 'Income & Salary Verification Documents',
    docs: [
      { type: 'PAN_CARD', label: 'Applicant PAN Card', required: true },
      { type: 'AADHAAR_CARD', label: 'Applicant Aadhaar Card', required: true },
      { type: 'SALARY_SLIP', label: 'Latest 3-Month Salary Slips', required: true },
      { type: 'BANK_STATEMENT', label: '6-Month Salary Bank Statement', required: true },
    ]
  },
  VEHICLE: {
    code: 'VEHICLE',
    name: 'Vehicle Loan',
    subtitle: 'Drive your new or pre-owned vehicle home with up to 85% on-road funding.',
    steps: ['Personal', 'Employment', 'Obligations', 'Vehicle Loan Request', 'Vehicle & Dealership', 'Dealer Quotation & ID', 'Review & Submit'],
    defaultAmount: 800000,
    defaultTenure: 60,
    collateralTitle: 'Step 5: Vehicle Model & Dealership Details',
    docsTitle: 'Vehicle Quotation & KYC Documents Upload',
    docs: [
      { type: 'PAN_CARD', label: 'Applicant PAN Card', required: true },
      { type: 'AADHAAR_CARD', label: 'Applicant Aadhaar Card', required: true },
      { type: 'VEHICLE_QUOTATION', label: 'Dealer Proforma Price Quotation', required: true },
      { type: 'DRIVING_LICENSE', label: 'Applicant Driving License', required: true },
      { type: 'BANK_STATEMENT', label: '6-Month Bank Statement', required: true },
    ]
  },
  EDUCATION: {
    code: 'EDUCATION',
    name: 'Education Loan',
    subtitle: 'Empower premier higher education in India & overseas with flexible moratorium terms.',
    steps: ['Student Details', 'Co-Applicant Income', 'Obligations', 'Tuition Loan Request', 'University & Academic', 'Admission Documents', 'Review & Submit'],
    defaultAmount: 1500000,
    defaultTenure: 120,
    collateralTitle: 'Step 5: University & Co-Applicant Academic Details',
    docsTitle: 'Academic Admission & Financial Documents',
    docs: [
      { type: 'STUDENT_KYC', label: 'Student PAN & Aadhaar Card', required: true },
      { type: 'PARENT_KYC', label: 'Co-Applicant / Parent PAN & Aadhaar', required: true },
      { type: 'ADMISSION_LETTER', label: 'University Admission Offer Letter', required: true },
      { type: 'MARKSHEET', label: 'Academic Marksheets & Scorecard', required: true },
      { type: 'FEE_STRUCTURE', label: 'Official University Fee Structure Breakdown', required: true },
    ]
  },
  BUSINESS: {
    code: 'BUSINESS',
    name: 'Business Loan',
    subtitle: 'Working capital & business expansion loans up to ₹2 Crores for MSMEs.',
    steps: ['Promoter Details', 'Entity & Turnover', 'Obligations', 'Business Loan Purpose', 'GST & Registration', 'GST & Financial Upload', 'Review & Submit'],
    defaultAmount: 2500000,
    defaultTenure: 60,
    collateralTitle: 'Step 5: Business Registration & GST Details',
    docsTitle: 'GST & Business Financial Documents',
    docs: [
      { type: 'PROMOTER_PAN', label: 'Promoter / Director PAN Card', required: true },
      { type: 'GST_CERTIFICATE', label: 'GST Registration Certificate (REG-06)', required: true },
      { type: 'FINANCIAL_STATEMENTS', label: '2-Year Audited Financials & P&L', required: true },
      { type: 'BUSINESS_BANK_STATEMENT', label: '12-Month Business Bank Statement', required: true },
    ]
  },
  GOLD: {
    code: 'GOLD',
    name: 'Gold Loan',
    subtitle: 'Instant liquidity against gold ornaments with safe bank vault custody starting at 8.00% p.a.',
    steps: ['Personal Details', 'Income & Work', 'Obligations', 'Gold Loan Request', 'Gold Ornaments & Karat', 'Gold Evaluation & KYC', 'Review & Submit'],
    defaultAmount: 300000,
    defaultTenure: 12,
    collateralTitle: 'Step 5: Gold Ornaments & Karat Purity Details',
    docsTitle: 'Gold Evaluation & KYC Documents Upload',
    docs: [
      { type: 'PAN_CARD', label: 'Applicant PAN Card', required: true },
      { type: 'AADHAAR_CARD', label: 'Applicant Aadhaar Card', required: true },
      { type: 'GOLD_PURCHASE_RECEIPT', label: 'Gold Purchase Invoice / Receipt (Optional)', required: false },
      { type: 'CANCELLED_CHEQUE', label: 'Bank Account Cancelled Cheque', required: true },
    ]
  },
  LAP: {
    code: 'LAP',
    name: 'Loan Against Property',
    subtitle: 'Unlock maximum liquidity against commercial or residential property.',
    steps: ['Personal Details', 'Employment Income', 'Obligations', 'LAP Loan Purpose', 'Mortgage Property', 'Title Deed Upload', 'Review & Submit'],
    defaultAmount: 4000000,
    defaultTenure: 180,
    collateralTitle: 'Step 5: Mortgaged Property Details',
    docsTitle: 'Property Title & Income Documents',
    docs: [
      { type: 'PAN_CARD', label: 'Applicant PAN Card', required: true },
      { type: 'AADHAAR_CARD', label: 'Applicant Aadhaar Card', required: true },
      { type: 'PROPERTY_TITLE_DEED', label: 'Property Title Deed / Registry Copy', required: true },
      { type: 'TAX_RECEIPT', label: 'Latest Property Tax Receipt & Building Plan', required: true },
      { type: 'BANK_STATEMENT', label: '6-Month Bank Statement', required: true },
    ]
  }
};

export const ApplicationWizard = () => {
  const { product } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [createdApp, setCreatedApp] = useState(null);
  const [uploadedDocsMap, setUploadedDocsMap] = useState({});
  const navigate = useNavigate();

  const activeProductKey = (product ? product.toUpperCase() : 'HOME');
  const config = PRODUCT_CONFIGS[activeProductKey] || PRODUCT_CONFIGS.HOME;

  const handleDocStateChange = (type, data) => {
    setUploadedDocsMap(prev => ({
      ...prev,
      [type]: data
    }));
  };

  const handleProceedToReview = () => {
    const missingDocs = config.docs.filter(d => d.required && !uploadedDocsMap[d.type]);
    if (missingDocs.length > 0) {
      message.error(`Document verification incomplete! Please upload: ${missingDocs.map(d => d.label).join(', ')}`);
      return;
    }
    setCurrentStep(6);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await applicantApi.getProfile();
        const profile = res?.data || res;
        if (profile && profile.fullName) {
          form.setFieldsValue({
            fullName: profile.fullName || '',
            panNumber: profile.panNumber || '',
            aadhaarNumber: profile.aadhaarNumber || '123456789012',
            mobileNumber: profile.mobileNumber || '',
            email: profile.email || '',
            address: profile.address || '',
            employmentType: profile.employmentType || 'SALARIED',
            annualIncome: profile.annualIncome || 1500000,
            existingEmis: profile.existingEmis || 15000,
            productType: config.code,
            requestedAmount: config.defaultAmount,
            tenureMonths: config.defaultTenure,
          });
          return;
        }
      } catch (e) {
        // Fallback to logged in user details if profile not yet stored
      }

      const userStr = localStorage.getItem('locas_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          form.setFieldsValue({
            fullName: user.fullName || '',
            email: user.email || '',
            productType: config.code,
            requestedAmount: config.defaultAmount,
            tenureMonths: config.defaultTenure,
          });
        } catch (err) {}
      }
    };
    loadUserData();
  }, [activeProductKey, form]);

  const handleAutoFillSampleData = () => {
    const userStr = localStorage.getItem('locas_user');
    const loggedInUser = userStr ? JSON.parse(userStr) : null;

    const data = generateRandomWizardData(config.code, loggedInUser);
    form.setFieldsValue({
      ...data,
      productType: config.code,
      requestedAmount: config.defaultAmount,
      tenureMonths: config.defaultTenure,
    });
    message.success(`Auto-filled ${config.name} details for ${data.fullName}`);
  };

  const handleStepNext = async (nextStep, fieldsToValidate = []) => {
    if (fieldsToValidate && fieldsToValidate.length > 0) {
      try {
        await form.validateFields(fieldsToValidate);
      } catch (err) {
        return; // Form validation failed, stay on current step
      }
    }

    const values = form.getFieldsValue(true);
    if (values.fullName && values.panNumber && values.email && values.mobileNumber && values.address) {
      try {
        const cleanPan = values.panNumber.trim().toUpperCase();
        await applicantApi.saveProfile({
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth || '1990-05-15',
          panNumber: cleanPan,
          aadhaarNumber: values.aadhaarNumber || '123456789012',
          mobileNumber: values.mobileNumber,
          email: values.email,
          address: values.address,
          employmentType: values.employmentType || 'SALARIED',
          annualIncome: values.annualIncome || 1500000,
          existingEmis: values.existingEmis || 0,
        });
      } catch (e) {
        console.warn('Sync profile step note:', e.message);
      }
    }
    setCurrentStep(nextStep);
  };

  const handleCreateDraft = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue(true);

      if (!values.fullName || !values.panNumber || !values.email || !values.mobileNumber || !values.address) {
        message.error('Please complete Step 1 (Personal Details) first!');
        setCurrentStep(0);
        setLoading(false);
        return;
      }

      if (!values.annualIncome) {
        message.error('Please complete Step 2 (Employment & Income) first!');
        setCurrentStep(1);
        setLoading(false);
        return;
      }

      if (!values.requestedAmount || !values.purpose) {
        message.error('Please complete Step 4 (Loan Details) first!');
        setCurrentStep(3);
        setLoading(false);
        return;
      }

      const cleanPan = values.panNumber ? values.panNumber.trim().toUpperCase() : '';

      try {
        await applicantApi.saveProfile({
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth || '1990-05-15',
          panNumber: cleanPan,
          aadhaarNumber: values.aadhaarNumber || '123456789012',
          mobileNumber: values.mobileNumber,
          email: values.email,
          address: values.address,
          employmentType: values.employmentType || 'SALARIED',
          annualIncome: values.annualIncome,
          existingEmis: values.existingEmis || 0,
        });
      } catch (profErr) {
        console.warn('Profile save note:', profErr.message);
      }

      const appRes = await applicationApi.create({
        productType: values.productType || config.code,
        requestedAmount: values.requestedAmount,
        tenureMonths: values.tenureMonths || config.defaultTenure,
        purpose: values.purpose,
        collateralType: values.collateralType || values.vehicleMake || values.universityName || values.gstNumber || values.goldKarat || 'NONE',
        collateralDescription: values.collateralDescription || values.vehicleModel || values.courseName || values.businessName || values.goldDescription || 'N/A',
        collateralMarketValue: values.collateralMarketValue || values.exShowroomPrice || values.annualTurnover || 0,
      });

      const createdData = appRes?.data || appRes;
      setCreatedApp(createdData);
      message.success(`Application draft created for ${config.name}! Ref: ` + createdData.applicationRef);
      setCurrentStep(5);
    } catch (err) {
      message.error(err.message || 'Failed to create application draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!createdApp) return;
    setLoading(true);
    try {
      await applicationApi.submit(createdApp.id);
      message.success(`🎉 ${config.name} application submitted successfully!`);
      navigate('/track-loan');
    } catch (err) {
      message.error(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const steps = config.steps.map(s => ({ title: s }));

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 40 }}>
      {/* Top Back Navigation Bar */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          type="text"
          style={{ fontWeight: 600, color: '#475569' }}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card style={{ borderRadius: 14, boxShadow: '0 6px 20px rgba(11,31,58,0.08)', border: '1px solid #E3E8EF' }}>
        {/* Wizard Header Banner */}
        <div
          style={{
            padding: '24px 28px',
            borderRadius: 12,
            marginBottom: 28,
            background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.94) 0%, rgba(15, 39, 68, 0.90) 100%), url("/images/financial_growth_chart.jpg") center/cover no-repeat',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#FFF',
          }}
        >
          <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8, padding: '2px 10px' }}>
            INSTANT ONLINE CREDIT APPLICATION
          </Tag>
          <Title level={3} style={{ color: '#FFF', margin: '4px 0 4px' }}>
            Digital {config.name} Application Wizard
          </Title>
          <Text style={{ color: '#94A3B8', fontSize: 13 }}>
            {config.subtitle}
          </Text>
        </div>

        <Steps
          current={currentStep}
          items={steps}
          onChange={(step) => {
            if (step < currentStep) setCurrentStep(step);
          }}
          style={{ marginBottom: 36 }}
        />

        <Form
          form={form}
          preserve={true}
          layout="vertical"
          initialValues={{
            productType: config.code,
            requestedAmount: config.defaultAmount,
            tenureMonths: config.defaultTenure,
            employmentType: 'SALARIED',
            annualIncome: 1500000,
            existingEmis: 15000,
          }}
          onFinish={handleCreateDraft}
        >
          {/* Step 0: Personal Details */}
          {currentStep === 0 && (
            <div>
              <Title level={4} style={{ color: '#052E2B', marginBottom: 20 }}>Step 1: Personal & Identification Details</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="fullName" label="Full Name (as per PAN)" rules={[{ required: true, message: 'Full name is required' }]}>
                    <Input placeholder="e.g. Aarav Patel" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="panNumber" label="PAN Number (10 Chars)" rules={[{ required: true, pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/, message: 'Invalid PAN (e.g. ABCDE1234F)' }]}>
                    <Input placeholder="e.g. ABCDE1234F" size="large" style={{ textTransform: 'uppercase' }} maxLength={10} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true, message: 'Mobile number is required' }]}>
                    <Input placeholder="e.g. 9876543210" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
                    <Input placeholder="e.g. aarav@gmail.com" size="large" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="address" label="Residential Address" rules={[{ required: true, message: 'Address is required' }]}>
                    <Input.TextArea rows={3} placeholder="Flat 402, Sunshine Heights, Bandra West, Mumbai 400050" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" size="large" style={{ backgroundColor: '#052E2B', fontWeight: 600 }} onClick={() => handleStepNext(1, ['fullName', 'panNumber', 'mobileNumber', 'email', 'address'])}>
                Next: Employment →
              </Button>
            </div>
          )}

          {/* Step 1: Employment */}
          {currentStep === 1 && (
            <div>
              <Title level={4} style={{ color: '#052E2B', marginBottom: 20 }}>Step 2: Employment & Income Details</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="employmentType" label="Employment Category" rules={[{ required: true }]}>
                    <Select size="large">
                      <Select.Option value="SALARIED">Salaried Corporate / Govt Employee</Select.Option>
                      <Select.Option value="SELF_EMPLOYED">Self-Employed Professional / Business Owner</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="annualIncome" label="Gross Annual Income (₹)" rules={[{ required: true, message: 'Annual income is required' }]}>
                    <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} min={100000} />
                  </Form.Item>
                </Col>
              </Row>
              <Space style={{ marginTop: 8 }}>
                <Button size="large" onClick={() => setCurrentStep(0)}>Back</Button>
                <Button type="primary" size="large" style={{ backgroundColor: '#052E2B', fontWeight: 600 }} onClick={() => handleStepNext(2, ['employmentType', 'annualIncome'])}>
                  Next: Obligations →
                </Button>
              </Space>
            </div>
          )}

          {/* Step 2: Obligations */}
          {currentStep === 2 && (
            <div>
              <Title level={4} style={{ color: '#052E2B', marginBottom: 20 }}>Step 3: Existing Financial Obligations</Title>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="existingEmis" label="Total Monthly Existing EMIs (₹)" rules={[{ required: true, message: 'Existing EMI amount required' }]}>
                    <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Space style={{ marginTop: 8 }}>
                <Button size="large" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button type="primary" size="large" style={{ backgroundColor: '#052E2B', fontWeight: 600 }} onClick={() => handleStepNext(3, ['existingEmis'])}>
                  Next: Loan Details →
                </Button>
              </Space>
            </div>
          )}

          {/* Step 3: Loan Details (Tailored to Loan Type) */}
          {currentStep === 3 && (
            <div>
              <Title level={4} style={{ color: '#052E2B', marginBottom: 20 }}>Step 4: Requested {config.name} Details</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="productType" label="Loan Product" rules={[{ required: true }]}>
                    <Select size="large" disabled>
                      <Select.Option value={config.code}>{config.name}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="requestedAmount" label={`Requested Loan Amount (₹)`} rules={[{ required: true, message: 'Requested amount is required' }]}>
                    <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} min={10000} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="tenureMonths" label="Tenure (Months)" rules={[{ required: true, message: 'Tenure in months is required' }]}>
                    <InputNumber size="large" style={{ width: '100%' }} min={3} max={360} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="purpose" label="Specific Loan Purpose" rules={[{ required: true, message: 'Purpose is required' }]}>
                    <Input
                      placeholder={
                        config.code === 'HOME' ? 'Purchase of 2BHK Residential Flat in Bandra' :
                        config.code === 'PERSONAL' ? 'Medical Emergency / Higher Education Expenses' :
                        config.code === 'VEHICLE' ? 'Purchase of SUV Four-Wheeler Car' :
                        config.code === 'EDUCATION' ? 'MS Computer Science Tuition Fees' :
                        config.code === 'BUSINESS' ? 'Working Capital Expansion & Stocking' :
                        config.code === 'GOLD' ? 'Urgent Business Liquidity against Ornaments' :
                        'Commercial Property Mortgage Expansion'
                      }
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Space style={{ marginTop: 8 }}>
                <Button size="large" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button type="primary" size="large" style={{ backgroundColor: '#052E2B', fontWeight: 600 }} onClick={() => handleStepNext(4, ['productType', 'requestedAmount', 'tenureMonths', 'purpose'])}>
                  Next: Product Specifics →
                </Button>
              </Space>
            </div>
          )}

          {/* Step 4: Tailored Product-Specific Details / Collateral */}
          {currentStep === 4 && (
            <div>
              <Title level={4} style={{ color: '#052E2B', marginBottom: 20 }}>{config.collateralTitle}</Title>

              {/* HOME & LAP LOANS */}
              {(config.code === 'HOME' || config.code === 'LAP') && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="collateralType" label="Property Type" rules={[{ required: true, message: 'Property type is required' }]}>
                      <Select size="large" placeholder="Select Property Type">
                        <Select.Option value="RESIDENTIAL_PROPERTY">Residential Apartment / House</Select.Option>
                        <Select.Option value="COMMERCIAL_PROPERTY">Commercial Office / Shop</Select.Option>
                        <Select.Option value="LAND_PLOT">Plot of Land / Independent Plot</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="collateralMarketValue" label="Estimated Market Value (₹)" rules={[{ required: true, message: 'Market value required' }]}>
                      <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="collateralDescription" label="Property Address & Specs (Carpet Area, Builder Name)" rules={[{ required: true }]}>
                      <Input.TextArea rows={2} placeholder="Flat 402, Sunshine Heights, Carpet Area: 1100 sq.ft, Builder: Raheja Corp" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* PERSONAL LOAN (Collateral-Free) */}
              {config.code === 'PERSONAL' && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="bankName" label="Salary / Primary Bank Name" rules={[{ required: true, message: 'Bank name required' }]}>
                      <Input placeholder="e.g. HDFC Bank / ICICI Bank / State Bank of India" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="accountNumber" label="Salary Account Number" rules={[{ required: true, message: 'Account number required' }]}>
                      <Input placeholder="e.g. 5010029384759" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="collateralDescription" label="Salary & Employment Verification Notes">
                      <Input.TextArea rows={2} placeholder="Company Name: TechCorp Pvt Ltd, Monthly Net Salary: ₹1,25,000" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* VEHICLE LOAN */}
              {config.code === 'VEHICLE' && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="vehicleMake" label="Vehicle Make & Model" rules={[{ required: true, message: 'Make and model required' }]}>
                      <Input placeholder="e.g. Tata Nexon EV / Hyundai Creta SX" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="exShowroomPrice" label="Ex-Showroom Price (₹)" rules={[{ required: true, message: 'Ex-showroom price required' }]}>
                      <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="collateralDescription" label="Dealer Name & Showroom Branch Location" rules={[{ required: true }]}>
                      <Input.TextArea rows={2} placeholder="Dealer: Fortune Motors Pvt Ltd, Bandra West Branch, On-Road Price: ₹14,50,000" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* EDUCATION LOAN */}
              {config.code === 'EDUCATION' && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="universityName" label="University / Institute Name" rules={[{ required: true, message: 'University required' }]}>
                      <Input placeholder="e.g. Harvard University / IIT Bombay" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="courseName" label="Course & Degree Program" rules={[{ required: true, message: 'Course name required' }]}>
                      <Input placeholder="e.g. MS Computer Science (24 Months)" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="collateralDescription" label="Co-Applicant / Parent Details & Study Destination" rules={[{ required: true }]}>
                      <Input.TextArea rows={2} placeholder="Co-Applicant: Rajesh Patel (Father), Country: USA, Total Tuition Fee: $45,000" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* BUSINESS LOAN */}
              {config.code === 'BUSINESS' && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="businessName" label="Registered Business / Entity Name" rules={[{ required: true, message: 'Business name required' }]}>
                      <Input placeholder="e.g. Apex Tech Solutions Pvt Ltd" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="gstNumber" label="GSTIN Number (15 Chars)" rules={[{ required: true, message: 'GSTIN required' }]}>
                      <Input placeholder="e.g. 27AAAAA0000A1Z5" size="large" style={{ textTransform: 'uppercase' }} maxLength={15} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="collateralDescription" label="Annual Business Turnover & Industry Sector" rules={[{ required: true }]}>
                      <Input.TextArea rows={2} placeholder="Annual Turnover: ₹1.8 Crores, Sector: IT Services & MSME Software" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* GOLD LOAN */}
              {config.code === 'GOLD' && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="goldKarat" label="Gold Karat Purity" rules={[{ required: true, message: 'Select purity' }]}>
                      <Select size="large" placeholder="Select Gold Karat">
                        <Select.Option value="24K">24 Karat (99.9% Pure Hallmark)</Select.Option>
                        <Select.Option value="22K">22 Karat (91.6% Pure Hallmark Ornaments)</Select.Option>
                        <Select.Option value="18K">18 Karat (75.0% Gold Ornaments)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="goldWeight" label="Estimated Gross Weight (Grams)" rules={[{ required: true, message: 'Weight required' }]}>
                      <InputNumber size="large" style={{ width: '100%' }} min={1} max={5000} placeholder="e.g. 150 Grams" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="collateralDescription" label="Gold Ornaments Description & Vault Branch" rules={[{ required: true }]}>
                      <Input.TextArea rows={2} placeholder="Description: 4 Gold Bangles, 2 Gold Chains, Vault Branch: Bandra West Branch" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Space style={{ marginTop: 8 }}>
                <Button size="large" onClick={() => setCurrentStep(3)}>Back</Button>
                <Button type="primary" size="large" htmlType="submit" loading={loading} style={{ backgroundColor: '#0D9488', fontWeight: 600 }}>
                  Save & Proceed to Documents →
                </Button>
              </Space>
            </div>
          )}
        </Form>

        {/* Step 5: Document Upload (Tailored to Loan Product) */}
        {currentStep === 5 && createdApp && (
          <div>
            <Title level={4} style={{ color: '#052E2B', marginBottom: 12 }}>Step 6: {config.docsTitle}</Title>
            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
              Upload mandatory verification documents for Application Ref: <strong style={{ color: '#0D9488' }}>{createdApp.applicationRef}</strong> ({config.name})
            </Paragraph>

            {(() => {
              const missingDocs = config.docs.filter(d => d.required && !uploadedDocsMap[d.type]);
              if (missingDocs.length > 0) {
                return (
                  <Alert
                    type="warning"
                    showIcon
                    message="Mandatory Document Verification Required"
                    description={`Please upload and verify all required documents before proceeding. Missing mandatory documents (${missingDocs.length}): ${missingDocs.map(d => d.label).join(', ')}`}
                    style={{ marginBottom: 20, borderRadius: 8 }}
                  />
                );
              }
              return (
                <Alert
                  type="success"
                  showIcon
                  message="All Mandatory Documents Verified & Compliant"
                  description="All required documents are uploaded, format-checked, and quality-approved. You may now proceed to final review."
                  style={{ marginBottom: 20, borderRadius: 8 }}
                />
              );
            })()}

            <Row gutter={[16, 16]}>
              {config.docs.map((doc, idx) => (
                <Col span={12} key={idx}>
                  <DocumentUploader
                    applicationId={createdApp.id}
                    documentType={doc.type}
                    label={doc.label}
                    required={doc.required}
                    onUploadStateChange={handleDocStateChange}
                  />
                </Col>
              ))}
            </Row>

            <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
              <Button size="large" onClick={() => setCurrentStep(4)}>Back</Button>
              <Button type="primary" size="large" style={{ backgroundColor: '#052E2B', fontWeight: 600 }} onClick={handleProceedToReview}>
                Proceed to Final Review →
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Review & Final Submission */}
        {currentStep === 6 && createdApp && (
          <div>
            <Title level={4} style={{ color: '#052E2B', marginBottom: 16 }}>Step 7: Final Review & Submission</Title>
            <Card style={{ backgroundColor: '#F8FAFC', borderRadius: 10, borderColor: '#CBD5E1', marginBottom: 20 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Application Reference</Text>
                  <div><Text bold style={{ fontSize: 16, color: '#0D9488' }}>{createdApp.applicationRef}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Selected Loan Product</Text>
                  <div><Tag color="blue" style={{ fontWeight: 700, fontSize: 13 }}>{config.name.toUpperCase()}</Tag></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Requested Loan Amount</Text>
                  <div><Text bold style={{ fontSize: 18, color: '#052E2B' }}>₹{createdApp.requestedAmount?.toLocaleString('en-IN')}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tenure Period</Text>
                  <div><Text bold style={{ fontSize: 18, color: '#052E2B' }}>{createdApp.tenureMonths} Months</Text></div>
                </Col>
                <Col span={24} style={{ borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Product Requirements Summary</Text>
                  <div style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
                    {config.name} application registered with required verification documents attached. CIBIL check & underwriting queued upon submission.
                  </div>
                </Col>
              </Row>
            </Card>

            <Form.Item name="consent" valuePropName="checked" style={{ marginBottom: 24 }}>
              <Checkbox defaultChecked>
                I hereby grant consent to LOCAS Bank to pull my credit report from CIBIL/Experian for automated credit evaluation.
              </Checkbox>
            </Form.Item>

            <Space size="middle">
              <Button size="large" onClick={() => setCurrentStep(5)}>Back</Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                icon={<CheckCircleOutlined />}
                style={{ backgroundColor: '#168A5B', borderColor: '#168A5B', fontWeight: 700, padding: '0 28px' }}
                onClick={handleSubmitFinal}
              >
                Submit {config.name} Application Now
              </Button>
            </Space>
          </div>
        )}

        {/* Bottom Auto-Fill Toolbar */}
        <div style={{ marginTop: 32, paddingTop: 14, borderTop: '1px solid #F0F4F8', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            size="small"
            type="text"
            icon={<ThunderboltOutlined style={{ fontSize: 11, color: '#0D9488' }} />}
            onClick={handleAutoFillSampleData}
            style={{ fontSize: 11, color: '#64748B', height: 24, padding: '0 8px' }}
          >
            ⚡ Auto-Fill Sample {config.name} Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationWizard;
