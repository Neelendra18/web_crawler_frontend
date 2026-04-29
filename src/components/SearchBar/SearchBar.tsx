import React from 'react';

const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => (
  <div className="search-bar">
    <span>🔍</span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Search...'} />
  </div>
);

export default SearchBar;
