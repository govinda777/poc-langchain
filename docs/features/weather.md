# Feature: Weather Information (US05)

## Description
As a user, I want to ask about the weather in specific locations so that I can plan my activities.

## Acceptance Criteria
1. The agent should identify intents related to "weather" or "clima".
2. The agent should extract the location from the user's query.
3. The agent should retrieve weather information (simulated/mocked) for the requested location.
4. If no location is provided, the agent should ask for it (or default to a generic response, but extraction is preferred).
5. The response should be natural and informative.

## Technical Implementation
- **Tool**: `getWeather(location: string)`
- **Router**: Detect keywords 'weather', 'clima'.
- **Action**: Call `getWeather` with extracted entity.
- **Mock Data**:
  - Rio de Janeiro: 30°C, Sunny
  - São Paulo: 22°C, Rainy
  - London: 15°C, Cloudy
  - New York: 20°C, Clear
  - Default: "Weather data not available for this location."
