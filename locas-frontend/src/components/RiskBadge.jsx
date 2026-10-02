import React from 'react';
import { Tag } from 'antd';

const riskConfig = {
  APPROVE: { color: '#168A5B', bg: '#E6F4EA', label: 'APPROVE' },
  LOW_RISK: { color: '#168A5B', bg: '#E6F4EA', label: 'LOW RISK' },
  REVIEW: { color: '#D98C00', bg: '#FEF7E0', label: 'REVIEW' },
  MEDIUM_RISK: { color: '#D98C00', bg: '#FEF7E0', label: 'MEDIUM RISK' },
  DECLINE: { color: '#C62828', bg: '#FCE8E6', label: 'DECLINE' },
  REJECT: { color: '#C62828', bg: '#FCE8E6', label: 'REJECT' },
  HIGH_RISK: { color: '#C62828', bg: '#FCE8E6', label: 'HIGH RISK' },
  STANDARD: { color: '#168A5B', bg: '#E6F4EA', label: 'STANDARD' },
  SMA_0: { color: '#D98C00', bg: '#FEF7E0', label: 'SMA-0 (1-30 DPD)' },
  SMA_1: { color: '#D98C00', bg: '#FEF7E0', label: 'SMA-1 (31-60 DPD)' },
  SMA_2: { color: '#D98C00', bg: '#FEF7E0', label: 'SMA-2 (61-90 DPD)' },
  SUB_STANDARD: { color: '#C62828', bg: '#FCE8E6', label: 'SUB-STANDARD' },
  DOUBTFUL: { color: '#C62828', bg: '#FCE8E6', label: 'DOUBTFUL' },
  LOSS: { color: '#C62828', bg: '#FCE8E6', label: 'LOSS' },
};

export const RiskBadge = ({ risk }) => {
  const cfg = riskConfig[risk] || { color: '#667085', bg: '#F5F7FA', label: risk };
  return (
    <span
      style={{
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.color}33`,
        padding: '3px 10px',
        borderRadius: 4,
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: '0.02em',
        display: 'inline-block',
      }}
    >
      {cfg.label}
    </span>
  );
};

export default RiskBadge;
