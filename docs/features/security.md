# Security Gate (US02)

## Overview
The Security Gate ensures that sensitive actions (e.g., financial transfers, data modification) require explicit user authentication before execution. This adheres to the **Security in Sensitive Actions** principle.

## User Story US02
**Scenario:** WhatsApp user requesting bank transfer.
- **Requirement:** "For your safety, authenticate here" before executing.
- **Implementation:** `securityNode` intercepts intent 'transfer' and checks `isVerified`.

## Architecture

### State Changes
Added to `AgentState`:
- `isVerified` (boolean): Whether the user is currently authenticated via a strong method (biometrics, secure link).
- `securityOutcome` ('approved' | 'denied' | 'pending'): The result of the security check.

### Flow
1. **Hydration**: Load user profile.
2. **Perception**: Process input.
3. **Router**: Detects intents.
   - If intent is 'transfer', routes to **Security Gate**.
   - If intent is 'weather', routes to Action.
4. **Security Gate**:
   - Checks `state.isVerified`.
   - If `true` -> `securityOutcome: 'approved'` -> Route to **Action**.
   - If `false` -> `securityOutcome: 'denied'` -> Route to **Agent** (Response).
5. **Agent**:
   - If `securityOutcome` is 'denied', generates an "Access Denied" message requesting authentication.
   - Otherwise, generates standard response.

## Audit Logs
The agent logs security decisions for auditability:
- `Audit: Security Check - User {userId} verified. Access GRANTED.`
- `Audit: Security Check - User {userId} NOT verified. Access DENIED.`

## Future Improvements
- Integration with real authentication provider (e.g., Privy, OAuth).
- Time-based session expiry for `isVerified`.
- Step-up authentication flow (sending a link).
