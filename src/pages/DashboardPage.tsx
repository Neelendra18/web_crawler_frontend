import React from 'react';
import useDashboardData from '@hooks/useDashboardData';

const DashboardPage: React.FC = () => {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="content">
        <div className="section-header">
          <div className="section-title">Dashboard</div>
          <div className="section-line" />
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="section-header">
        <div className="section-title">Dashboard</div>
        <div className="section-line" />
      </div>
      <div className="stats-grid">
        {/* Stat cards */}
        <div className="stat-card green">
          <div className="stat-icon">🕷</div>
          <div className="stat-value">{stats.totalCrawls}</div>
          <div className="stat-label">Total Crawls</div>
          <div className="stat-delta up">↑ {Math.max(0, stats.totalCrawls - 10)}%</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🧪</div>
          <div className="stat-value">{stats.testCasesGenerated.toLocaleString()}</div>
          <div className="stat-label">Test Cases Generated</div>
          <div className="stat-delta up">
            ↑ {Math.min(100, Math.max(0, stats.testCasesGenerated / 10))}%
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🚀</div>
          <div className="stat-value">{stats.cicdExecutions}</div>
          <div className="stat-label">CI/CD Executions</div>
          <div className="stat-delta up">↑ {Math.max(0, stats.cicdExecutions - 5)}%</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{stats.failedRuns}</div>
          <div className="stat-label">Failed Runs</div>
          <div className="stat-delta down">↑ {stats.failedRuns}</div>
        </div>
      </div>

      <div className="two-col">
        {/* Active Crawl Jobs */}
        <div className="card">
          <div className="card-header">
            <span style={{ color: 'var(--accent)' }}>⚡</span>
            <span className="card-title">Active Crawl Jobs</span>
            <span
              style={{
                marginLeft: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              <span className="live-dot"></span> LIVE
            </span>
            <a
              className="btn btn-ghost card-action"
              style={{ fontSize: 12, padding: '5px 10px' }}
              href="/live-jobs"
            >
              View all →
            </a>
          </div>
          <div className="card-body no-pad">
            {stats.activeCrawlJobs.length > 0 ? (
              stats.activeCrawlJobs.map(job => (
                <div key={job.jobId} className="crawl-job">
                  <div className={`job-icon ${job.status}`}>
                    {job.status === 'running' ? '🌐' : '📄'}
                  </div>
                  <div className="job-info">
                    <div className="job-name">{job.jobName}</div>
                    <div className="job-url">{job.baseUrl}</div>
                  </div>
                  <div className="job-progress">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${job.status}`}
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-label">
                      {job.progress}% · {job.startTime}
                    </div>
                  </div>
                  <div className={`status-chip ${job.status}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active crawls. Start a new crawl to begin!
              </div>
            )}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Recent crawls</span>
                <span
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'var(--accent)',
                  }}
                >
                  {stats.testRunStats.passRate}%
                  <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 400 }}>
                    {' '}
                    pass
                  </span>
                </span>
              </div>
              <div className="mini-chart" style={{ marginBottom: 12 }}>
                <div
                  className="bar-col"
                  style={{ height: '60%', background: 'var(--accent)', opacity: 0.5 }}
                ></div>
                <div
                  className="bar-col"
                  style={{ height: '80%', background: 'var(--accent)', opacity: 0.6 }}
                ></div>
                <div
                  className="bar-col"
                  style={{ height: '55%', background: 'var(--accent)', opacity: 0.5 }}
                ></div>
                <div
                  className="bar-col"
                  style={{ height: '90%', background: 'var(--accent)', opacity: 0.7 }}
                ></div>
                <div
                  className="bar-col"
                  style={{ height: '70%', background: 'var(--accent3)', opacity: 0.8 }}
                ></div>
                <div
                  className="bar-col"
                  style={{ height: '100%', background: 'var(--accent)', opacity: 0.9 }}
                ></div>
                <div
                  className="bar-col"
                  style={{ height: '85%', background: 'var(--accent2)' }}
                ></div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Passed</div>
                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {stats.testRunStats.passed}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Failed</div>
                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--accent3)',
                    }}
                  >
                    {stats.testRunStats.failed}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Skipped</div>
                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {stats.testRunStats.skipped}
                  </div>
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
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div
                      className="act-dot"
                      style={{
                        background:
                          activity.status === 'completed'
                            ? 'var(--accent)'
                            : activity.status === 'failed'
                              ? 'var(--accent3)'
                              : 'var(--accent2)',
                      }}
                    ></div>
                    <div>
                      <div className="act-text">{activity.description}</div>
                      <div className="act-time">{activity.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
