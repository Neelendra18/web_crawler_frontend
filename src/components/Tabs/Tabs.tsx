import React from 'react';

const Tabs: React.FC<{ tabs: string[]; active: string; onTab: (tab: string) => void }> = ({ tabs, active, onTab }) => (
  <div className="tabs">
    {tabs.map(tab => (
      <div key={tab} className={`tab${tab === active ? ' active' : ''}`} onClick={() => onTab(tab)}>{tab}</div>
    ))}
  </div>
);

export default Tabs;
