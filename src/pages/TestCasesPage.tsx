
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const TestCasesPage: React.FC = () => {

  // Toggle expand/collapse for each test case row
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const handleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const navigate = useNavigate();



  const handleGenerateScripts = () => {
    navigate('/scripts');
  };

  return (
    <div className="content">
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div className="section-title">Test Cases</div>
        <div className="section-line" />
        <div className="topbar-right" style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button className="btn btn-ghost">⬇ Export CSV</button>
          <button className="btn btn-primary" onClick={handleGenerateScripts}>Generate Scripts →</button>
        </div>
      </div>
      <div className="search-bar">
        <span>🔍</span>
        <input placeholder="Search test cases by title, ID, or description…" />
      </div>
      <div className="filter-row">
        <div className="filter-chip active">All (312)</div>
        <div className="filter-chip">Functional (140)</div>
        <div className="filter-chip">E2E (98)</div>
        <div className="filter-chip">Regression (56)</div>
        <div className="filter-chip">API (18)</div>
      </div>
      <div className="card">
        <div className="card-body no-pad">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Module</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* TC-001 */}
                <tr className="expand-row" style={{ cursor: 'pointer' }} onClick={() => handleExpand('TC-001')}>
                  <td><button className="expand-btn" tabIndex={-1} style={{ transform: expanded.has('TC-001') ? 'rotate(90deg)' : undefined }}>▶</button></td>
                  <td className="tc-id">TC-001</td>
                  <td className="tc-title">Verify checkout form validation with empty fields</td>
                  <td><span className="tc-type functional">Functional</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>Checkout</td>
                  <td><span className="tc-type e2e" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--accent3)' }}>High</span></td>
                  <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}>Copy</button></td>
                </tr>
                {expanded.has('TC-001') && (
                  <tr id="detail-row-1">
                    <td colSpan={7} style={{ padding: '16px 24px', background: 'var(--surface2)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Steps:</div>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8, fontFamily: 'DM Mono, monospace' }}>
                        1. Navigate to /checkout<br />
                        2. Leave all required fields empty<br />
                        3. Click "Place Order" button<br />
                        4. Expect: validation error shown for each required field<br />
                        5. Expect: form NOT submitted
                      </div>
                    </td>
                  </tr>
                )}
                {/* TC-002 */}
                <tr className="expand-row" style={{ cursor: 'pointer' }} onClick={() => handleExpand('TC-002')}>
                  <td><button className="expand-btn" tabIndex={-1} style={{ transform: expanded.has('TC-002') ? 'rotate(90deg)' : undefined }}>▶</button></td>
                  <td className="tc-id">TC-002</td>
                  <td className="tc-title">Complete checkout flow with valid card details</td>
                  <td><span className="tc-type e2e">E2E</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>Checkout</td>
                  <td><span className="tc-type e2e" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--accent3)' }}>High</span></td>
                  <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}>Copy</button></td>
                </tr>
                {expanded.has('TC-002') && (
                  <tr id="detail-row-2">
                    <td colSpan={7} style={{ padding: '16px 24px', background: 'var(--surface2)' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8, fontFamily: 'DM Mono, monospace' }}>1. Navigate to /checkout → 2. Fill billing info → 3. Enter valid card → 4. Submit → 5. Expect: order confirmation page</div>
                    </td>
                  </tr>
                )}
                <tr className="expand-row" style={{ cursor: 'pointer' }} onClick={() => handleExpand('TC-003')}>
                  <td><button className="expand-btn" tabIndex={-1} style={{ transform: expanded.has('TC-003') ? 'rotate(90deg)' : undefined }}>▶</button></td>
                  <td className="tc-id">TC-003</td>
                  <td className="tc-title">Validate promo code field rejects invalid codes</td>
                  <td><span className="tc-type regression">Regression</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>Checkout</td>
                  <td><span className="tc-type" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Medium</span></td>
                  <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}>Copy</button></td>
                </tr>
                {expanded.has('TC-003') && (
                  <tr id="detail-row-3">
                    <td colSpan={7} style={{ padding: '16px 24px', background: 'var(--surface2)' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace' }}>1. Enter INVALID_CODE → 2. Click Apply → 3. Expect: error toast "Invalid promo code"</div>
                    </td>
                  </tr>
                )}
                <tr className="expand-row" style={{ cursor: 'pointer' }} onClick={() => handleExpand('TC-004')}>
                  <td><button className="expand-btn" tabIndex={-1} style={{ transform: expanded.has('TC-004') ? 'rotate(90deg)' : undefined }}>▶</button></td>
                  <td className="tc-id">TC-004</td>
                  <td className="tc-title">POST /api/orders returns 201 with valid payload</td>
                  <td><span className="tc-type api">API</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>Orders API</td>
                  <td><span className="tc-type e2e" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--accent3)' }}>High</span></td>
                  <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}>Copy</button></td>
                </tr>
                {expanded.has('TC-004') && (
                  <tr id="detail-row-4">
                    <td colSpan={7} style={{ padding: '16px 24px', background: 'var(--surface2)' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace' }}>Method: POST /api/v1/orders → Header: Authorization Bearer &lt;token&gt; → Body: valid order JSON → Assert: status 201, body.id exists</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
        <span>Showing 1–4 of 312 results</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>← Prev</button>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px', background: 'rgba(0,229,160,0.08)', borderColor: 'rgba(0,229,160,0.2)', color: 'var(--accent)' }}>1</button>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>2</button>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>3</button>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>Next →</button>
        </div>
      </div>
    </div>
  );
};

export default TestCasesPage;
