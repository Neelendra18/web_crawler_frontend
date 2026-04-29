import React from 'react';

const ActivityItem: React.FC<{ dotColor: string; text: string; time: string }> = ({ dotColor, text, time }) => (
  <div className="activity-item">
    <div className="act-dot" style={{ background: dotColor }}></div>
    <div>
      <div className="act-text" dangerouslySetInnerHTML={{ __html: text }} />
      <div className="act-time">{time}</div>
    </div>
  </div>
);

export default ActivityItem;
