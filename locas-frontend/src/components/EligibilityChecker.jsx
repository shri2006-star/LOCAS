import React, { useState } from 'react';
import { Card, Row, Col, Slider, InputNumber, Typography, Progress, Tag, Space, Divider } from 'antd';
import { SafetyCertificateOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { CurrencyDisplay } from './CurrencyDisplay';

const { Text, Title, Paragraph } = Typography;

export const EligibilityChecker = () => {
  const [income, setIncome] = useState(125000);
  const [existingEmis, setExistingEmis] = useState(20000);
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  // Financial Eligibility Math
  const maxAllowedFoir = 0.50; // 50% max FOIR rule
  const maxMonthlyObligation = income * maxAllowedFoir;
  const availableEmiCapacity = Math.max(maxMonthlyObligation - existingEmis, 0);

  // Reverse EMI calculation to compute Max Principal Capacity:
  // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const r = interestRate / (12 * 100);
  const n = tenureYears * 12;
  const maxPrincipalCapacity = Math.round(
    (availableEmiCapacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
  );

  const foirRatio = ((existingEmis / income) * 100).toFixed(1);
  const approvalProbability = foirRatio < 30 ? 95 : foirRatio < 45 ? 82 : 55;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThunderboltOutlined style={{ color: '#0D9488', fontSize: 20 }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#052E2B' }}>
            Instant Loan Eligibility & Max Sanction Calculator
          </span>
        </div>
      }
      style={{ borderRadius: 12, boxShadow: '0 8px 24px rgba(11, 31, 58, 0.06)', border: '1px solid #E3E8EF' }}
    >
      <Row gutter={[32, 24]}>
        <Col xs={24} md={14}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text bold style={{ color: '#0F172A' }}>Monthly Net Salary / Business Income</Text>
              <InputNumber
                value={income}
                min={25000}
                max={2000000}
                step={5000}
                formatter={(val) => `₹ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(val) => val.replace(/\₹\s?|(,*)/g, '')}
                onChange={(v) => setIncome(v || 25000)}
                style={{ width: 150 }}
              />
            </div>
            <Slider
              min={25000}
              max={500000}
              step={5000}
              value={income}
              onChange={(v) => setIncome(v)}
              trackStyle={{ backgroundColor: '#052E2B' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text bold style={{ color: '#0F172A' }}>Current Existing Monthly EMIs</Text>
              <InputNumber
                value={existingEmis}
                min={0}
                max={500000}
                step={2000}
                formatter={(val) => `₹ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(val) => val.replace(/\₹\s?|(,*)/g, '')}
                onChange={(v) => setExistingEmis(v || 0)}
                style={{ width: 140 }}
              />
            </div>
            <Slider
              min={0}
              max={200000}
              step={2000}
              value={existingEmis}
              onChange={(v) => setExistingEmis(v)}
              trackStyle={{ backgroundColor: '#D98C00' }}
            />
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Text bold style={{ display: 'block', marginBottom: 8 }}>Desired Tenure (Years)</Text>
              <Slider
                min={1}
                max={30}
                value={tenureYears}
                onChange={(v) => setTenureYears(v)}
                trackStyle={{ backgroundColor: '#0D9488' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>{tenureYears} Years ({tenureYears * 12} Months)</Text>
            </Col>
            <Col span={12}>
              <Text bold style={{ display: 'block', marginBottom: 8 }}>Assumed Interest Rate (% p.a.)</Text>
              <Slider
                min={6}
                max={18}
                step={0.25}
                value={interestRate}
                onChange={(v) => setInterestRate(v)}
                trackStyle={{ backgroundColor: '#168A5B' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>{interestRate}% per annum</Text>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={10}>
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 12,
              padding: 24,
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              MAXIMUM LOAN ELIGIBILITY POWER
            </Text>
            <div style={{ marginTop: 8, marginBottom: 12 }}>
              <CurrencyDisplay amount={maxPrincipalCapacity} size={32} color="#052E2B" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Progress
                type="circle"
                percent={approvalProbability}
                width={60}
                strokeColor={approvalProbability > 80 ? '#168A5B' : '#D98C00'}
                format={(p) => <span style={{ fontSize: 12, fontWeight: 700 }}>{p}%</span>}
              />
              <div style={{ textAlign: 'left' }}>
                <Text bold style={{ fontSize: 13, display: 'block' }}>Approval Probability</Text>
                <Tag color={approvalProbability > 80 ? 'success' : 'warning'}>
                  {approvalProbability > 80 ? 'HIGH LIKELIHOOD' : 'MODERATE RISK'}
                </Tag>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <Text type="secondary">Max Allowable Monthly EMI:</Text>
              <CurrencyDisplay amount={availableEmiCapacity} size={14} color="#168A5B" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <Text type="secondary">Current Obligations Ratio:</Text>
              <Text bold style={{ color: Number(foirRatio) <= 40 ? '#168A5B' : '#C62828' }}>
                {foirRatio}% FOIR
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default EligibilityChecker;
