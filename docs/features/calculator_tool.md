# Calculator Tool Feature

## Overview
The Calculator Tool allows the Cognitive Agent to perform basic mathematical operations (Addition, Subtraction, Multiplication, Division). This feature demonstrates a "tractable" implementation of a tool within the LangGraph architecture, complete with validation, testing, and CI/CD integration.

## Usage
The agent is currently configured to recognize specific keywords to trigger the calculator.

**Format:**
`calc: <operation> <number_a> <number_b>`

**Supported Operations:**
- `add`
- `subtract`
- `multiply`
- `divide`

**Examples:**
- `calc: add 5 10` (Result: 15)
- `calc: divide 100 2` (Result: 50)
- `calc: divide 5 0` (Result: Error: Division by zero)

## Technical Implementation

### Tool Definition
The tool is defined in `src/server/agent/tools/calculator.ts` using LangChain's `DynamicStructuredTool`. It utilizes `zod` for strict input schema validation.

### Integration
The tool is integrated into the Agent Graph via the `actionNode` in `src/server/agent/nodes.ts`.
- **Router Node:** Detects the `calc:` prefix and routes to the `action` node.
- **Action Node:** Parses the input and invokes the `calculatorTool`.

## Testing
We adhere to a strict testing pyramid:

### Unit Tests
Located in `src/server/agent/tools/__tests__/calculator.test.ts`.
Run with:
```bash
npm test src/server/agent/tools/__tests__/calculator.test.ts
```

### Integration Tests
Located in `src/server/agent/__tests__/agent_calculator.test.ts`.
Run with:
```bash
npm test src/server/agent/__tests__/agent_calculator.test.ts
```

## Quality Assurance (Git Guardians)
This feature is protected by a robust CI/CD pipeline and Git Hooks:

1.  **Pre-commit Hooks (`husky`):**
    - Runs `secretlint` to prevent committing secrets (API keys, etc.).
    - Runs `lint-staged` to enforce `eslint` rules on changed files.

2.  **CI Pipeline (GitHub Actions):**
    - Runs on every push to `main` or Pull Request.
    - Validates dependencies (`npm ci`).
    - Runs `secretlint` on the entire codebase.
    - Runs `eslint`.
    - Runs the full test suite (`npm test`).
    - Verifies the build (`npm run build`).
