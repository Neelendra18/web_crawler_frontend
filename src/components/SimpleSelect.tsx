import React from 'react';

interface SimpleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({ value, onChange, options, className }) => (
  <select
    className={className}
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ padding: '8px 12px', borderRadius: 6, border: '1.5px solid #464feb', fontSize: 15 }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default SimpleSelect;
