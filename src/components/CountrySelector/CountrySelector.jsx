import React from 'react';
import CountryList from 'react-select-country-list';
import { Globe } from 'lucide-react';
import './CountrySelector.css';

const CountrySelector = ({ 
  value,
  onChange,
  showLabel = true,
  className = '',
  placeholder = 'Selecciona tu país destino',
  disabled = false,
  error = false 
}) => {
  const countries = CountryList().getData();

  return (
    <div className={`country-selector ${className}`}>
      {showLabel && (
        <label htmlFor="country" className="form-label">
          <Globe className="label-icon" color="#2563eb" />
          País Destino
        </label>
      )}
      <select
        id="country"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? 'error' : ''}`}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {countries.map(country => (
          <option key={country.value} value={country.label}>
            {country.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;