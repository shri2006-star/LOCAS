import React from 'react';
import { Tag } from 'antd';
import { 
  FileTextOutlined, SendOutlined, AuditOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, LockOutlined
} from '@ant-design/icons';

const statusConfig = {
  DRAFT: { color: 'default', icon: <FileTextOutlined />, label: 'Draft' },
  SUBMITTED: { color: 'processing', icon: <SendOutlined />, label: 'Submitted' },
  BUREAU_CHECK: { color: 'purple', icon: <AuditOutlined />, label: 'Bureau Check' },
  UNDER_REVIEW: { color: 'warning', icon: <AuditOutlined />, label: 'Under Review' },
  RECOMMENDED: { color: 'blue', icon: <SendOutlined />, label: 'Recommended' },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Approved' },
  DECLINED: { color: 'error', icon: <CloseCircleOutlined />, label: 'Declined' },
  OFFER_GENERATED: { color: 'cyan', icon: <FileTextOutlined />, label: 'Offer Generated' },
  OFFER_ACCEPTED: { color: 'teal', icon: <CheckCircleOutlined />, label: 'Offer Accepted' },
  DISBURSED: { color: 'green', icon: <DollarOutlined />, label: 'Disbursed' },
  CLOSED: { color: 'default', icon: <LockOutlined />, label: 'Closed' },
};

export const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { color: 'default', label: status };
  return (
    <Tag color={cfg.color} icon={cfg.icon} style={{ padding: '4px 10px', fontSize: 13, fontWeight: 500 }}>
      {cfg.label}
    </Tag>
  );
};

export default StatusBadge;
