import React, { useState } from 'react';
import { Card, Slider, InputNumber, Row, Col, Typography, Divider } from 'antd';
import { CurrencyDisplay } from './CurrencyDisplay';

const { Text, Title } = Typography;

export const EMICalculator = ({ initialAmount = 500000, initialRate = 8.5, initialTenure = 60 }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [rate, setRate] = useState(initialRate);
  const [tenure, setTenure] = useState(initialTenure);

  const calculateEmi = () => {
    if (!amount || !rate || !tenure) return 0;
    const p = amount;
    const r = rate / (12 * 100);
    const n = tenure;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const emi = calculateEmi();
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - amount;

  return (
    <Card
      title="Interactive EMI Loan Calculator"
      style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(11, 31, 58, 0.05)', border: '1px solid #E3E8EF' }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text bold>Loan Amount</Text>
              <InputNumber
                value={amount}
                min={50000}
                max={50000000}
                step={50000}
                formatter={(val) => `₹ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(val) => val.replace(/\₹\s?|(,*)/g, '')}
                onChange={(v) => setAmount(v || 50000)}
                style={{ width: 140 }}
              />
            </div>
            <Slider
              min={50000}
              max={10000000}
              step={50000}
              value={amount}
              onChange={(v) => setAmount(v)}
              trackStyle={{ backgroundColor: '#052E2B' }}
              handleStyle={{ borderColor: '#052E2B' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text bold>Interest Rate (% p.a.)</Text>
              <InputNumber
                value={rate}
                min={5}
                max={25}
                step={0.25}
                formatter={(val) => `${val}%`}
                parser={(val) => val.replace('%', '')}
                onChange={(v) => setRate(v || 8.5)}
                style={{ width: 100 }}
              />
            </div>
            <Slider
              min={6}
              max={20}
              step={0.25}
              value={rate}
              onChange={(v) => setRate(v)}
              trackStyle={{ backgroundColor: '#0D9488' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text bold>Loan Tenure (Months)</Text>
              <InputNumber
                value={tenure}
                min={6}
                max={360}
                step={6}
                formatter={(val) => `${val} mos`}
                parser={(val) => val.replace(' mos', '')}
                onChange={(v) => setTenure(v || 60)}
                style={{ width: 100 }}
              />
            </div>
            <Slider
              min={12}
              max={240}
              step={12}
              value={tenure}
              onChange={(v) => setTenure(v)}
              trackStyle={{ backgroundColor: '#10B981' }}
            />
          </div>
        </Col>

        <Col xs={24} md={10}>
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 8,
              padding: 20,
              border: '1px solid #E3E8EF',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monthly EMI Output
            </Text>
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              <CurrencyDisplay amount={emi} size={32} color="#052E2B" />
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Principal Amount:</Text>
              <CurrencyDisplay amount={amount} size={14} bold={false} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Total Interest Payable:</Text>
              <CurrencyDisplay amount={totalInterest} size={14} bold={false} color="#D98C00" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px dashed #E3E8EF' }}>
              <Text bold>Total Amount Payable:</Text>
              <CurrencyDisplay amount={totalPayable} size={15} color="#168A5B" />
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default EMICalculator;
