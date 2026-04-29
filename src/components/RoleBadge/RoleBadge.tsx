import React from 'react';

const RoleBadge: React.FC<{ role: 'admin' | 'qa' | 'dev' | 'viewer'; children?: React.ReactNode }> = ({ role, children }) => (
  <span className={`role-badge ${role}`}>{children || role.charAt(0).toUpperCase() + role.slice(1)}</span>
);

export default RoleBadge;
