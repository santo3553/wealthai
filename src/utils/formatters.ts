export function formatCurrency(value: number, compact = false): string {
  if (isNaN(value)) return '$0';

  if (compact && Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export function formatHours(hours: number): string {
  if (isNaN(hours)) return '0 hrs';
  return `${formatNumber(hours)} hrs`;
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
}
