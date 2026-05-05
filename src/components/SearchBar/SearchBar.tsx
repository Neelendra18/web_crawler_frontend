import React from 'react';

const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.trim().replace(/[\x00-\x1F\x7F]/g, '');
    if (v.length > 128) v = v.slice(0, 128);
    onChange(v);
  };
  return (
    <div className="search-bar">
      <span>🔍</span>
      <input value={value} onChange={handleChange} placeholder={placeholder || 'Search...'} />
    </div>
  );
};

export default SearchBar;
