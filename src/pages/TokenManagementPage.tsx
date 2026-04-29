import React from 'react';

const TokenManagementPage: React.FC = () => (
  <div className="content">
    <div className="section-header">
      <div className="section-title">Token Management</div>
      <div className="section-line" />
    </div>
    <div className="three-col">
      <div className="stat-card green">
        <div className="stat-icon">🪙</div>
        <div className="stat-value">38k</div>
        <div className="stat-label">Available Tokens</div>
      </div>
      <div className="stat-card yellow">
        <div className="stat-icon">🔥</div>
        <div className="stat-value">62k</div>
        <div className="stat-label">Used This Month</div>
        <div className="stat-delta down">62% quota</div>
      </div>
      <div className="stat-card blue">
        <div className="stat-icon">📅</div>
        <div className="stat-value">100k</div>
        <div className="stat-label">Monthly Quota</div>
      </div>
    </div>
    <div className="warn-banner">
      ⚠️ You've used 62% of your monthly token quota. Consider upgrading your plan or reducing crawl depth.
    </div>
    <div className="two-col">
      <div className="card">
        <div className="card-header">
          <span style={{ color: 'var(--accent4)' }}>📊</span>
          <span className="card-title">Token Usage by Job</span>
        </div>
        <div className="card-body no-pad">
          <table>
            <thead>
              <tr>
                <th>Job</th><th>Date</th><th>Tokens Used</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="tc-title">login-regression-v2</td>
                <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>Apr 25</td>
                <td style={{ fontFamily: 'DM Mono, monospace' }}>9,100</td>
                <td><span className="status-chip done">Done</span></td>
              </tr>
              <tr>
                <td className="tc-title">checkout-flow-crawl</td>
                <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>Apr 25</td>
                <td style={{ fontFamily: 'DM Mono, monospace' }}>4,218</td>
                <td><span className="status-chip running">Running</span></td>
              </tr>
              <tr>
                <td className="tc-title">full-app-deep-crawl</td>
                <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>Apr 24</td>
                <td style={{ fontFamily: 'DM Mono, monospace' }}>24,600</td>
                <td><span className="status-chip done">Done</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <span style={{ color: 'var(--accent2)' }}>🛡</span>
          <span className="card-title">Quota Guard</span>
        </div>
        <div className="card-body">
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 14 }}>Set a hard limit to prevent unexpected overage.</div>
          <div className="input-group">
            <div className="input-label">Max tokens per crawl</div>
            <input className="input-field" type="number" defaultValue={15000} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, marginBottom: 14 }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
            Block crawl if estimate exceeds limit
          </label>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Save Guard Settings</button>
        </div>
      </div>
    </div>
  </div>
);

export default TokenManagementPage;
