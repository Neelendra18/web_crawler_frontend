import React from 'react';

const Card: React.FC<{ header?: React.ReactNode; body?: React.ReactNode; noPad?: boolean; children?: React.ReactNode }> = ({ header, body, noPad, children }) => (
  <div className="card">
    {header && <div className="card-header">{header}</div>}
    <div className={`card-body${noPad ? ' no-pad' : ''}`}>{body || children}</div>
  </div>
);

export default Card;
