import { calculatorTool } from '../calculator';

describe('Calculator Tool', () => {
  it('should add numbers correctly', async () => {
    const result = await calculatorTool.invoke({ operation: 'add', a: 5, b: 3 });
    expect(result).toBe('8');
  });

  it('should subtract numbers correctly', async () => {
    const result = await calculatorTool.invoke({ operation: 'subtract', a: 10, b: 4 });
    expect(result).toBe('6');
  });

  it('should multiply numbers correctly', async () => {
    const result = await calculatorTool.invoke({ operation: 'multiply', a: 2, b: 6 });
    expect(result).toBe('12');
  });

  it('should divide numbers correctly', async () => {
    const result = await calculatorTool.invoke({ operation: 'divide', a: 10, b: 2 });
    expect(result).toBe('5');
  });

  it('should handle division by zero', async () => {
    const result = await calculatorTool.invoke({ operation: 'divide', a: 5, b: 0 });
    expect(result).toBe('Error: Division by zero');
  });
});
