import React from 'react';
import { Card, Tabs, Row, Col, Typography, Tag, Table, Progress, Button, Tooltip } from 'antd';
import { SafetyCertificateOutlined, AlertOutlined, ReloadOutlined } from '@ant-design/icons';
import { CreditScoreGauge } from './CreditScoreGauge';

const { Text, Title } = Typography;

export const MultiBureauViewer = ({ bureauReports = [], onFetchBureau }) => {
  const bureaus = ['CIBIL', 'EXPERIAN', 'EQUIFAX', 'CRIF'];

  const getReportForBureau = (name) => {
    return bureauReports.find((r) => r.bureauName.toUpperCase() === name.toUpperCase());
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyCertificateOutlined style={{ color: '#0D9488', fontSize: 18 }} />
            <span>Multi-Bureau Comparative Analytics</span>
          </div>
        </div>
      }
      style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(11,31,58,0.05)', border: '1px solid #E3E8EF' }}
    >
      <Tabs
        items={bureaus.map((bureauName) => {
          const report = getReportForBureau(bureauName);
          return {
            key: bureauName,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{bureauName}</span>
                {report ? (
                  <Tag color="success" style={{ margin: 0, fontSize: 11 }}>{report.creditScore}</Tag>
                ) : (
                  <Tag color="default" style={{ margin: 0, fontSize: 11 }}>Not Fetched</Tag>
                )}
              </div>
            ),
            children: report ? (
              <div style={{ padding: '8px 0' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card bodyStyle={{ padding: 16, backgroundColor: '#F8FAFC' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>CREDIT SCORE</Text>
                      <div style={{ fontSize: 28, fontWeight: 700, color: report.creditScore >= 750 ? '#168A5B' : '#D98C00' }}>
                        {report.creditScore}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {report.creditScore >= 750 ? 'Tier 1 Prime Score' : 'Standard Borrower'}
                      </Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card bodyStyle={{ padding: 16, backgroundColor: '#F8FAFC' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>DPD 90+ DAYS DELINQUENCIES</Text>
                      <div style={{ fontSize: 28, fontWeight: 700, color: report.dpd90PlusCount === 0 ? '#168A5B' : '#C62828' }}>
                        {report.dpd90PlusCount || 0}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Defaults in 36 Mos</Text>
                    </Card>
                  </Col>
                </Row>

                <Table
                  pagination={false}
                  size="small"
                  style={{ marginTop: 16 }}
                  dataSource={[
                    { metric: 'Fetch Timestamp', val: new Date(report.fetchDate).toLocaleString('en-IN') },
                    { metric: 'Consent Record URN', val: report.consentRecordId || 'CONSENT-VERIFIED' },
                    { metric: 'Total Bureau Credit Inquiries', val: `${report.enquiryCount || 1} Enquiries` },
                    { metric: 'Risk Category', val: report.creditScore >= 750 ? 'Low Credit Risk' : 'Moderate Credit Risk' },
                  ]}
                  columns={[
                    { title: 'Bureau Parameter', dataIndex: 'metric', width: '50%' },
                    { title: 'Value', dataIndex: 'val', render: (v) => <strong>{v}</strong> },
                  ]}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>No report fetched yet from {bureauName}</Text>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  style={{ backgroundColor: '#052E2B' }}
                  onClick={() => onFetchBureau && onFetchBureau(bureauName)}
                >
                  Pull Real-Time {bureauName} Report
                </Button>
              </div>
            ),
          };
        })}
      />
    </Card>
  );
};

export default MultiBureauViewer;
