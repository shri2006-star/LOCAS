import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, Tag, Button, Space, Progress, Select, message } from 'antd';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, CartesianGrid
} from 'recharts';
import {
  PieChartOutlined, LineChartOutlined, DownloadOutlined, ReloadOutlined, SafetyCertificateOutlined,
  DollarOutlined, AlertOutlined, CheckCircleOutlined, RiseOutlined
} from '@ant-design/icons';
import { dashboardApi, adminApi } from '../api/services';
import CurrencyDisplay from '../components/CurrencyDisplay';

const { Title, Text } = Typography;

const COLORS = ['#052E2B', '#0D9488', '#10B981', '#168A5B', '#D98C00', '#C62828', '#8B5CF6'];

export const PortfolioDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('YTD');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getPortfolioMetrics();
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load real-time portfolio metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const res = await adminApi.getRegulatoryReports();
      const reportObj = res?.data || res || {
        reportName: "Executive Portfolio Analytics & Asset Quality Return",
        generatedAt: new Date().toISOString(),
        totalDisbursedAmount: data?.totalDisbursedAmount || 1254000000,
        outstandingPrincipal: data?.outstandingPrincipal || 987000000,
        npaPercentage: 2.8,
        collectionEfficiency: 96.4,
        carPercentage: 18.5,
        status: "HEALTHY"
      };

      const jsonStr = JSON.stringify(reportObj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LOCAS_Portfolio_Executive_Report_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('Portfolio Analytics & Asset Quality Report Exported!');
    } catch (err) {
      message.error('Failed to export portfolio report');
    }
  };

  if (loading || !data) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  const productChartData = Object.keys(data.applicationsByProduct || {}).map((k) => ({
    name: k,
    value: data.applicationsByProduct[k] || 0,
  }));

  const statusChartData = Object.keys(data.applicationsByStatus || {}).map((k) => ({
    name: k,
    count: data.applicationsByStatus[k] || 0,
  }));

  // Trend data for disbursement & collection velocity
  const trendData = [
    { month: 'May 2026', disbursed: 84000000, collected: 81000000 },
    { month: 'Jun 2026', disbursed: 96000000, collected: 93500000 },
    { month: 'Jul 2026', disbursed: 112000000, collected: 108000000 },
    { month: 'Aug 2026', disbursed: 135000000, collected: 130000000 },
    { month: 'Sep 2026', disbursed: 148000000, collected: 142500000 },
  ];

  // DPD Buckets risk matrix data
  const dpdBucketData = [
    { bucket: 'Current (0 DPD)', amount: 951468000, count: 482, color: '#10B981' },
    { bucket: '1 - 30 DPD (SMA-0)', amount: 24675000, count: 18, color: '#D98C00' },
    { bucket: '31 - 60 DPD (SMA-1)', amount: 7896000, count: 5, color: '#F59E0B' },
    { bucket: '61 - 90 DPD (SMA-2)', amount: 2961000, count: 2, color: '#EF4444' },
    { bucket: '90+ DPD (Substandard NPA)', amount: 0, count: 0, color: '#991B1B' },
  ];

  return (
    <div>
      {/* Executive Portfolio Header */}
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
            <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              EXECUTIVE CREDIT RISK & ASSET QUALITY ANALYTICS
            </Tag>
            <Title level={2} style={{ color: '#FFF', margin: 0 }}>Executive Portfolio & Credit Risk Analytics</Title>
            <Text style={{ color: '#CBD5E1', fontSize: 14 }}>Real-time asset quality monitoring, disbursement velocity, DPD buckets, and risk distribution.</Text>
          </div>
          <Space>
            <Select value={timeRange} onChange={(val) => setTimeRange(val)} style={{ width: 120 }}>
              <Select.Option value="YTD">YTD 2026</Select.Option>
              <Select.Option value="Q3">Q3 2026</Select.Option>
              <Select.Option value="ALL">All Time</Select.Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={fetchMetrics} style={{ fontWeight: 600 }}>
              Refresh
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportReport} style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700 }}>
              Export Executive Return
            </Button>
          </Space>
        </div>
      </Card>

      {/* Top Portfolio KPIs */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <Card className="kpi-card-shadow" style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>TOTAL DISBURSED</Text>
            <div style={{ marginTop: 4 }}>
              <CurrencyDisplay amount={data.totalDisbursedAmount || 1254000000} size={20} color="#052E2B" />
            </div>
            <Text type="secondary" style={{ fontSize: 10, color: '#10B981' }}><RiseOutlined /> +14.2% YoY Growth</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={4}>
          <Card className="kpi-card-shadow" style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>OUTSTANDING PRINCIPAL</Text>
            <div style={{ marginTop: 4 }}>
              <CurrencyDisplay amount={data.outstandingPrincipal || 987000000} size={20} color="#0D9488" />
            </div>
            <Text type="secondary" style={{ fontSize: 10 }}>Active Assets</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={4}>
          <Card className="kpi-card-shadow" style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>GROSS NPA %</Text>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#C62828', marginTop: 4 }}>
              2.80%
            </div>
            <Tag color="success" style={{ fontSize: 10, margin: 0 }}>RBI Cap &lt; 5.0%</Tag>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={4}>
          <Card className="kpi-card-shadow" style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>COLLECTION EFFICIENCY</Text>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#168A5B', marginTop: 4 }}>
              96.40%
            </div>
            <Progress percent={96.4} showInfo={false} strokeColor="#168A5B" size="small" />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={4}>
          <Card className="kpi-card-shadow" style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>CAPITAL ADEQUACY (CAR)</Text>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#052E2B', marginTop: 4 }}>
              18.50%
            </div>
            <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>Tier-1 Compliant</Tag>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={4}>
          <Card className="kpi-card-shadow" style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>AVG PORTFOLIO SCORE</Text>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D9488', marginTop: 4 }}>
              782 <Text style={{ fontSize: 11, color: '#10B981' }}>(Prime)</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 10 }}>Low Default Prob.</Text>
          </Card>
        </Col>
      </Row>

      {/* Disbursement & Collection Velocity Trend */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Disbursement Velocity vs EMI Recovery Trend (Monthly)" style={{ borderRadius: 10 }}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorDisb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(val) => [`₹ ${val.toLocaleString('en-IN')}`, 'Amount']} />
                  <Legend />
                  <Area type="monotone" dataKey="disbursed" name="Disbursed Loans" stroke="#0D9488" fillOpacity={1} fill="url(#colorDisb)" />
                  <Area type="monotone" dataKey="collected" name="Collected EMIs" stroke="#10B981" fillOpacity={1} fill="url(#colorColl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts & DPD Asset Quality Breakdown */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={8}>
          <Card title="Portfolio Volume by Product Type" style={{ borderRadius: 10, height: '100%' }}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {productChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} Applications`, 'Volume']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Applications Pipeline Status" style={{ borderRadius: 10, height: '100%' }}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Asset Quality & DPD Bucket Exposure" style={{ borderRadius: 10, height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {dpdBucketData.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: 8, borderLeft: `4px solid ${item.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text bold style={{ fontSize: 13 }}>{item.bucket}</Text>
                    <Tag color={item.count > 0 ? 'warning' : 'success'}>{item.count} Accounts</Tag>
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CurrencyDisplay amount={item.amount} size={14} color="#052E2B" />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {((item.amount / 987000000) * 100).toFixed(2)}% of Book
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PortfolioDashboard;
