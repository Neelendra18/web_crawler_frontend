import React from 'react';

const FilterChip: React.FC<{ active?: boolean; onClick?: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <div className={`filter-chip${active ? ' active' : ''}`} onClick={onClick}>{children}</div>
);

export default FilterChip;
