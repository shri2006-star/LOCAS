import React from 'react';
import { Modal, Button, Typography, Row, Col, Table, Tag, Divider } from 'antd';
import { PrinterOutlined, DownloadOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatIndianCurrency } from './CurrencyDisplay';

const { Title, Text, Paragraph } = Typography;

export const SanctionLetterModal = ({ open, onClose, offer, application }) => {
  if (!offer || !application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Close</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} style={{ backgroundColor: '#052E2B' }} onClick={handlePrint}>
          Print / Save PDF Sanction Letter
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div id="printable-sanction-letter" style={{ padding: '24px 32px', backgroundColor: '#FFF', color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
        {/* Bank Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #052E2B', pb: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: '#052E2B', padding: '10px 14px', borderRadius: 8 }}>
              <SafetyCertificateOutlined style={{ color: '#FFF', fontSize: 28 }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#052E2B', letterSpacing: '0.05em' }}>LOCAS DIGITAL BANK</Title>
              <Text type="secondary" style={{ fontSize: 11 }}>Retail & Commercial Credit Assessment Division</Text>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Tag color="success" style={{ padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>SANCTION LETTER</Tag>
            <Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 4 }}>Ref: {application.applicationRef}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>Date: {new Date().toLocaleDateString('en-IN')}</Text>
          </div>
        </div>

        {/* Recipient Details */}
        <div style={{ marginBottom: 24, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <Text bold style={{ display: 'block', color: '#052E2B', marginBottom: 4 }}>To,</Text>
          <Text bold style={{ fontSize: 16, color: '#052E2B', display: 'block' }}>{application.applicant?.fullName}</Text>
          <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>{application.applicant?.address}</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>Mobile: {application.applicant?.mobileNumber} • PAN: {application.applicant?.maskedPan}</Text>
        </div>

        <Paragraph style={{ fontSize: 14, lineHeight: 1.6 }}>
          Dear <strong>{application.applicant?.fullName}</strong>,<br />
          We are pleased to inform you that based on our credit assessment and bureau underwriting, LOCAS Digital Bank has in-principle <strong>SANCTIONED</strong> your loan application as per the approved financial terms below:
        </Paragraph>

        {/* Terms Table */}
        <Table
          pagination={false}
          bordered
          size="small"
          style={{ marginBottom: 24 }}
          dataSource={[
            { key: '1', term: 'Sanctioned Loan Amount', value: formatIndianCurrency(offer.sanctionedAmount) },
            { key: '2', term: 'Loan Facility Product', value: `${application.productType} LOAN` },
            { key: '3', term: 'Applicable Rate of Interest (ROI)', value: `${offer.interestRate}% p.a. (Reducing Balance)` },
            { key: '4', term: 'Sanctioned Loan Tenure', value: `${offer.tenureMonths} Months` },
            { key: '5', term: 'Monthly EMI Amount', value: formatIndianCurrency(offer.emiAmount) },
            { key: '6', term: 'Processing Fee (inclusive of GST)', value: formatIndianCurrency(offer.processingFee) },
            { key: '7', term: 'Sanction Offer Expiry Date', value: offer.acceptanceDeadline || '15 Days from Issuance' },
          ]}
          columns={[
            { title: 'Approved Sanction Parameter', dataIndex: 'term', key: 'term', width: '50%', render: (val) => <strong>{val}</strong> },
            { title: 'Sanction Value / Term', dataIndex: 'value', key: 'value', render: (val) => <span style={{ color: '#052E2B', fontWeight: 600 }}>{val}</span> },
          ]}
        />

        {/* Pre-Disbursement Conditions */}
        <div style={{ marginBottom: 24 }}>
          <Text bold style={{ fontSize: 14, color: '#052E2B', display: 'block', marginBottom: 8 }}>Pre-Disbursement Mandatory Conditions:</Text>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
            <div><CheckCircleOutlined style={{ color: '#168A5B', marginRight: 6 }} /> Registration of active NACH Auto-Debit Mandate from customer primary bank account.</div>
            <div><CheckCircleOutlined style={{ color: '#168A5B', marginRight: 6 }} /> Execution of Loan Agreement & Demand Promissory Note.</div>
            <div><CheckCircleOutlined style={{ color: '#168A5B', marginRight: 6 }} /> Creation of Equitable Mortgage / Hypothecation charge on collateral where applicable.</div>
          </div>
        </div>

        {/* Signatures */}
        <Row style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>AUTHORIZED SIGNATORY</Text>
            <div style={{ fontWeight: 700, color: '#052E2B', marginTop: 12 }}>Vikramaditya Roy</div>
            <Text type="secondary" style={{ fontSize: 11 }}>VP - Credit Head & Chief Risk Officer</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>APPLICANT ACCEPTANCE</Text>
            <div style={{ fontWeight: 700, color: '#052E2B', marginTop: 12 }}>{application.applicant?.fullName}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Date of Acceptance: _______________</Text>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default SanctionLetterModal;
