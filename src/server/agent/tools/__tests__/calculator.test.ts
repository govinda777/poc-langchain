import { calculatorTool } from '../calculator';

describe('Calculator Tool', () => {
    it('should add two numbers', () => {
        expect(calculatorTool('2 + 2')).toBe('4');
    });

    it('should subtract two numbers', () => {
        expect(calculatorTool('5 - 3')).toBe('2');
    });

    it('should multiply two numbers', () => {
        expect(calculatorTool('4 * 5')).toBe('20');
    });

    it('should divide two numbers', () => {
        expect(calculatorTool('10 / 2')).toBe('5');
    });

    it('should handle complex expressions', () => {
        expect(calculatorTool('(2 + 3) * 4')).toBe('20');
    });

    it('should return error for invalid expressions', () => {
        expect(calculatorTool('abc')).toContain('Error');
    });
});
