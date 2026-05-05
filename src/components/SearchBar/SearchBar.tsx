import React from 'react';

const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove ASCII control characters (0-31, 127)
    const cleaned = e.target.value.trim().replace(/[\u0000-\u001F\u007F]/g, '');
    const v = cleaned.length > 128 ? cleaned.slice(0, 128) : cleaned;
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
