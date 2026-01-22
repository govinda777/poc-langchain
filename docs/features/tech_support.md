# US03: Tech Support (FAQ)

## Description
The agent is capable of answering common technical support questions using a predefined Knowledge Base (FAQ).

## Implementation
- **Tool**: `faqTool` (`src/server/agent/tools/faq.ts`)
- **Integration**:
    - `PerceptionNode`: Detects intents related to support (e.g., "password", "help", "contact").
    - `RouterNode`: Routes `faq` intent to `ActionNode`.
    - `ActionNode`: Executes `faqTool` with the user's query.

## Capabilities
Currently supports:
- Password reset instructions
- Contact information
- Support hours
- Pricing

## Usage
User: "How do I reset my password?"
Agent: "To reset your password, go to the settings page and click 'Reset Password'."
