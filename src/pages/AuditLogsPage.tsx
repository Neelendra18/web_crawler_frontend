import React from 'react';

const AuditLogsPage: React.FC = () => (
  <div className="content">
    <div className="section-header">
      <div className="section-title">Audit Logs</div>
      <div className="section-line" />
    </div>
    <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
      <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
        <span>🔍</span>
        <input placeholder="Search logs…" />
      </div>
      <select style={{ fontSize: 13 }}><option>All users</option><option>arjun@acme.com</option><option>meera@acme.com</option></select>
      <select style={{ fontSize: 13 }}><option>All actions</option><option>Crawl</option><option>Login</option><option>Export</option></select>
      <select style={{ fontSize: 13 }}><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select>
    </div>
    <div className="card">
      <div className="card-body no-pad">
        <div className="log-row" style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', width: 140 }}>TIMESTAMP</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', width: 100 }}>USER</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>ACTION</div>
        </div>
        {/* Example log entries */}
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent)' }}></div><div className="log-time">Apr 25 · 14:32:01</div><div className="log-user">arjun</div><div className="log-action">Started crawl <strong>checkout-flow-crawl</strong> → https://shop.acme.com/checkout</div></div>
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent2)' }}></div><div className="log-time">Apr 25 · 14:15:44</div><div className="log-user">meera</div><div className="log-action">Downloaded Playwright scripts for <strong>login-regression-v2</strong></div></div>
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent3)' }}></div><div className="log-time">Apr 25 · 12:45:18</div><div className="log-user">system</div><div className="log-action">CI/CD run <strong>#RUN-096</strong> failed — 3 assertions failed in dashboard-smoke</div></div>
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent4)' }}></div><div className="log-time">Apr 25 · 10:22:03</div><div className="log-user">arjun</div><div className="log-action">Updated role for <strong>priya@acme.com</strong> from Developer → Viewer</div></div>
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent)' }}></div><div className="log-time">Apr 25 · 09:00:00</div><div className="log-user">meera</div><div className="log-action">Logged in via OAuth (Google) from 103.21.42.x</div></div>
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent2)' }}></div><div className="log-time">Apr 24 · 18:00:30</div><div className="log-user">rahul</div><div className="log-action">Triggered CI/CD run <strong>#RUN-095</strong> · checkout-e2e · Selenium/Java</div></div>
        <div className="log-row"><div className="log-dot" style={{ background: 'var(--accent)' }}></div><div className="log-time">Apr 24 · 16:41:55</div><div className="log-user">arjun</div><div className="log-action">Created new crawl <strong>full-app-deep-crawl</strong> (depth 3, 24,600 tokens)</div></div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
      <span>Showing 7 of 1,248 log entries</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>← Prev</button>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>Next →</button>
      </div>
    </div>
  </div>
);

export default AuditLogsPage;
