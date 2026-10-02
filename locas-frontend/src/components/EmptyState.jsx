import React from 'react';
import { Empty, Button } from 'antd';

export const EmptyState = ({ description = "No record found", actionLabel, onAction }) => {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <Empty
        description={<span style={{ color: '#667085', fontSize: 14 }}>{description}</span>}
      >
        {actionLabel && (
          <Button type="primary" onClick={onAction} style={{ backgroundColor: '#052E2B' }}>
            {actionLabel}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;
