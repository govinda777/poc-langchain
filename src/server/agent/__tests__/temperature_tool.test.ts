import { temperatureTool } from '../tools/temperature';

describe('Temperature Tool', () => {
  it('should convert 0C to 32F', async () => {
    const result = await temperatureTool.invoke({ value: 0, targetUnit: 'fahrenheit' });
    expect(result).toBe("0°C is 32.00°F");
  });

  it('should convert 32F to 0C', async () => {
    const result = await temperatureTool.invoke({ value: 32, targetUnit: 'celsius' });
    expect(result).toBe("32°F is 0.00°C");
  });
});
