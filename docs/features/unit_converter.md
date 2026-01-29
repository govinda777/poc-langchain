# US08: Unit Converter

## Description
The Unit Converter is a tool integrated into the Cognitive Agent that allows users to perform basic unit conversions for length and weight directly within the chat interface.

## Supported Conversions

### Length
*   **Meters (m)**
*   **Kilometers (km)**
*   **Miles (mi)**
*   **Feet (ft)**
*   **Centimeters (cm)**
*   **Millimeters (mm)**
*   **Inches (in)**

### Weight
*   **Kilograms (kg)**
*   **Pounds (lbs)**
*   **Grams (g)**
*   **Ounces (oz)**

## Usage
The user can request a conversion using natural language. The agent's router detects the intent (keywords: "convert", "converte").

### Examples
*   "Converte 10 km para m"
*   "Convert 5 lbs to kg"
*   "Converte 100 meters to feet"

## Implementation Details
*   **Tool Source:** `src/server/agent/tools/unitConverter.ts`
*   **Tests:** `src/server/agent/tools/__tests__/unitConverter.test.ts`
*   **Integration:** `src/server/agent/nodes.ts` (Router & Action Node)

## Validation
*   The tool validates the input units and supports mixed case (e.g., "KM", "km").
*   Unsupported units result in an error message.
