
import { MOCK_CONVERSION_RATES, CURRENCY_SYMBOLS } from '@/config/currencies';

/**
 * Converts an amount from a source currency to a target currency using mock rates.
 * @param amount - The amount of money in the source currency.
 * @param fromCurrency - The currency code of the source amount (e.g., 'USD').
 * @param toCurrency - The currency code of the target currency (e.g., 'INR').
 * @returns The converted amount in the target currency.
 */
function convert(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = MOCK_CONVERSION_RATES[fromCurrency];
  const toRate = MOCK_CONVERSION_RATES[toCurrency];

  if (!fromRate || !toRate) {
    console.warn(`Missing conversion rate for ${fromCurrency} or ${toCurrency}`);
    return amount;
  }

  // Convert the source amount to the base currency (USD) first, then to the target currency.
  const amountInBase = amount / fromRate;
  return amountInBase * toRate;
}

/**
 * Converts a given amount from USD to a local currency.
 * @param amountUSD - The amount in USD.
 * @param targetCurrency - The target local currency code.
 * @returns The amount in the target local currency.
 */
export function convertToLocal(amountUSD: number, targetCurrency: string): number {
  return convert(amountUSD, 'USD', targetCurrency);
}

/**
 * Converts an amount from a local currency back to USD.
 * @param amountLocal - The amount in the local currency.
 * @param sourceCurrency - The source local currency code.
 * @returns The amount in USD.
 */
export function convertToUSD(amountLocal: number, sourceCurrency: string): number {
  return convert(amountLocal, sourceCurrency, 'USD');
}

/**
 * Formats an amount with its appropriate currency symbol and formatting.
 * @param amount - The numerical amount.
 * @param currency - The currency code.
 * @param locale - Optional locale for formatting conventions (e.g., 'en-US', 'de-DE').
 * @returns A formatted currency string (e.g., "$1,234.56", "₹1,03,000.00").
 */
export function formatCurrency(amount: number, currency: string, locale: string = 'en-US'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  try {
    // Using Intl.NumberFormat for robust, locale-aware currency formatting.
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (e) {
    // Fallback for unsupported currency codes in Intl
    return `${symbol}${amount.toFixed(2)}`;
  }
}
