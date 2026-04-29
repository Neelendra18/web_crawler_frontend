import React from 'react';

const Avatar: React.FC<{ initials: string; gradient?: string }> = ({ initials, gradient }) => (
  <div className="avatar" style={gradient ? { background: gradient } : {}}>{initials}</div>
);

export default Avatar;
