import React, { useEffect, useState } from 'react';
import { Card, Table, Input, Select, Button, Space, Tag, Typography, Popconfirm, message, Row, Col, Drawer, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined, FilterOutlined, DeleteOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationApi, adminApi } from '../api/services';
import StatusBadge from '../components/StatusBadge';
import RiskBadge from '../components/RiskBadge';
import CurrencyDisplay from '../components/CurrencyDisplay';

const { Title, Text } = Typography;

export const ApplicationQueuePage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [productFilter, setProductFilter] = useState(null);
  const [drawerRecord, setDrawerRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, productFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationApi.search({
        status: statusFilter,
        productType: productFilter,
        search: search || null,
      });
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplicantUser = async (userId, appId, appRef) => {
    try {
      if (userId) {
        await adminApi.deleteUser(userId);
      } else if (appId) {
        await adminApi.deleteApplication(appId);
      } else {
        message.warning('Neither User ID nor Application ID is available');
        return;
      }
      message.success(`Deleted application ${appRef} and associated applicant details from MySQL!`);
      fetchApplications();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete applicant record';
      message.error(errorMsg);
    }
  };

  const handleExportQueue = () => {
    try {
      const jsonStr = JSON.stringify(applications, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LOCAS_Application_Queue_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('Exported Applications Master Queue!');
    } catch (err) {
      message.error('Export failed');
    }
  };

  const totalPipelineAmount = applications.reduce((acc, curr) => acc + (curr.requestedAmount || 0), 0);
  const underReviewCount = applications.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED' || a.status === 'OFFER_GENERATED' || a.status === 'OFFER_ACCEPTED').length;

  return (
    <div>
      {/* Application Master Queue Header */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          borderRadius: 14,
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(3, 23, 22, 0.94) 0%, rgba(5, 46, 43, 0.88) 100%), url("/images/digital_bank_building.jpg") center/cover no-repeat',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={2} style={{ color: '#FFF', margin: 0 }}>Loan Application Master Queue</Title>
            <Text style={{ color: '#CBD5E1', fontSize: 14 }}>Real-time loan application pipeline, search, filter, and underwriting entry.</Text>
          </div>
          <Button type="primary" icon={<DownloadOutlined />} style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700 }} onClick={handleExportQueue}>
            Export Queue JSON
          </Button>
        </div>
      </Card>

      {/* Summary KPI Strip */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>TOTAL APPLICATIONS</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#052E2B', marginTop: 2 }}>{applications.length} Loans</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>ACTIVE UNDERWRITING</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0D9488', marginTop: 2 }}>{underReviewCount} Applications</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>SANCTIONED / APPROVED</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#168A5B', marginTop: 2 }}>{approvedCount} Sanctioned</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>TOTAL PIPELINE VALUE</Text>
            <div style={{ marginTop: 2 }}>
              <CurrencyDisplay amount={totalPipelineAmount} size={20} color="#052E2B" />
            </div>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 10, border: '1px solid #E3E8EF' }}>
        <Space style={{ marginBottom: 20, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search Application Ref, Name..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={fetchApplications}
            style={{ width: 260 }}
          />

          <Select
            placeholder="Filter by Status"
            allowClear
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 180 }}
          >
            <Select.Option value="SUBMITTED">SUBMITTED</Select.Option>
            <Select.Option value="UNDER_REVIEW">UNDER REVIEW</Select.Option>
            <Select.Option value="RECOMMENDED">RECOMMENDED</Select.Option>
            <Select.Option value="APPROVED">APPROVED</Select.Option>
            <Select.Option value="DECLINED">DECLINED</Select.Option>
            <Select.Option value="DISBURSED">DISBURSED</Select.Option>
          </Select>

          <Select
            placeholder="Filter by Product"
            allowClear
            onChange={(val) => setProductFilter(val)}
            style={{ width: 160 }}
          >
            <Select.Option value="HOME">HOME</Select.Option>
            <Select.Option value="PERSONAL">PERSONAL</Select.Option>
            <Select.Option value="VEHICLE">VEHICLE</Select.Option>
            <Select.Option value="BUSINESS">BUSINESS</Select.Option>
            <Select.Option value="LAP">LAP</Select.Option>
          </Select>

          <Button type="primary" style={{ backgroundColor: '#052E2B' }} onClick={fetchApplications}>
            Apply Filters
          </Button>
        </Space>

        <Table
          dataSource={applications}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          columns={[
            {
              title: 'App Reference',
              dataIndex: 'applicationRef',
              width: 140,
              render: (val, record) => (
                <Text
                  bold
                  style={{ color: '#0D9488', cursor: 'pointer' }}
                  onClick={() => setDrawerRecord(record)}
                >
                  {val}
                </Text>
              ),
            },
            { title: 'Applicant', dataIndex: ['applicant', 'fullName'], width: 140 },
            { title: 'Product', dataIndex: 'productType', width: 100, render: (val) => <Tag color="blue">{val}</Tag> },
            { title: 'Requested Amount', dataIndex: 'requestedAmount', width: 150, render: (val) => <CurrencyDisplay amount={val} /> },
            { title: 'Credit Score', dataIndex: 'creditScore', width: 110, render: (val) => <span style={{ fontWeight: 700, color: '#168A5B' }}>{val || 780}</span> },
            { title: 'Status', dataIndex: 'status', width: 130, render: (val) => <StatusBadge status={val} /> },
            { title: 'Risk Band', dataIndex: 'riskBand', width: 110, render: (val) => <RiskBadge risk={val} /> },
            {
              title: 'Action',
              key: 'action',
              fixed: 'right',
              width: 220,
              render: (_, record) => (
                <Space>
                  <Button type="primary" icon={<EyeOutlined />} size="small" style={{ backgroundColor: '#052E2B' }} onClick={() => navigate(`/underwrite/${record.id}`)}>
                    Underwrite
                  </Button>
                  <Popconfirm
                    title="Delete Applicant Record?"
                    description={`Permanently delete application ${record.applicationRef} and applicant data from MySQL?`}
                    onConfirm={() => handleDeleteApplicantUser(record.applicant?.userId, record.id, record.applicationRef)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />} size="small">
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Quick View Application Drawer */}
      {drawerRecord && (
        <Drawer
          title={`Quick View Application: ${drawerRecord.applicationRef}`}
          placement="right"
          width={500}
          onClose={() => setDrawerRecord(null)}
          open={!!drawerRecord}
          extra={
            <Button
              type="primary"
              style={{ backgroundColor: '#052E2B' }}
              onClick={() => {
                const appId = drawerRecord.id;
                setDrawerRecord(null);
                navigate(`/underwrite/${appId}`);
              }}
            >
              Open Full Underwriting
            </Button>
          }
        >
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Applicant Name">{drawerRecord.applicant?.fullName}</Descriptions.Item>
            <Descriptions.Item label="Loan Product">{drawerRecord.productType}</Descriptions.Item>
            <Descriptions.Item label="Requested Amount">₹ {drawerRecord.requestedAmount?.toLocaleString('en-IN')}</Descriptions.Item>
            <Descriptions.Item label="Tenure">{drawerRecord.tenureMonths || 240} Months</Descriptions.Item>
            <Descriptions.Item label="CIBIL Score">{drawerRecord.creditScore || 780}</Descriptions.Item>
            <Descriptions.Item label="FOIR %">{drawerRecord.foirPercentage}%</Descriptions.Item>
            <Descriptions.Item label="LTV %">{drawerRecord.ltvPercentage}%</Descriptions.Item>
            <Descriptions.Item label="Status"><StatusBadge status={drawerRecord.status} /></Descriptions.Item>
            <Descriptions.Item label="Risk Rating"><RiskBadge risk={drawerRecord.riskBand} /></Descriptions.Item>
            <Descriptions.Item label="Annual Income">₹ {drawerRecord.applicant?.annualIncome?.toLocaleString('en-IN')}</Descriptions.Item>
            <Descriptions.Item label="Address">{drawerRecord.applicant?.address}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      )}
    </div>
  );
};

export default ApplicationQueuePage;
