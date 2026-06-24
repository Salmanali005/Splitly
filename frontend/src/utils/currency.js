export const formatCurrency = (amount, currency = 'USD') => {
  const num = parseFloat(amount || 0);
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k ${currency}`;
  return `${num.toFixed(2)} ${currency}`;
};