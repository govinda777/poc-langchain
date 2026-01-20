import { calculatorTool } from '../calculator';

describe('Calculator Tool', () => {
    it('should add two numbers correctly', async () => {
        const result = await calculatorTool.invoke({ operation: 'add', a: 5, b: 3 });
        expect(result).toBe('8');
    });

    it('should subtract two numbers correctly', async () => {
        const result = await calculatorTool.invoke({ operation: 'subtract', a: 10, b: 4 });
        expect(result).toBe('6');
    });

    it('should multiply two numbers correctly', async () => {
        const result = await calculatorTool.invoke({ operation: 'multiply', a: 7, b: 6 });
        expect(result).toBe('42');
    });

    it('should divide two numbers correctly', async () => {
        const result = await calculatorTool.invoke({ operation: 'divide', a: 20, b: 5 });
        expect(result).toBe('4');
    });

    it('should handle division by zero', async () => {
        const result = await calculatorTool.invoke({ operation: 'divide', a: 10, b: 0 });
        expect(result).toContain('Error');
    });
});
