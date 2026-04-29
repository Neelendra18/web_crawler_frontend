import React from 'react';

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; delta?: string; color?: string }> = ({ icon, value, label, delta, color }) => (
  <div className={`stat-card${color ? ' ' + color : ''}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {delta && <div className={`stat-delta${delta.startsWith('↑') ? ' up' : ' down'}`}>{delta}</div>}
  </div>
);

export default StatCard;
