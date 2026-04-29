import React from 'react';

const PermissionDeniedPage: React.FC = () => (
  <div className="locked-page">
    <div className="locked-icon">🔒</div>
    <div className="locked-title">Permission Denied</div>
    <div className="locked-sub">You don't have permission to access this page or feature.</div>
    <div className="locked-chip">RBAC Policy</div>
  </div>
);

export default PermissionDeniedPage;
