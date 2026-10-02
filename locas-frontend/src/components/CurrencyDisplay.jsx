import React from 'react';

export const formatIndianCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  const val = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const CurrencyDisplay = ({ amount, bold = true, size = 16, color }) => {
  let displayColor = color;
  if (!displayColor || displayColor === '#172033' || displayColor === '#052E2B' || displayColor === '#0F172A' || displayColor === '#1E293B') {
    displayColor = 'inherit';
  }

  return (
    <span
      className="currency-bold"
      style={{
        fontSize: size,
        fontWeight: bold ? 700 : 500,
        color: displayColor,
      }}
    >
      {formatIndianCurrency(amount)}
    </span>
  );
};

export const PercentageDisplay = ({ value, suffix = '%' }) => {
  if (value === null || value === undefined) return '0%';
  return <span style={{ fontWeight: 600 }}>{Number(value).toFixed(2)}{suffix}</span>;
};

export default CurrencyDisplay;
