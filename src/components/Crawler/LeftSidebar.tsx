import React, { useState } from 'react';
import Modal from '../Modal/Modal';

const LeftSidebar: React.FC = () => {
  const [url, setUrl] = useState('');
  const [auth, setAuth] = useState('none');
  const [framework, setFramework] = useState('playwright');
  const [status, setStatus] = useState<'idle'|'running'|'done'>('idle');

  return (
    <aside className="sidebar left-sidebar">
      <div className="content" style={{padding: 0}}>
        <div className="section-header" style={{marginBottom: 18}}>
          <div className="section-title">Crawl Setup</div>
          <div className="section-line" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="site-url">Website URL</label>
          <input
            className="input-field"
            id="site-url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={e => {
                const v = e.target.value.trim().replace(/\s/g, '');
              if (v.length > 2048) return;
              if (v && !/^https?:\/\//.test(v)) return;
              setUrl(v);
            }}
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="auth-method">Auth Method</label>
          <select
            id="auth-method"
            className="input-field"
            value={auth}
            onChange={e => {
              const allowed = ['none', 'basic', 'token'];
              if (allowed.includes(e.target.value)) setAuth(e.target.value);
            }}
          >
            <option value="none">None</option>
            <option value="basic">Basic Auth</option>
            <option value="token">Token</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="framework">Framework</label>
          <select
            id="framework"
            className="input-field"
            value={framework}
            onChange={e => {
              const allowed = ['playwright', 'cypress', 'selenium'];
              if (allowed.includes(e.target.value)) setFramework(e.target.value);
            }}
          >
            <option value="playwright">Playwright</option>
            <option value="cypress">Cypress</option>
            <option value="selenium">Selenium</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          style={{width: '100%', marginTop: 18}}
          onClick={() => setStatus('running')}
        >
          Start Crawl
        </button>
        <Modal
          open={status === 'running'}
          onClose={() => setStatus('idle')}
          title="Crawl In Progress"
          actions={<button className="btn" onClick={() => setStatus('idle')}>Close</button>}
        >
          <div style={{textAlign: 'center', padding: 16}}>
            <div className="status-chip running" style={{marginBottom: 12}}>Running</div>
            <div>Live crawl status and progress will appear here.</div>
          </div>
        </Modal>
        <div style={{marginTop: 24, textAlign: 'center'}}>
          {status === 'idle' && <span className="status-chip queued">Idle</span>}
          {/* Only show 'Running' chip if modal is not open */}
          {status === 'running' ? null : null}
          {status === 'done' && <span className="status-chip done">Done</span>}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
