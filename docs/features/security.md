# Security & Auditability

## Overview
The Cognitive Agent implements a strict security model ("Zero Trust" for sensitive actions) to ensure user safety. Any action involving financial transactions, data modification, or personal information access requires explicit authentication.

## Principles
1. **Gate for Sensitive Actions**: All sensitive intents (e.g., 'transfer', 'payment') are routed through a Security Node.
2. **Auditability**: Every security decision (approve/deny) is logged with the user ID and the reason.
3. **Explicit Feedback**: Users are clearly informed when an action is blocked due to lack of authentication.

## Implementation Details

### Security Node
- **Input**: `AgentState`
- **Logic**: Checks `state.isVerified`.
- **Output**: Updates `state.securityOutcome` to `'approved'` or `'denied'`.

### Routing
The `routerNode` detects sensitive keywords (e.g., "transferência") and redirects flow to the `securityNode` instead of the standard response or action nodes.

## User Stories Implemented
- **US02**: WhatsApp User requesting bank transfer.
  - *Behavior*: If a user asks for a transfer without being verified, the agent blocks the request and asks for authentication.
