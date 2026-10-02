import React from 'react';
import { Timeline, Typography, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const AuditTimeline = ({ items = [] }) => {
  return (
    <Timeline
      mode="left"
      items={items.map((item) => ({
        color: '#0D9488',
        dot: <ClockCircleOutlined style={{ fontSize: '14px' }} />,
        children: (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Text bold style={{ color: '#052E2B', fontSize: 13 }}>{item.action}</Text>
              <Tag color="blue">{item.username || 'System'}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
              {new Date(item.timestamp).toLocaleString('en-IN')}
            </Text>
            {item.newValue && (
              <Text style={{ fontSize: 12, color: '#667085', marginTop: 4, display: 'block' }}>
                {item.newValue}
              </Text>
            )}
          </div>
        ),
      }))}
    />
  );
};

export default AuditTimeline;
