import { getWeather } from '../weather';

describe('Weather Tool', () => {
    it('should return weather for Rio de Janeiro', async () => {
        const result = await getWeather('Rio de Janeiro');
        expect(result).toContain('30°C');
        expect(result).toContain('Sunny');
    });

    it('should return weather for São Paulo', async () => {
        const result = await getWeather('São Paulo');
        expect(result).toContain('22°C');
        expect(result).toContain('Rainy');
    });

    it('should return default message for unknown location', async () => {
        const result = await getWeather('Atlantis');
        expect(result).toBe('Weather data not available for Atlantis.');
    });

    it('should handle case insensitivity', async () => {
        const result = await getWeather('rio de janeiro');
        expect(result).toContain('30°C');
    });
});
