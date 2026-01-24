import { getWeather } from '../weather';

describe('Weather Tool', () => {
    it('should return a weather forecast string', async () => {
        const result = await getWeather('São Paulo');
        expect(result).toContain('A previsão do tempo para São Paulo é:');
        expect(result).toContain('°C');
    });

    it('should handle different locations (mocked generic response)', async () => {
        const result = await getWeather('Rio de Janeiro');
        expect(result).toContain('A previsão do tempo para Rio de Janeiro é:');
    });
});
