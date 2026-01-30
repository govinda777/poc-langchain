/**
 * Mock Currency Converter Tool
 * Handles basic conversions between USD, BRL, and EUR with fixed rates.
 */

const RATES: Record<string, number> = {
    'USD': 1.0,   // Base
    'BRL': 5.50,  // 1 USD = 5.50 BRL
    'EUR': 0.92   // 1 USD = 0.92 EUR
};

export function convertCurrency(amount: number, from: string, to: string): number {
    const fromRate = RATES[from.toUpperCase()];
    const toRate = RATES[to.toUpperCase()];

    if (!fromRate || !toRate) {
        throw new Error(`Unsupported currency: ${!fromRate ? from : to}`);
    }

    // Convert to Base (USD) then to Target
    const amountInUsd = amount / fromRate;
    const result = amountInUsd * toRate;

    return parseFloat(result.toFixed(2));
}
