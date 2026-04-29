import React from 'react';

const metrics = [
  { label: 'Pages Crawled', value: 128, icon: '🌐', color: 'green' },
  { label: 'Test Cases', value: 42, icon: '🧪', color: 'blue' },
  { label: 'Files Generated', value: 17, icon: '📄', color: 'yellow' },
];

const activity = [
  { text: 'Crawled homepage', time: '2m ago', dot: '#00e5a0' },
  { text: 'Generated 5 test cases', time: '5m ago', dot: '#5b6ef5' },
  { text: 'Pushed to Git', time: '10m ago', dot: '#f5a623' },
];

const RightSidebar: React.FC = () => {
  return (
    <aside className="sidebar right-sidebar" style={{background: '#0f1118', borderLeft: '1px solid rgba(255,255,255,0.07)'}}>
      <div className="content" style={{padding: 0}}>
        <div className="section-header" style={{marginBottom: 18}}>
          <div className="section-title">Metrics</div>
          <div className="section-line" />
        </div>
        <div className="stats-grid" style={{gridTemplateColumns: '1fr', gap: 14, marginBottom: 28}}>
          {metrics.map(m => (
            <div className={`stat-card ${m.color}`} key={m.label}>
              <div className="stat-icon">{m.icon}</div>
              <div className="stat-value">{m.value}</div>
              <div className="stat-label">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="section-header" style={{marginBottom: 12}}>
          <div className="section-title">Activity Log</div>
          <div className="section-line" />
        </div>
        <div>
          {activity.map((a, i) => (
            <div className="activity-item" key={i}>
              <span className="act-dot" style={{background: a.dot}} />
              <div className="act-text"><strong>{a.text}</strong></div>
              <div className="act-time" style={{marginLeft: 'auto'}}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
