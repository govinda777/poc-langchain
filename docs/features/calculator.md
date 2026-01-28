# Calculator Tool

## Overview
The Calculator Tool allows the agent to perform basic arithmetic operations. This is useful for answering math-related queries from users.

## Usage
The agent detects mathematical expressions or keywords like "calculate", "calc", or "math".

### Examples:
- "Calculate 2 + 2"
- "What is 5 * 10?"
- "Calc 100 / 5"

## Implementation
- **Tool Logic**: Located in `src/server/agent/tools/calculator.ts`.
- **Integration**: `routerNode` detects math intent, and `actionNode` executes the tool.

## Safety
- The tool uses a strict regex parser to avoid `eval` or unsafe code execution.
- Only supports basic operators: `+`, `-`, `*`, `/`.
