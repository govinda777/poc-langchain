# Temperature Converter Tool

## Overview
The Temperature Converter is a utility designed to convert temperatures between Celsius and Fahrenheit. It is implemented as a core library function and wrapped as a LangChain tool for the agent to use.

## Features
- Convert Celsius to Fahrenheit.
- Convert Fahrenheit to Celsius.
- Validates input to ensure numerical values.

## Implementation Details

### Core Logic
Located in: `src/lib/temperature.ts`

Functions:
- `celsiusToFahrenheit(celsius: number): number`
- `fahrenheitToCelsius(fahrenheit: number): number`

### Agent Tool
Located in: `src/server/agent/tools/temperature.ts`

The tool is defined as a `DynamicStructuredTool` using Zod for schema validation. It exposes a single entry point that accepts a value and the target unit ('celsius' or 'fahrenheit').

## Usage

### By Agent
The agent can call the tool with:
```json
{
  "value": 25,
  "targetUnit": "fahrenheit"
}
```

### Response
The tool returns a string describing the conversion result, e.g., "25°C is 77°F".
