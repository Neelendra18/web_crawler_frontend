import React from 'react';

const StatusChip: React.FC<{ status: 'running' | 'done' | 'failed' | 'queued'; children: React.ReactNode }> = ({ status, children }) => (
  <span className={`status-chip ${status}`}>{children}</span>
);

export default StatusChip;
