import React from 'react';

const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove ASCII control characters (0-31, 127) without regex
    const raw = e.target.value.trim();
    let cleaned = '';
    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i);
      if ((code > 31 && code !== 127) || code === 32) cleaned += raw[i];
    }
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
