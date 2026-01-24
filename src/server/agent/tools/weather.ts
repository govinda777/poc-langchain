export async function getWeather(location: string = "São Paulo"): Promise<string> {
    console.log(`Tool: Fetching weather for ${location}...`);

    // Mock logic
    const conditions = ['Ensolarado', 'Chuvoso', 'Nublado', 'Parcialmente nublado'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * (35 - 15) + 15);

    return `A previsão do tempo para ${location} é: ${randomCondition}, com temperatura de ${randomTemp}°C.`;
}
