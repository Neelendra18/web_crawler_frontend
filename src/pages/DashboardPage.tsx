import React from 'react';

const DashboardPage: React.FC = () => (
  <div className="content">
    <div className="section-header">
      <div className="section-title">Dashboard</div>
      <div className="section-line" />
    </div>
    <div className="stats-grid">
      {/* Stat cards */}
      <div className="stat-card green">
        <div className="stat-icon">🕷</div>
        <div className="stat-value">128</div>
        <div className="stat-label">Total Crawls</div>
        <div className="stat-delta up">↑ 14%</div>
      </div>
      <div className="stat-card blue">
        <div className="stat-icon">🧪</div>
        <div className="stat-value">4,392</div>
        <div className="stat-label">Test Cases Generated</div>
        <div className="stat-delta up">↑ 32%</div>
      </div>
      <div className="stat-card yellow">
        <div className="stat-icon">🚀</div>
        <div className="stat-value">97</div>
        <div className="stat-label">CI/CD Executions</div>
        <div className="stat-delta up">↑ 8%</div>
      </div>
      <div className="stat-card red">
        <div className="stat-icon">⚠️</div>
        <div className="stat-value">5</div>
        <div className="stat-label">Failed Runs</div>
        <div className="stat-delta down">↑ 2</div>
      </div>
    </div>

    <div className="two-col">
      {/* Active Crawl Jobs */}
      <div className="card">
        <div className="card-header">
          <span style={{ color: 'var(--accent)' }}>⚡</span>
          <span className="card-title">Active Crawl Jobs</span>
          <span style={{ marginLeft: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span className="live-dot"></span> LIVE
          </span>
          <a className="btn btn-ghost card-action" style={{ fontSize: 12, padding: '5px 10px' }} href="/live-jobs">View all →</a>
        </div>
        <div className="card-body no-pad">
          {/* Example jobs */}
          <div className="crawl-job">
            <div className="job-icon running">🌐</div>
            <div className="job-info">
              <div className="job-name">checkout-flow-crawl</div>
              <div className="job-url">https://shop.acme.com/checkout</div>
            </div>
            <div className="job-progress">
              <div className="progress-bar"><div className="progress-fill running" style={{ width: '73%' }}></div></div>
              <div className="progress-label">73% · 4.2k tokens</div>
            </div>
            <div className="status-chip running">Running</div>
          </div>
          <div className="crawl-job">
            <div className="job-icon running">📄</div>
            <div className="job-info">
              <div className="job-name">api-docs-upload</div>
              <div className="job-url">swagger-openapi-v3.pdf</div>
            </div>
            <div className="job-progress">
              <div className="progress-bar"><div className="progress-fill running" style={{ width: '41%' }}></div></div>
              <div className="progress-label">41% · 1.8k tokens</div>
            </div>
            <div className="status-chip running">Running</div>
          </div>
          <div className="crawl-job">
            <div className="job-icon done">🌐</div>
            <div className="job-info">
              <div className="job-name">login-regression-v2</div>
              <div className="job-url">https://app.acme.com/login</div>
            </div>
            <div className="job-progress">
              <div className="progress-bar"><div className="progress-fill done" style={{ width: '100%' }}></div></div>
              <div className="progress-label">Done · 9.1k tokens</div>
            </div>
            <div className="status-chip done">Completed</div>
          </div>
          <div className="crawl-job">
            <div className="job-icon failed">⚠️</div>
            <div className="job-info">
              <div className="job-name">dashboard-smoke</div>
              <div className="job-url">https://app.acme.com/dashboard</div>
            </div>
            <div className="job-progress">
              <div className="progress-bar"><div className="progress-fill failed" style={{ width: '28%' }}></div></div>
              <div className="progress-label">Failed at 28%</div>
            </div>
            <div className="status-chip failed">Failed</div>
          </div>
        </div>
      </div>

      {/* Test Run Stats & Recent Activity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <span style={{ color: 'var(--accent2)' }}>📊</span>
            <span className="card-title">Test Run Stats</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 7 days</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>94.2%<span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 400 }}> pass</span></span>
            </div>
            <div className="mini-chart" style={{ marginBottom: 12 }}>
              <div className="bar-col" style={{ height: '60%', background: 'var(--accent)', opacity: 0.5 }}></div>
              <div className="bar-col" style={{ height: '80%', background: 'var(--accent)', opacity: 0.6 }}></div>
              <div className="bar-col" style={{ height: '55%', background: 'var(--accent)', opacity: 0.5 }}></div>
              <div className="bar-col" style={{ height: '90%', background: 'var(--accent)', opacity: 0.7 }}></div>
              <div className="bar-col" style={{ height: '70%', background: 'var(--accent3)', opacity: 0.8 }}></div>
              <div className="bar-col" style={{ height: '100%', background: 'var(--accent)', opacity: 0.9 }}></div>
              <div className="bar-col" style={{ height: '85%', background: 'var(--accent2)' }}></div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Passed</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>91</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Failed</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--accent3)' }}>5</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Skipped</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-muted)' }}>1</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span style={{ color: 'var(--accent4)' }}>📡</span>
            <span className="card-title">Recent Activity</span>
          </div>
          <div className="card-body">
            <div className="activity-item">
              <div className="act-dot" style={{ background: 'var(--accent)' }}></div>
              <div>
                <div className="act-text"><strong>login-regression-v2</strong> completed — 312 test cases</div>
                <div className="act-time">2 min ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="act-dot" style={{ background: 'var(--accent2)' }}></div>
              <div>
                <div className="act-text">Playwright script downloaded by <strong>meera@acme.com</strong></div>
                <div className="act-time">18 min ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="act-dot" style={{ background: 'var(--accent3)' }}></div>
              <div>
                <div className="act-text"><strong>dashboard-smoke</strong> failed at 28% — timeout error</div>
                <div className="act-time">1 hr ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPage;
