# Calculator Feature (US06)

## Description
The agent provides a basic calculator tool capable of evaluating mathematical expressions found in user messages.

## Usage
The user can ask the agent to perform calculations using natural language or mathematical notation.

**Examples:**
- "Calculate 2 + 2"
- "Quanto é 10 * 5?"
- "100 / 4"
- "Conta: (5 + 3) * 2"

## Architecture
- **Router Node**: Detects keywords (`calc`, `calcular`, `conta`, `+`, `-`, `*`, `/`) and routes to `actionNode`.
- **Action Node**: Extracts the mathematical expression from the user's message (stripping text) and invokes the `calculatorTool`.
- **Calculator Tool**: Safely evaluates the sanitized expression.

## Security
The tool uses a sanitizer to allow only numbers and basic operators (`+`, `-`, `*`, `/`, `(`, `)`, `.`) before evaluation, preventing code injection attacks.
