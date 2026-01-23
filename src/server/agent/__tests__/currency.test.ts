import { getExchangeRate } from '../tools/currency';

describe('Currency Tool', () => {
    it('should return USD rate', async () => {
        const result = await getExchangeRate('dolar');
        expect(result).toContain('R$ 5.00');
    });

    it('should return EUR rate', async () => {
        const result = await getExchangeRate('euro');
        expect(result).toContain('R$ 5.50');
    });

    it('should return error for unknown currency', async () => {
        const result = await getExchangeRate('yen');
        expect(result).toContain("don't have the rate");
    });
});
