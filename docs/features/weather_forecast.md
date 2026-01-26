# US05: Weather Forecast

## Description
As a user, I want to know the weather forecast for a specific location so that I can plan my activities.

## Actors
- User
- Cognitive Agent
- Weather Tool (Mocked)

## Pre-conditions
- The agent is initialized and active.

## Flow
1. User asks a question about the weather (e.g., "What's the weather in Tokyo?").
2. The `PerceptionNode` processes the input.
3. The `RouterNode` detects the intent ('weather') and routes to `ActionNode`.
4. The `ActionNode` invokes the `WeatherTool` with the location extracted or passed from the intent.
5. The `WeatherTool` returns a structured weather report (mocked).
6. The `AgentNode` generates a natural language response using the report.

## Post-conditions
- The user receives a weather update.

## Acceptance Criteria
1. The system detects "weather", "clima", "tempo" keywords.
2. The system correctly identifies the location (or defaults if missing).
3. The system returns a response containing:
    - Temperature
    - Condition (Sunny, Rainy, etc.)
    - Location
4. Input validation prevents injection attacks.
