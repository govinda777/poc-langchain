import { z } from 'zod';

export const WeatherInputSchema = z.object({
    location: z.string().min(1).describe("The city and state, e.g. San Francisco, CA"),
});

export type WeatherInput = z.infer<typeof WeatherInputSchema>;

export interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
}

export async function getWeather(input: WeatherInput): Promise<WeatherData> {
    // Validate input
    const validated = WeatherInputSchema.parse(input);
    const location = validated.location.toLowerCase();

    // Mock logic for deterministic outputs based on location char code
    const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy'];

    return {
        location: validated.location,
        temperature: Math.round((seed % 35) + 5), // 5 to 40 degrees
        condition: conditions[seed % conditions.length],
        humidity: Math.round((seed % 50) + 30),
        windSpeed: Math.round(seed % 20)
    };
}
