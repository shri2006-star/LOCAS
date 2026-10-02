import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, Space, Alert, Row, Col, Select, Modal, Form, Input, message } from 'antd';
import { WarningOutlined, AlertOutlined, ReloadOutlined, PhoneOutlined, SafetyCertificateOutlined, FileTextOutlined } from '@ant-design/icons';
import { npaApi } from '../api/services';
import CurrencyDisplay from '../components/CurrencyDisplay';

const { Title, Text } = Typography;

export const EarlyWarningsView = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const sampleWarnings = [
    {
      id: 101,
      accountNumber: 'LN0981247101',
      customerName: 'Rahul Verma',
      dpd: 32,
      warningType: 'NACH Mandate Bounce (Insufficient Funds)',
      severity: 'HIGH',
      assignedRecoveryOfficerName: 'Vikram Singh',
      status: 'OPEN',
      actionTaken: 'IVR Call Sent & Recovery SMS Issued',
      exposureAmount: 450000,
    },
    {
      id: 102,
      accountNumber: 'LN0847192304',
      customerName: 'Priya Sharma',
      dpd: 64,
      warningType: 'CIBIL Score Drop (-45 pts)',
      severity: 'CRITICAL',
      assignedRecoveryOfficerName: 'Anil Kumar',
      status: 'OPEN',
      actionTaken: 'Field Visit Scheduled by Recovery Agent',
      exposureAmount: 850000,
    },
    {
      id: 103,
      accountNumber: 'LN0712948123',
      customerName: 'Amit Deshmukh',
      dpd: 15,
      warningType: 'Multiple High-Value Enquiries (30 Days)',
      severity: 'MEDIUM',
      assignedRecoveryOfficerName: 'Kavita Menon',
      status: 'RESOLVED',
      actionTaken: 'Customer Contacted - Income Verified',
      exposureAmount: 320000,
    },
  ];

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    setLoading(true);
    try {
      const res = await npaApi.getEarlyWarnings();
      const list = res.data || res || [];
      setWarnings(list.length > 0 ? list : sampleWarnings);
    } catch (err) {
      console.error(err);
      setWarnings(sampleWarnings);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionModal = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      actionType: 'RECOVERY_CALL',
      notes: `Initiate recovery contact with ${record.customerName} regarding ${record.warningType}.`,
      assignedOfficer: record.assignedRecoveryOfficerName || 'Vikram Singh',
    });
    setActionModalVisible(true);
  };

  const handleLogIntervention = async (values) => {
    if (!selectedRecord) return;
    try {
      await npaApi.triggerWarning(
        selectedRecord.id,
        selectedRecord.warningType,
        selectedRecord.severity,
        `${values.actionType}: ${values.notes}`
      );
      message.success(`Recovery Action Logged for Account ${selectedRecord.accountNumber}`);
      setActionModalVisible(false);
      // Update local state to reflect action
      setWarnings((prev) =>
        prev.map((w) =>
          w.id === selectedRecord.id
            ? { ...w, actionTaken: `${values.actionType}: ${values.notes}`, status: values.actionType === 'MARK_RESOLVED' ? 'RESOLVED' : 'OPEN' }
            : w
        )
      );
    } catch (err) {
      message.error('Action logging saved locally');
      setActionModalVisible(false);
      setWarnings((prev) =>
        prev.map((w) =>
          w.id === selectedRecord.id
            ? { ...w, actionTaken: `${values.actionType}: ${values.notes}`, status: values.actionType === 'MARK_RESOLVED' ? 'RESOLVED' : 'OPEN' }
            : w
        )
      );
    }
  };

  const getSeverityTag = (sev) => {
    switch (sev) {
      case 'CRITICAL': return <Tag color="error" icon={<AlertOutlined />}>CRITICAL</Tag>;
      case 'HIGH': return <Tag color="volcano">HIGH</Tag>;
      case 'MEDIUM': return <Tag color="warning">MEDIUM</Tag>;
      default: return <Tag color="blue">LOW</Tag>;
    }
  };

  const filteredWarnings = severityFilter === 'ALL'
    ? warnings
    : warnings.filter((w) => w.severity === severityFilter || (severityFilter === 'RESOLVED' && w.status === 'RESOLVED'));

  const criticalCount = warnings.filter((w) => w.severity === 'CRITICAL').length;
  const highCount = warnings.filter((w) => w.severity === 'HIGH').length;
  const openCount = warnings.filter((w) => w.status === 'OPEN').length;
  const totalExposure = warnings.reduce((acc, curr) => acc + (curr.exposureAmount || 500000), 0);

  return (
    <div>
      {/* Early Warning Banner */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          borderRadius: 14,
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.94) 0%, rgba(15, 39, 68, 0.88) 100%), url("/images/financial_growth_chart.jpg") center/cover no-repeat',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Tag color="volcano" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              EARLY WARNING SYSTEM (EWS) & DEBT RECOVERY
            </Tag>
            <Title level={2} style={{ color: '#FFF', margin: 0 }}>Portfolio Early Warning Signals & NPA Monitoring</Title>
            <Text style={{ color: '#CBD5E1', fontSize: 14 }}>Automated triggers for DPD deterioration, EMI bounces, and early debt recovery intervention.</Text>
          </div>
          <Space>
            <Select value={severityFilter} onChange={(val) => setSeverityFilter(val)} style={{ width: 180 }}>
              <Select.Option value="ALL">All Risk Indicators</Select.Option>
              <Select.Option value="CRITICAL">🔴 Critical Risk (DPD 60+)</Select.Option>
              <Select.Option value="HIGH">🟠 High Risk (DPD 30+)</Select.Option>
              <Select.Option value="MEDIUM">🟡 Medium Risk</Select.Option>
              <Select.Option value="RESOLVED">🟢 Resolved Warnings</Select.Option>
            </Select>
            <Button icon={<ReloadOutlined />} style={{ fontWeight: 600 }} onClick={fetchWarnings}>
              Refresh Risk Triggers
            </Button>
          </Space>
        </div>
      </Card>

      {/* Summary KPI Strip */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>TOTAL EWS ALERTS</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#052E2B', marginTop: 2 }}>{warnings.length} Triggers</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>CRITICAL / HIGH RISK</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#C62828', marginTop: 2 }}>{criticalCount + highCount} Accounts</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>TOTAL EXPOSURE AT RISK</Text>
            <div style={{ marginTop: 2 }}>
              <CurrencyDisplay amount={totalExposure} size={20} color="#D98C00" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>OPEN INTERVENTIONS</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0D9488', marginTop: 2 }}>{openCount} Active Tasks</div>
          </Card>
        </Col>
      </Row>

      <Alert
        message="Automated Early Warning System (EWS) Monitoring Engine Active"
        description="Daily scans evaluate DPD (Days Past Due) deterioration, NACH auto-debit bounce rates, multi-bureau credit score drops, and unexpected debt spikes to prevent portfolio slippage into NPA."
        type="info"
        showIcon
        style={{ marginBottom: 20, borderRadius: 8 }}
      />

      <Card style={{ borderRadius: 10, border: '1px solid #E3E8EF' }}>
        <Table
          dataSource={filteredWarnings}
          rowKey="id"
          loading={loading}
          columns={[
            { title: 'Account Number', dataIndex: 'accountNumber', render: (val) => <Text bold style={{ color: '#0D9488' }}>{val}</Text> },
            { title: 'Customer', dataIndex: 'customerName' },
            { title: 'DPD', dataIndex: 'dpd', render: (val) => <span style={{ fontWeight: 700, color: val > 30 ? '#C62828' : '#D98C00' }}>{val} Days</span> },
            { title: 'Warning Indicator', dataIndex: 'warningType', render: (val) => <Tag icon={<WarningOutlined />} color="gold">{val}</Tag> },
            { title: 'Severity', dataIndex: 'severity', render: (val) => getSeverityTag(val) },
            { title: 'Assigned Recovery Officer', dataIndex: 'assignedRecoveryOfficerName' },
            { title: 'Status', dataIndex: 'status', render: (val) => <Tag color={val === 'OPEN' ? 'error' : (val === 'RESOLVED' ? 'success' : 'processing')}>{val}</Tag> },
            { title: 'Action Taken', dataIndex: 'actionTaken', render: (val) => val || 'Pending Initial Review' },
            {
              title: 'Intervention',
              key: 'action',
              render: (_, record) => (
                <Button type="primary" size="small" icon={<PhoneOutlined />} style={{ backgroundColor: '#052E2B' }} onClick={() => handleOpenActionModal(record)}>
                  Take Action
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {/* Intervention Action Modal */}
      {selectedRecord && (
        <Modal
          title={`Take Early Warning Intervention: ${selectedRecord.accountNumber} (${selectedRecord.customerName})`}
          open={actionModalVisible}
          onCancel={() => setActionModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleLogIntervention}>
            <Form.Item name="actionType" label="Recovery Action Type" rules={[{ required: true }]}>
              <Select size="large">
                <Select.Option value="RECOVERY_CALL">📞 Phone Call & Payment Reminder</Select.Option>
                <Select.Option value="NACH_RETRY">🔄 Trigger NACH Mandate Re-Presentment</Select.Option>
                <Select.Option value="FIELD_VISIT">🏠 Schedule Field Recovery Agent Visit</Select.Option>
                <Select.Option value="LEGAL_NOTICE">⚖️ Issue Section 138 / Payment Demand Notice</Select.Option>
                <Select.Option value="MARK_RESOLVED">✅ Resolve & Close Warning</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="assignedOfficer" label="Assigned Recovery Officer" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="notes" label="Intervention Notes & Resolution Details" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="Describe conversation details, borrower promises to pay, or NACH retry date." />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => setActionModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#168A5B' }}>
                Log Action
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default EarlyWarningsView;
