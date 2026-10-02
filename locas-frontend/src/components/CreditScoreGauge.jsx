import React from 'react';
import { Card, Progress, Row, Col, Typography, Tag } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export const CreditScoreGauge = ({ score = 780, bureauScores = [] }) => {
  const getScoreColor = (s) => {
    if (s >= 750) return '#168A5B';
    if (s >= 650) return '#D98C00';
    return '#C62828';
  };

  const getScoreGrade = (s) => {
    if (s >= 750) return 'EXCELLENT (PRIME)';
    if (s >= 680) return 'GOOD (STANDARD)';
    if (s >= 600) return 'FAIR (NEEDS REVIEW)';
    return 'HIGH RISK';
  };

  const percent = Math.min(Math.max(((score - 300) / 600) * 100, 0), 100);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SafetyCertificateOutlined style={{ color: '#0D9488', fontSize: 18 }} />
          <span>Bureau Credit Evaluation</span>
        </div>
      }
      style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(11,31,58,0.05)' }}
    >
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <Progress
          type="dashboard"
          percent={percent}
          format={() => (
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: getScoreColor(score), lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ fontSize: 12, color: '#667085', marginTop: 4 }}>CREDIT SCORE</div>
            </div>
          )}
          strokeColor={getScoreColor(score)}
          strokeWidth={10}
          width={180}
        />
        <div style={{ marginTop: 12 }}>
          <Tag color={score >= 750 ? 'success' : 'warning'} style={{ padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>
            {getScoreGrade(score)}
          </Tag>
        </div>
      </div>

      <Row gutter={[12, 12]} style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #E3E8EF' }}>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>CIBIL</Text>
          <div style={{ fontWeight: 700, color: '#052E2B', fontSize: 15 }}>780</div>
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>EXPERIAN</Text>
          <div style={{ fontWeight: 700, color: '#052E2B', fontSize: 15 }}>765</div>
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>EQUIFAX</Text>
          <div style={{ fontWeight: 700, color: '#052E2B', fontSize: 15 }}>772</div>
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>CRIF</Text>
          <div style={{ fontWeight: 700, color: '#052E2B', fontSize: 15 }}>770</div>
        </Col>
      </Row>
    </Card>
  );
};

export default CreditScoreGauge;
