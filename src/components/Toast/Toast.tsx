import React from 'react';

const Toast: React.FC<{ show: boolean; message: string; type?: 'warn' | 'error' | 'info' }> = ({ show, message, type = 'info' }) => {
  if (!show) return null;
  return (
    <div className={`perm-toast show ${type}`}> <span>🔒</span> <span>{message}</span> </div>
  );
};

export default Toast;
