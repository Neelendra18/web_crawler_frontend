import React, { useState } from 'react';

const steps = [
  { label: 'Crawl', icon: '🔗' },
  { label: 'Parse', icon: '🧩' },
  { label: 'Generate', icon: '⚙️' },
  { label: 'Test', icon: '🧪' },
  { label: 'Report', icon: '📊' },
];

const CenterPipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);
  return (
    <main className="main">
      <div className="content">
        {/* Pipeline Steps */}
        <div className="section-header" style={{marginBottom: 18}}>
          <div className="section-title">Pipeline</div>
          <div className="section-line" />
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 32, justifyContent: 'center'}}>
          {steps.map((step, i) => (
            <div key={step.label} style={{textAlign: 'center'}}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: i <= activeStep ? 'linear-gradient(135deg, #00e5a0, #5b6ef5)' : '#161820',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, margin: '0 auto', boxShadow: i === activeStep ? '0 0 12px #00e5a0' : undefined
              }}>{step.icon}</div>
              <div style={{fontSize: 12, color: i <= activeStep ? '#00e5a0' : '#8b8fa8', marginTop: 6}}>{step.label}</div>
            </div>
          ))}
        </div>
        {/* Batch Progress */}
        <div className="card" style={{marginBottom: 24}}>
          <div className="card-header">
            <div className="card-title">Batch Progress</div>
          </div>
          <div className="card-body">
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{flex: 1}}>
                <div style={{fontSize: 13, fontWeight: 500, marginBottom: 6}}>Current Batch</div>
                <div className="progress-bar" style={{width: '100%', marginBottom: 6}}>
                  <div className="progress-fill running" style={{width: '62%'}} />
                </div>
                <div className="progress-label">62% complete</div>
              </div>
              <div className="status-chip running">Running</div>
            </div>
          </div>
        </div>
        {/* Test Preview */}
        <div className="card" style={{marginBottom: 24}}>
          <div className="card-header">
            <div className="card-title">Test Preview</div>
          </div>
          <div className="card-body">
            <div className="code-preview" style={{maxHeight: 120}}>
{`describe('Homepage', () => {\n  it('should load', () => {\n    cy.visit('/')\n    cy.contains('Welcome')\n  })\n})`}
            </div>
          </div>
        </div>
        {/* Download / Git Push Buttons */}
        <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
          <button className="btn btn-ghost">Download</button>
          <button className="btn btn-primary">Push to Git</button>
        </div>
      </div>
    </main>
  );
};

export default CenterPipeline;
