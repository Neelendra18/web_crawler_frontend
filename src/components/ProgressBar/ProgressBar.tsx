import React from 'react';

const ProgressBar: React.FC<{ percent: number; color?: string }> = ({ percent, color }) => (
  <div className="progress-bar">
    <div className={`progress-fill${color ? ' ' + color : ''}`} style={{ width: percent + '%' }}></div>
  </div>
);

export default ProgressBar;
