
import React from 'react';

const NewCrawlPage: React.FC = () => {
  // For demo, hardcode values as in the HTML
  const url = 'https://shop.acme.com/checkout';
  return (
    <div className="content">
      <div className="section-header">
        <div className="section-title">New Crawl</div>
        <div className="section-line" />
      </div>
      <div className="two-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent)' }}>🔗</span>
              <span className="card-title">Crawl Configuration</span>
            </div>
            <div className="card-body">
              <div className="input-group">
                <div className="input-label">Target URL</div>
                <input className="input-field" type="url" placeholder="https://yourapp.com/feature" defaultValue={url} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <div className="input-label">Crawl Depth</div>
                  <select className="input-field" defaultValue="2">
                    <option>1 — Shallow</option>
                    <option>2 — Standard</option>
                    <option>3 — Deep</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <div className="input-label">Mode</div>
                  <select className="input-field" defaultValue="User Flow">
                    <option>Full Page</option>
                    <option>User Flow</option>
                    <option>API Only</option>
                  </select>
                </div>
              </div>
              <div className="input-label" style={{ marginBottom: 8 }}>Upload Documents (optional)</div>
              <div className="drop-zone">
                <div className="drop-zone-icon">☁️</div>
                <div className="drop-zone-text">Drag & drop files or <strong>browse</strong></div>
                <div className="drop-zone-sub">PDF · XLSX · DOCX · PNG · JPG</div>
                <div className="format-pills">
                  <span className="pill">PDF</span><span className="pill">Excel</span>
                  <span className="pill">Word</span><span className="pill">Images</span>
                </div>
              </div>
              <div style={{ marginTop: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>swagger-openapi-v3.pdf</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>2.4 MB · uploading…</div>
                  <div className="progress-bar" style={{ marginTop: 6 }}><div className="progress-fill running" style={{ width: '64%' }}></div></div>
                </div>
                <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent4)' }}>⚙️</span>
              <span className="card-title">Advanced Options</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
                  Include authentication flows
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
                  Generate negative test cases
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
                  Screenshot each step
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Token + Confirm + Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent2)' }}>🪙</span>
              <span className="card-title">Token Estimation</span>
            </div>
            <div className="card-body">
              <div className="token-widget">
                <div className="token-row">
                  <div>
                    <div className="token-label">Estimated Usage</div>
                    <div className="token-val">~12,400</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="token-label">Available</div>
                    <div className="token-val" style={{ color: 'var(--accent)' }}>38,000</div>
                  </div>
                </div>
                <div className="token-bar"><div className="token-fill ok" style={{ width: '32%' }}></div></div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'DM Mono, monospace' }}>32% of monthly quota</div>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: 12, fontSize: 13, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-dim)' }}>URL crawl</span>
                  <span style={{ fontFamily: 'DM Mono, monospace' }}>~8,200</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-dim)' }}>Document parsing</span>
                  <span style={{ fontFamily: 'DM Mono, monospace' }}>~3,600</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 6 }}>
                  <span style={{ fontWeight: 600 }}>Total estimate</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>~12,400</span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 12 }}
                // TODO: Implement crawl logic here
              >
                🚀 Start Crawl
              </button>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>A confirmation dialog will appear</div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent)' }}>💡</span>
              <span className="card-title">Tips</span>
            </div>
            <div className="card-body" style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>
              <div style={{ marginBottom: 8 }}>🔗 Provide a specific page URL for targeted test generation</div>
              <div style={{ marginBottom: 8 }}>📄 Attach Swagger/OpenAPI docs for API test cases</div>
              <div>⚡ Shallow crawl uses ~40% fewer tokens</div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal removed: No confirmation needed for Crawl */}
    </div>
  );
};

export default NewCrawlPage;
