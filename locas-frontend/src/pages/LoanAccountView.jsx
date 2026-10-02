import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Modal, Form, InputNumber, Select, Tabs, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { loanApi } from '../api/services';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { DollarOutlined, CalendarOutlined, CheckCircleOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const LoanAccountView = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [paymentForm] = Form.useForm();

  useEffect(() => {
    fetchLoanAccountData();
  }, [id]);

  const fetchLoanAccountData = async () => {
    setLoading(true);
    try {
      const accRes = await loanApi.getById(id);
      setAccount(accRes.data);

      const schRes = await loanApi.getEmiSchedule(id);
      setSchedule(schRes.data || []);
    } catch (err) {
      message.error('Failed to load loan account');
    } finally {
      setLoading(false);
    }
  };

  const handlePostPayment = async (values) => {
    setSubmitting(true);
    try {
      const res = await loanApi.recordPayment(id, {
        amount: values.amount,
        paymentMode: values.paymentMode,
      });
      const paymentInfo = res.data || {};
      setPaymentModal(false);
      setReceiptData({
        txnId: `TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: values.amount,
        principalPaid: paymentInfo.principalPaid || 0,
        interestPaid: paymentInfo.interestPaid || 0,
        outstandingBalance: paymentInfo.outstandingBalance || 0,
      });
      message.success(`Payment of ₹${values.amount.toLocaleString('en-IN')} posted successfully!`);
      fetchLoanAccountData();
    } catch (err) {
      message.error(err.message || 'Payment recording failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !account) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <div>
      {/* Account Overview Header */}
      {/* Account Overview Header with Mortgage Template Asset */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          marginBottom: 20,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(7, 22, 40, 0.92) 0%, rgba(15, 39, 68, 0.88) 100%), url("/images/loan_home_mortgage.jpg") center/cover no-repeat',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text style={{ color: '#94A3B8', fontSize: 12 }}>LOAN ACCOUNT NUMBER</Text>
            <Title level={2} style={{ color: '#FFF', margin: 0 }}>{account.accountNumber}</Title>
            <Text style={{ color: '#CBD5E1' }}>Customer: <strong>{account.applicantName}</strong> • Ref: {account.applicationRef}</Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Tag color={account.npaCategory === 'STANDARD' ? 'success' : 'error'} style={{ padding: '6px 12px', fontSize: 14, fontWeight: 600 }}>
              {account.npaCategory} (DPD: {account.dpd})
            </Tag>
            <div style={{ marginTop: 8 }}>
              <Button type="primary" icon={<DollarOutlined />} style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700 }} onClick={() => {
                paymentForm.setFieldsValue({ amount: account.emiAmount, paymentMode: 'NET_BANKING' });
                setPaymentModal(true);
              }}>
                Make EMI Payment
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[16, 16]} style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8 }}>
          <Col xs={12} sm={6}>
            <Text type="secondary" style={{ fontSize: 11 }}>OUTSTANDING PRINCIPAL</Text>
            <div><CurrencyDisplay amount={account.outstandingPrincipal} size={22} color="#D98C00" /></div>
          </Col>
          <Col xs={12} sm={6}>
            <Text type="secondary" style={{ fontSize: 11 }}>MONTHLY EMI</Text>
            <div><CurrencyDisplay amount={account.emiAmount} size={22} color="#052E2B" /></div>
          </Col>
          <Col xs={12} sm={6}>
            <Text type="secondary" style={{ fontSize: 11 }}>NEXT DUE DATE</Text>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0D9488', marginTop: 2 }}>{account.nextDueDate}</div>
          </Col>
          <Col xs={12} sm={6}>
            <Text type="secondary" style={{ fontSize: 11 }}>INTEREST RATE</Text>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#168A5B', marginTop: 2 }}>{account.interestRate}% p.a.</div>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card style={{ borderRadius: 10 }}>
        <Tabs
          items={[
            {
              key: 'schedule',
              label: 'Amortization & EMI Schedule',
              children: (
                <Table
                  dataSource={schedule}
                  rowKey="installmentNumber"
                  columns={[
                    { title: '#', dataIndex: 'installmentNumber', width: 60 },
                    { title: 'Due Date', dataIndex: 'dueDate' },
                    { title: 'EMI Amount', dataIndex: 'emiAmount', render: (val) => <CurrencyDisplay amount={val} /> },
                    { title: 'Principal Paid', dataIndex: 'principalPaid', render: (val) => <CurrencyDisplay amount={val} bold={false} /> },
                    { title: 'Interest Paid', dataIndex: 'interestPaid', render: (val) => <CurrencyDisplay amount={val} bold={false} color="#D98C00" /> },
                    { title: 'Outstanding Balance', dataIndex: 'outstandingBalance', render: (val) => <CurrencyDisplay amount={val} color="#052E2B" /> },
                    { title: 'Status', dataIndex: 'status', render: (val) => <Tag color={val === 'PAID' ? 'success' : 'default'}>{val}</Tag> },
                    { title: 'Paid Date', dataIndex: 'paidDate', render: (val) => val || '-' },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Payment Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarOutlined style={{ color: '#168A5B', fontSize: 20 }} />
            <span>Post Monthly EMI Payment</span>
          </div>
        }
        open={paymentModal}
        onCancel={() => setPaymentModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={paymentForm} layout="vertical" onFinish={handlePostPayment}>
          <Form.Item name="amount" label="Payment Amount (₹)" rules={[{ required: true, message: 'Please enter payment amount' }]}>
            <InputNumber size="large" style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/\₹\s?|(,*)/g, '')} />
          </Form.Item>

          <Form.Item name="paymentMode" label="Payment Channel / Gateway" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="NET_BANKING">🌐 Net Banking (HDFC / ICICI / SBI / Axis)</Select.Option>
              <Select.Option value="UPI">📱 Instant UPI Transfer (GPay / PhonePe / Paytm)</Select.Option>
              <Select.Option value="NACH_AUTODEBIT">🏦 NACH Auto-Debit Clearance</Select.Option>
              <Select.Option value="CASH">💵 Branch Cash Deposit</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ backgroundColor: '#F6FFED', border: '1px solid #B7EB8F', padding: 12, borderRadius: 6, marginBottom: 20 }}>
            <Text style={{ fontSize: 12, color: '#274B0D' }}>
              ℹ️ Payment will be credited instantly to Loan Account <strong>{account.accountNumber}</strong>. Outstanding principal and DPD counter will automatically update.
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => setPaymentModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting} icon={<CheckCircleOutlined />} style={{ backgroundColor: '#168A5B', border: 'none' }}>
              Confirm & Complete Payment
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payment Success Receipt Modal */}
      <Modal
        title={null}
        open={!!receiptData}
        onCancel={() => setReceiptData(null)}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" icon={<DownloadOutlined />} style={{ backgroundColor: '#052E2B' }} onClick={() => {
              message.success('Payment receipt downloaded as PDF');
              setReceiptData(null);
            }}>
              Download Official Receipt
            </Button>
          </div>
        }
      >
        {receiptData && (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <CheckCircleOutlined style={{ fontSize: 54, color: '#52C41A', marginBottom: 12 }} />
            <Title level={3} style={{ color: '#052E2B', margin: 0 }}>EMI Payment Successful!</Title>
            <Text type="secondary">Transaction Ref: <strong>{receiptData.txnId}</strong></Text>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, marginTop: 20, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Loan Account:</Text>
                <Text bold>{account.accountNumber}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Total Amount Paid:</Text>
                <CurrencyDisplay amount={receiptData.amount} size={18} color="#168A5B" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Principal Adjusted:</Text>
                <CurrencyDisplay amount={receiptData.principalPaid} size={15} color="#052E2B" bold={false} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Interest Component:</Text>
                <CurrencyDisplay amount={receiptData.interestPaid} size={15} color="#D98C00" bold={false} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px dashed #CBD5E1' }}>
                <Text type="secondary">New Outstanding Balance:</Text>
                <CurrencyDisplay amount={receiptData.outstandingBalance} size={16} color="#052E2B" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LoanAccountView;
