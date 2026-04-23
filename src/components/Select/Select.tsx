import React from 'react'
import clsx from 'clsx'
import './Select.css'

interface Option {
  label: string
  value: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
  helperText?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className, ...props }, ref) => {
    return (
      <div className="select-wrapper">
        {label && <label className="select-label">{label}</label>}
        <select ref={ref} className={clsx('select-field', { 'select-error': error }, className)} {...props}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="select-error-text">{error}</span>}
        {helperText && <span className="select-helper-text">{helperText}</span>}
      </div>
    )
  },
)

Select.displayName = 'Select'
