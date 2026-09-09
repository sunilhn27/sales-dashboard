export const formatINR = (v: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);

export const formatPct = (v: number) => `${v.toFixed(2)}%`;

export const formatNumber = (v: number) =>
  new Intl.NumberFormat('en-IN').format(v);
