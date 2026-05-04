import React, { useState, useRef } from 'react';

const defaultCrawl = {
  name: '',
  url: '',
  depth: '2',
  mode: 'User Flow',
  date: '',
};

const CrawlPage: React.FC = () => {
  const [tab, setTabState] = useState<'new' | 'history'>('new');
  const [editingCrawl, setEditingCrawl] = useState<any | null>(null);
  const [form, setForm] = useState<any>(defaultCrawl);

  // Helper to switch tabs and clear editing state if going to New
  const setTab = (tab: 'new' | 'history') => {
    if (tab === 'new') {
      setEditingCrawl(null);
      setForm(defaultCrawl);
    }
    setTabState(tab);
  };
  const urlInputRef = useRef<HTMLInputElement>(null);
  // Demo crawl history
  const crawlHistory = [
    { name: 'Checkout Flow', url: 'https://shop.acme.com/checkout', date: '2026-05-01' },
    { name: 'Product Page', url: 'https://shop.acme.com/product', date: '2026-04-30' },
    { name: 'Login Test', url: 'https://shop.acme.com/login', date: '2026-04-29' },
  ];

  // When a crawl is selected from history, load it for editing
  const handleEditCrawl = (crawl: any) => {
    setEditingCrawl(crawl);
    setForm(crawl);
    setTab('new');
    setTimeout(() => {
      urlInputRef.current?.focus();
    }, 0);
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="content">
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div className="section-title">Crawl</div>
          <div className="tab-bar" style={{ display: 'flex', gap: 8, marginLeft: 24 }}>
            <button
              className={tab === 'new' ? 'tab active' : 'tab'}
              onClick={() => setTab('new')}
              style={{
                background: tab === 'new' ? 'rgb(70, 79, 235)' : 'rgb(255, 255, 255)',
                color: tab === 'new' ? 'rgb(255, 255, 255)' : 'rgb(70, 79, 235)',
                border: '1.5px solid rgb(70, 79, 235)',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 15,
                padding: '8px 28px',
                cursor: 'pointer',
                boxShadow: tab === 'new' ? '0 2px 8px 0 rgba(70,79,235,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              New
            </button>
            <button
              className={tab === 'history' ? 'tab active' : 'tab'}
              onClick={() => setTab('history')}
              style={{
                background: tab === 'history' ? 'rgb(70, 79, 235)' : 'rgb(255, 255, 255)',
                color: tab === 'history' ? 'rgb(255, 255, 255)' : 'rgb(70, 79, 235)',
                border: '1.5px solid rgb(70, 79, 235)',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 15,
                padding: '8px 28px',
                cursor: 'pointer',
                boxShadow: tab === 'history' ? '0 2px 8px 0 rgba(70,79,235,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              History
            </button>
          </div>
        </div>
        {tab === 'new' && (
          <button
            className="btn btn-primary"
            style={{
              minWidth: 160,
              marginLeft: 24,
              background: 'rgb(70, 79, 235)',
              color: 'rgb(255, 255, 255)',
              border: '1.5px solid rgb(70, 79, 235)',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 15,
              padding: '8px 28px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(70,79,235,0.08)',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🚀 Start Crawl
          </button>
        )}
      </div>
      {tab === 'new' && (
        <div className="two-col">
          {/* Left: Crawl Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <span style={{ color: 'var(--accent)' }}>🔗</span>
                <span className="card-title">Crawl Configuration {editingCrawl ? <span style={{ color: 'var(--accent4)', fontWeight: 400, fontSize: 13 }}> (Editing: {editingCrawl.name})</span> : null}</span>
              </div>
              <div className="card-body">
                <div className="input-group">
                  <div className="input-label">Target URL</div>
                  <input
                    className="input-field"
                    type="url"
                    name="url"
                    placeholder="https://yourapp.com/feature"
                    value={form.url}
                    onChange={handleFormChange}
                    ref={urlInputRef}
                  />
                </div>
                {/* ...existing code for other fields... */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <div className="input-label">Crawl Depth</div>
                    <select className="input-field" name="depth" value={form.depth} onChange={handleFormChange}>
                      <option value="1">1 — Shallow</option>
                      <option value="2">2 — Standard</option>
                      <option value="3">3 — Deep</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <div className="input-label">Mode</div>
                    <select className="input-field" name="mode" value={form.mode} onChange={handleFormChange}>
                      <option value="Full Page">Full Page</option>
                      <option value="User Flow">User Flow</option>
                      <option value="API Only">API Only</option>
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
                <div className="file-info-row">
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
          </div>
          {/* Right: Advanced Options and Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <div className="card">
              <div className="card-header">
                <span style={{ color: 'var(--accent)' }}>💡</span>
                <span className="card-title">Tips</span>
              </div>
              <div className="card-body" style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>
                <div style={{ marginBottom: 8 }}>🔗 Provide a specific page URL for targeted test generation</div>
                <div style={{ marginBottom: 8 }}>📄 Attach Swagger/OpenAPI docs for API test cases</div>
                <div style={{ marginBottom: 8 }}>⚡ <strong>Shallow:</strong> Fastest, covers only top-level pages, lowest token usage.</div>
                <div style={{ marginBottom: 8 }}>⚡ <strong>Standard:</strong> Balanced speed and coverage, recommended for most cases.</div>
                <div>⚡ <strong>Deep:</strong> Thorough, covers all nested flows, highest token usage.</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === 'history' && (
        <div style={{ marginTop: 32 }}>
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent)' }}>🕑</span>
              <span className="card-title">Recent Crawls</span>
            </div>
            <div className="card-body">
              {crawlHistory.slice(0, 3).map((crawl, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                  onClick={() => handleEditCrawl(crawl)}
                >
                  <span style={{ fontWeight: 500 }}>{crawl.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{crawl.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrawlPage;
