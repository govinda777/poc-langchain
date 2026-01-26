import { getWeather } from '../weather';

describe('Weather Tool', () => {
    it('should return weather data for a valid location', async () => {
        const result = await getWeather({ location: 'New York' });
        expect(result).toHaveProperty('location', 'New York');
        expect(result).toHaveProperty('temperature');
        expect(result).toHaveProperty('condition');
    });

    it('should return deterministic data for the same location', async () => {
        const result1 = await getWeather({ location: 'London' });
        const result2 = await getWeather({ location: 'London' });
        expect(result1.temperature).toBe(result2.temperature);
        expect(result1.condition).toBe(result2.condition);
    });

    it('should validate input using Zod', async () => {
        await expect(getWeather({ location: '' })).rejects.toThrow();
        // @ts-ignore
        await expect(getWeather({ })).rejects.toThrow();
    });
});
