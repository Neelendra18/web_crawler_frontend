import React from 'react';

const TokenWidget: React.FC<{ estimate: number; available: number; percent: number }> = ({ estimate, available, percent }) => (
  <div className="token-widget">
    <div className="token-row">
      <div>
        <div className="token-label">Estimated Usage</div>
        <div className="token-val">~{estimate.toLocaleString()}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="token-label">Available</div>
        <div className="token-val" style={{ color: 'var(--accent)' }}>{available.toLocaleString()}</div>
      </div>
    </div>
    <div className="token-bar"><div className="token-fill ok" style={{ width: percent + '%' }}></div></div>
    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'DM Mono, monospace' }}>{percent}% of monthly quota</div>
  </div>
);

export default TokenWidget;
