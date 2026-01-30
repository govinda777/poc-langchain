import { convertCurrency } from '../currency';

describe('Currency Converter Tool', () => {
    test('converts USD to BRL correctly', () => {
        expect(convertCurrency(10, 'USD', 'BRL')).toBe(55.0);
    });

    test('converts BRL to USD correctly', () => {
        // 5.5 BRL = 1 USD
        expect(convertCurrency(5.5, 'BRL', 'USD')).toBe(1.0);
    });

    test('throws error for invalid currency', () => {
        expect(() => convertCurrency(10, 'XYZ', 'USD')).toThrow('Unsupported currency: XYZ');
    });
});
