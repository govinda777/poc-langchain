# Calculator Tool

## Overview
The Calculator Tool provides basic arithmetic capabilities to the Cognitive Agent. It is implemented as a deterministic tool using `DynamicStructuredTool` and Zod for validation.

## Features
- **Operations**: Addition, Subtraction, Multiplication, Division.
- **Validation**: Strict input validation using Zod schemas.
- **Error Handling**: Handles division by zero and invalid inputs gracefully.

## Usage
The tool is automatically invoked by the Agent's `actionNode` when the `routerNode` detects a calculation intent.

### Examples
- "Calculate sum 5 and 10" -> Invokes `add(5, 10)` -> Returns `15`
- "Multiply 10 by 10" -> Invokes `multiply(10, 10)` -> Returns `100`

## Implementation Details
- **Source**: `src/server/agent/tools/calculator.ts`
- **Tests**: `src/server/agent/tools/__tests__/calculator.test.ts`
- **Integration**: `src/server/agent/__tests__/agent_calculator.test.ts`

## CI/CD & Traceability
This feature is covered by:
- **Unit Tests**: Verifying math logic.
- **Integration Tests**: Verifying agent routing and execution.
- **Linting/Formatting**: Enforced by CI pipeline and Git Hooks.
