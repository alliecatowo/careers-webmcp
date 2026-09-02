
'use server';

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.1,
  GBP: 1.25,
  INR: 0.012,
  CAD: 0.75
};

/**
 * Normalizes a given amount from a specified currency to USD.
 * @param amount The amount in the local currency.
 * @param currency The currency code (e.g., 'EUR', 'INR').
 * @returns The equivalent amount in USD, rounded to 2 decimal places.
 */
export function normalizeToUSD(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency];
  if (rate === undefined) {
    // Fallback for unsupported currency
    return Math.round(amount * 100) / 100;
  }
  const amountUSD = amount * rate;
  return Math.round(amountUSD * 100) / 100;
}
