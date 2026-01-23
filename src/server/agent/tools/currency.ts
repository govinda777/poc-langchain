export async function getExchangeRate(currency: string): Promise<string> {
    const rates: Record<string, number> = {
        'usd': 5.0,
        'dolar': 5.0,
        'eur': 5.5,
        'euro': 5.5
    };

    // Extract basic currency name if embedded in sentence (simplistic)
    let key = currency.toLowerCase();
    if (key.includes('dolar') || key.includes('usd')) key = 'dolar';
    else if (key.includes('euro') || key.includes('eur')) key = 'euro';

    const rate = rates[key];

    if (rate) {
        return `The exchange rate for ${key.toUpperCase()} is R$ ${rate.toFixed(2)}.`;
    }
    return `Sorry, I don't have the rate for ${currency}.`;
}
