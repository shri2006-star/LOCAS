import React, { useState } from 'react';
import { Card, Row, Col, Slider, Typography, Table, Tag, Button } from 'antd';
import { ExperimentOutlined, AlertOutlined } from '@ant-design/icons';
import { CurrencyDisplay } from './CurrencyDisplay';

const { Text, Title } = Typography;

export const StressTestingWidget = () => {
  const [dpdShift, setDpdShift] = useState(30); // 30, 60, 90 day stress
  const [unemploymentSpike, setUnemploymentSpike] = useState(5); // % spike

  const basePortfolio = 1254000000; // 125.4 Cr
  const baseNpa = 0.028; // 2.8%

  // Simulated Stress Impact Math
  const stressedNpaRatio = Math.min(baseNpa + (dpdShift / 30) * 0.012 + (unemploymentSpike / 100) * 0.5, 0.15);
  const stressedNpaVolume = Math.round(basePortfolio * stressedNpaRatio);
  const requiredProvisioning = Math.round(stressedNpaVolume * 0.70); // 70% Provision Coverage Ratio (PCR)

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExperimentOutlined style={{ color: '#0D9488', fontSize: 18 }} />
          <span>Portfolio NPA Stress Testing & Capital Adequacy Simulator</span>
        </div>
      }
      style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(11,31,58,0.05)', border: '1px solid #E3E8EF' }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 20 }}>
            <Text bold style={{ display: 'block', marginBottom: 8 }}>Simulate Portfolio DPD Migration Shift</Text>
            <Slider
              min={0}
              max={90}
              step={15}
              value={dpdShift}
              onChange={(v) => setDpdShift(v)}
              marks={{ 0: '+0 Days', 30: '+30 Days', 60: '+60 Days', 90: '+90 Days' }}
            />
          </div>

          <div>
            <Text bold style={{ display: 'block', marginBottom: 8 }}>Macroeconomic Income Stress Spike (%)</Text>
            <Slider
              min={0}
              max={15}
              step={1}
              value={unemploymentSpike}
              onChange={(v) => setUnemploymentSpike(v)}
              marks={{ 0: 'Baseline', 5: '+5%', 10: '+10%', 15: '+15%' }}
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card bodyStyle={{ padding: 20, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 11 }}>STRESSED GROSS NPA %</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: stressedNpaRatio > 0.05 ? '#C62828' : '#D98C00' }}>
                  {(stressedNpaRatio * 100).toFixed(2)}%
                </div>
                <Text type="secondary" style={{ fontSize: 11 }}>Baseline: 2.80%</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 11 }}>STRESSED NPA VOLUME</Text>
                <div style={{ marginTop: 4 }}>
                  <CurrencyDisplay amount={stressedNpaVolume} size={18} color="#C62828" />
                </div>
              </Col>
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 11 }}>REQUIRED REGULATORY PROVISIONING (70% PCR)</Text>
                <div style={{ marginTop: 4 }}>
                  <CurrencyDisplay amount={requiredProvisioning} size={20} color="#052E2B" />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default StressTestingWidget;
