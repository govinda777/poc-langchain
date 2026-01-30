# Security Gate (US02)

The Security Gate is a mechanism to protect sensitive actions from unauthorized execution.
It enforces the principle that "Any critical action requires strong authentication".

## Architecture
- **Security Node**: Intercepts the conversation flow after perception.
- **Verification State**: `isVerified` (boolean) in `AgentState` indicates if the user has authenticated in the current session.
- **Outcome**: `securityOutcome` ('approved' | 'denied' | 'pending').

## Flow
1. User sends message.
2. `perceptionNode` detects intent (e.g., 'transfer').
3. `securityNode` checks if intent is sensitive.
4. If sensitive and `!isVerified`:
   - Sets `securityOutcome = 'denied'`.
   - Logs audit trail.
5. `routerNode` routes denied requests to `agentNode` for explanation.
6. `agentNode` responds with "Authentication required".

## Auditability
Every security check is logged with:
- User ID
- Intent
- Decision (APPROVED/DENIED)

## Related User Stories
- **US02**: User requesting bank transfer via WhatsApp must be authenticated.
