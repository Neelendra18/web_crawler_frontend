

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LiveJobsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="topbar">
        <span className="page-title">
          Live Jobs
          <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
            <span className="live-dot" /> Polling every 3s
          </span>
        </span>
        <div className="topbar-right">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>← Dashboard</button>
          <button className="btn btn-primary" onClick={() => navigate('/new-crawl')}>＋ New Crawl</button>
        </div>
      </div>
      <div className="content">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <span style={{ color: 'var(--accent)' }}>⚡</span>
            <span className="card-title">All Crawl Jobs</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <select style={{ fontSize: 12, padding: '6px 28px 6px 10px' }}>
                <option>All status</option>
                <option>Running</option>
                <option>Completed</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
          <div className="card-body no-pad">
            {/* Example jobs */}
            <div className="crawl-job">
              <div className="job-icon running">🌐</div>
              <div className="job-info">
                <div className="job-name">checkout-flow-crawl</div>
                <div className="job-url">https://shop.acme.com/checkout · depth:2 · user-flow mode</div>
              </div>
              <div className="job-progress">
                <div className="progress-bar"><div className="progress-fill running" style={{ width: '73%' }}></div></div>
                <div className="progress-label">73% · 4.2k tokens</div>
              </div>
              <div className="status-chip running">Running</div>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px', marginLeft: 4 }}>Pause</button>
            </div>
            <div className="crawl-job">
              <div className="job-icon running">📄</div>
              <div className="job-info">
                <div className="job-name">api-docs-upload</div>
                <div className="job-url">swagger-openapi-v3.pdf · document parse</div>
              </div>
              <div className="job-progress">
                <div className="progress-bar"><div className="progress-fill running" style={{ width: '41%' }}></div></div>
                <div className="progress-label">41% · 1.8k tokens</div>
              </div>
              <div className="status-chip running">Running</div>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px', marginLeft: 4 }}>Pause</button>
            </div>
            <div className="crawl-job">
              <div className="job-icon done">🌐</div>
              <div className="job-info">
                <div className="job-name">login-regression-v2</div>
                <div className="job-url">https://app.acme.com/login · depth:1 · full-page</div>
              </div>
              <div className="job-progress">
                <div className="progress-bar"><div className="progress-fill done" style={{ width: '100%' }}></div></div>
                <div className="progress-label">Done · 9.1k tokens · 3m 22s</div>
              </div>
              <div className="status-chip done">Completed</div>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px', marginLeft: 4 }}>View →</button>
            </div>
            <div className="crawl-job">
              <div className="job-icon failed">⚠️</div>
              <div className="job-info">
                <div className="job-name">dashboard-smoke</div>
                <div className="job-url">https://app.acme.com/dashboard · timeout at step 7</div>
              </div>
              <div className="job-progress">
                <div className="progress-bar"><div className="progress-fill failed" style={{ width: '28%' }}></div></div>
                <div className="progress-label">Failed at 28% · ERR_TIMEOUT</div>
              </div>
              <div className="status-chip failed">Failed</div>
              <button className="btn btn-danger" style={{ fontSize: 12, padding: '5px 10px', marginLeft: 4 }}>Retry</button>
            </div>
            <div className="crawl-job">
              <div className="job-icon queued">⏳</div>
              <div className="job-info">
                <div className="job-name">payment-gateway-e2e</div>
                <div className="job-url">https://shop.acme.com/pay · queued behind 2 jobs</div>
              </div>
              <div className="job-progress">
                <div className="progress-bar"><div className="progress-fill" style={{ width: '0%', background: 'var(--surface3)' }}></div></div>
                <div className="progress-label">Waiting…</div>
              </div>
              <div className="status-chip queued">Queued</div>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px', marginLeft: 4 }}>Cancel</button>
            </div>
          </div>
        </div>
        {/* Status log */}
        <div className="card">
          <div className="card-header">
            <span style={{ color: 'var(--accent2)' }}>📜</span>
            <span className="card-title">Activity Log — checkout-flow-crawl</span>
          </div>
          <div className="card-body" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, lineHeight: 1.8, color: 'var(--text-dim)' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>[14:32:01]</span> <span style={{ color: 'var(--accent)' }}>INFO</span> Crawl started for https://shop.acme.com/checkout</div>
            <div><span style={{ color: 'var(--text-muted)' }}>[14:32:04]</span> <span style={{ color: 'var(--accent)' }}>INFO</span> Discovered 14 interactive elements on page</div>
            <div><span style={{ color: 'var(--text-muted)' }}>[14:32:08]</span> <span style={{ color: 'var(--accent)' }}>INFO</span> Generating test cases for checkout form validation</div>
            <div><span style={{ color: 'var(--text-muted)' }}>[14:32:15]</span> <span style={{ color: 'var(--accent2)' }}>STEP</span> Navigated to /checkout/review — 8 elements found</div>
            <div><span style={{ color: 'var(--text-muted)' }}>[14:32:22]</span> <span style={{ color: 'var(--accent2)' }}>STEP</span> Navigated to /checkout/payment — 12 elements found</div>
            <div><span style={{ color: 'var(--text-muted)' }}>[14:32:30]</span> <span style={{ color: 'var(--accent)' }}>INFO</span> 73% complete · 4,218 tokens consumed</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveJobsPage;
