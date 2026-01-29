import { convertUnits } from '../unitConverter';

describe('Unit Converter Tool', () => {
    describe('Length Conversions', () => {
        it('should convert km to m', () => {
            const result = convertUnits(1, 'km', 'm');
            expect(result).toBe('1000 m');
        });

        it('should convert m to km', () => {
            const result = convertUnits(1000, 'm', 'km');
            expect(result).toBe('1 km');
        });

        it('should convert mi to km', () => {
            // 1 mi = 1.60934 km
            const result = convertUnits(1, 'mi', 'km');
            expect(result).toBe('1.6093 km');
        });

        it('should convert ft to m', () => {
             const result = convertUnits(10, 'ft', 'm');
             // 10 * 0.3048 = 3.048
             expect(result).toBe('3.048 m');
        });
    });

    describe('Weight Conversions', () => {
        it('should convert kg to lbs', () => {
            const result = convertUnits(1, 'kg', 'lbs');
            // 1 / 0.453592 = 2.20462
            expect(result).toBe('2.2046 lbs');
        });

        it('should convert lbs to kg', () => {
            const result = convertUnits(1, 'lbs', 'kg');
            expect(result).toBe('0.4536 kg');
        });
    });

    describe('Error Handling', () => {
        it('should throw error for unsupported units', () => {
            expect(() => convertUnits(1, 'foo', 'bar')).toThrow('Unsupported conversion');
        });

        it('should throw error for mixed dimensions (length to weight)', () => {
             expect(() => convertUnits(1, 'km', 'kg')).toThrow('Unsupported conversion');
        });
    });
});
