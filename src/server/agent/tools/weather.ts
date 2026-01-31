export async function getWeather(location: string): Promise<string> {
    const loc = location.toLowerCase().trim();

    const weatherData: Record<string, string> = {
        'rio de janeiro': '30°C, Sunny',
        'são paulo': '22°C, Rainy',
        'london': '15°C, Cloudy',
        'new york': '20°C, Clear'
    };

    if (weatherData[loc]) {
        return `The weather in ${location} is ${weatherData[loc]}.`;
    }

    return `Weather data not available for ${location}.`;
}
