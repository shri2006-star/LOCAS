import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, Row, Col, Skeleton, Space } from 'antd';
import { HistoryOutlined, FileTextOutlined, AimOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationApi, loanApi } from '../api/services';
import StatusBadge from '../components/StatusBadge';
import CurrencyDisplay from '../components/CurrencyDisplay';

const { Title, Text, Paragraph } = Typography;

export const LoanHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loanAccounts, setLoanAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const appRes = await applicationApi.getMyApplications();
      const apps = Array.isArray(appRes) ? appRes : (appRes?.data || []);
      setApplications(apps);

      const loansRes = await loanApi.getAll();
      const loans = Array.isArray(loansRes) ? loansRes : (loansRes?.data || []);
      setLoanAccounts(loans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          borderRadius: 14,
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.94) 0%, rgba(15, 39, 68, 0.90) 100%), url("/images/loan_home_mortgage.jpg") center/cover no-repeat',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              APPLICANT AUDIT TRAIL
            </Tag>
            <Title level={2} style={{ color: '#FFF', margin: '4px 0 8px' }}>
              Loan History & Active Accounts
            </Title>
            <Paragraph style={{ color: '#CBD5E1', fontSize: 14, margin: 0 }}>
              Review all historical loan applications, current credit statuses, and active repayment accounts.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700, height: 44, borderRadius: 8 }}
              onClick={() => navigate('/dashboard')}
            >
              Apply New Loan
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          {/* Applications Table */}
          <Card
            title={
              <Space>
                <HistoryOutlined style={{ color: '#0D9488', fontSize: 18 }} />
                <span>All Applied Loan Applications ({applications.length})</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #E3E8EF', boxShadow: '0 4px 16px rgba(11,31,58,0.06)' }}
          >
            {applications.length > 0 ? (
              <Table
                dataSource={applications}
                rowKey="id"
                columns={[
                  { title: 'App Reference', dataIndex: 'applicationRef', render: (val) => <Text bold style={{ color: '#0D9488' }}>{val}</Text> },
                  { title: 'Loan Product', dataIndex: 'productType', render: (val) => <Tag color="blue">{val}</Tag> },
                  { title: 'Requested Amount', dataIndex: 'requestedAmount', render: (val) => <CurrencyDisplay amount={val} /> },
                  { title: 'Tenure', dataIndex: 'tenureMonths', render: (val) => `${val} Months` },
                  { title: 'Status', dataIndex: 'status', render: (val) => <StatusBadge status={val} /> },
                  {
                    title: 'Action',
                    render: (_, record) => (
                      <Button
                        type="primary"
                        size="small"
                        icon={<AimOutlined />}
                        style={{ backgroundColor: '#052E2B', fontWeight: 600 }}
                        onClick={() => navigate('/track-loan')}
                      >
                        Track Status
                      </Button>
                    ),
                  },
                ]}
                pagination={{ pageSize: 5 }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Text type="secondary">No loan applications found in your history.</Text>
              </div>
            )}
          </Card>

          {/* Active Disbursed Accounts Table */}
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#168A5B', fontSize: 18 }} />
                <span>Active Disbursed Loan Accounts ({loanAccounts.length})</span>
              </Space>
            }
            style={{ borderRadius: 12, border: '1px solid #E3E8EF', boxShadow: '0 4px 16px rgba(11,31,58,0.06)' }}
          >
            {loanAccounts.length > 0 ? (
              <Table
                dataSource={loanAccounts}
                rowKey="id"
                columns={[
                  { title: 'Account No', dataIndex: 'accountNumber', render: (val) => <Text bold style={{ color: '#0D9488' }}>{val}</Text> },
                  { title: 'Disbursed Amount', dataIndex: 'disbursedAmount', render: (val) => <CurrencyDisplay amount={val} /> },
                  { title: 'Outstanding Principal', dataIndex: 'outstandingPrincipal', render: (val) => <CurrencyDisplay amount={val} color="#D98C00" /> },
                  { title: 'Monthly EMI', dataIndex: 'emiAmount', render: (val) => <CurrencyDisplay amount={val} /> },
                  { title: 'Next Due Date', dataIndex: 'nextDueDate' },
                  { title: 'NPA Category', dataIndex: 'npaCategory', render: (val) => <Tag color={val === 'STANDARD' ? 'success' : 'error'}>{val}</Tag> },
                  {
                    title: 'Action',
                    render: (_, record) => (
                      <Button type="primary" size="small" style={{ backgroundColor: '#052E2B' }} onClick={() => navigate(`/loans/${record.id}`)}>
                        View EMI Schedule
                      </Button>
                    ),
                  },
                ]}
                pagination={false}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Text type="secondary">No active disbursed loan accounts.</Text>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default LoanHistoryPage;
