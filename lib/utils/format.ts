export const formatINR = (v: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);

export const formatPct = (v: number) => `${v.toFixed(2)}%`;

export const formatNumber = (v: number) =>
  new Intl.NumberFormat('en-IN').format(v);

// NOTE: the sheet's `Value` column is denominated in crores (1 Cr = 10,000,000),
// so both helpers below expect a value already expressed in crore units.

export const formatINRCrores = (v: number) => `₹ ${v.toFixed(2)} Cr`;

// Compact crore-denominated formatting: crores → lakh → plain rupees
export const formatCompactINR = (v: number) => {
  if (Math.abs(v) >= 1) return `₹ ${Math.round(v).toLocaleString('en-IN')} Cr`;
  if (Math.abs(v) >= 0.01) return `₹ ${(v * 100).toFixed(0)} L`;
  return `₹ ${Math.round(v * 1e7).toLocaleString('en-IN')}`;
};
