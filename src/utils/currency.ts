/**
 * Currency Formatter Utility
 * Uses Intl.NumberFormat based on user currency setting
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if an exotic currency code is passed
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};
