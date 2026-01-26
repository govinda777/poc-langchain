# Security Gate (US02)

## Purpose
The Security Gate ensures that sensitive actions (e.g., financial transactions, data modification) are only performed by verified users. It interrupts the normal conversation flow to demand strong authentication when a sensitive intent is detected.

## Pillars Refinforcement
- **Security**: Prevents unauthorized execution of critical operations.
- **Auditability**: Logs every decision (Approved/Denied) with a clear reason ("User verified" vs "User NOT verified").

## Implementation Details
- **Trigger**: The `routerNode` detects sensitive keywords (e.g., "transfer", "buy", "pay").
- **Gate**: The `securityNode` checks `AgentState.isVerified`.
- **Outcome**:
  - **Denied**: If `isVerified` is false, the flow is interrupted, and a request for authentication is returned.
  - **Approved**: If `isVerified` is true, the flow proceeds to the action execution.

## User Story Mapping
- **US02**: "When 'transfer' is detected, the agent demands authentication."
  - Implemented via `securityNode`.
  - Verified by `security.test.ts`.

## Future Improvements
- Integrate with real authentication provider (e.g., Privy) to set `isVerified`.
- Implement a "Challenge" flow where the user can authenticate in-chat or via a secure link.
