# User Story 04: Currency Converter

## Description
The agent provides real-time currency conversion for major currencies (USD, BRL, EUR) to assist users with financial calculations.

## Usage
Users can ask the agent to convert amounts between supported currencies.

**Example Prompts:**
- "Convert 10 USD to BRL"
- "Quanto é 50 EUR em USD?"
- "Qual a cotação de 100 reais em dolares?"

## Supported Currencies
- USD (US Dollar) - Base
- BRL (Brazilian Real)
- EUR (Euro)

## Technical Implementation
- **Tool:** `src/server/agent/tools/currency.ts`
- **Logic:**
  - `routerNode` detects keywords like "convert", "currency", "cotação".
  - `actionNode` extracts the amount, source currency, and target currency using Regex.
  - Returns the calculated amount based on fixed mock rates (for MVP).
- **Testing:**
  - Unit tests: `src/server/agent/tools/__tests__/currency.test.ts`
  - Integration tests: `src/server/agent/__tests__/currency_flow.test.ts`

## Future Improvements
- Integrate with a real-time Exchange Rate API.
- Support more currencies.
- Handle historical dates.
