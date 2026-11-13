/**
 * Formats a number or numeric string as Indian Rupees (₹) using Indian numbering system.
 * e.g., 8500 -> "₹8,500", 25500.5 -> "₹25,500.50"
 */
export function formatINR(amount, includeDecimals = false) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(num);
}

export function formatINRWithDecimals(amount) {
  return formatINR(amount, true);
}
