# Security Gate (US02)

## Overview
The Security Gate ensures that sensitive actions (e.g., financial transactions, purchasing) are only performed by authenticated users. It acts as a middleware in the agent's cognitive graph, intercepting intents before they reach the Action Node.

## Key Concepts

### 1. Identity Verification (`isVerified`)
- The `AgentState` includes an `isVerified` boolean flag.
- This flag defaults to `false` for new sessions.
- Future integration will populate this flag via Strong Authentication (MFA, Biometrics) in the `hydrationNode` or a dedicated Auth Node.

### 2. Security Outcome
- The `securityNode` evaluates the user's intent and verification status.
- It produces a `securityOutcome`:
    - `approved`: Intent is safe or user is verified.
    - `denied`: Intent is sensitive and user is NOT verified.
    - `pending`: (Future use) Verification is in progress.

### 3. Workflow
The graph topology enforces security checks:
`Hydration` -> `Perception` -> `Security` -> `Router` -> (`Action` | `Agent`)

- **Perception Node**: Detects sensitive keywords (e.g., 'transferencia', 'pay').
- **Security Node**: Checks if the intent is sensitive and if the user is verified.
- **Router Node**:
    - If `securityOutcome` is `denied`, it short-circuits to the `Agent Node` (Response) to request authentication.
    - If `approved`, it proceeds with normal routing (e.g., to `Action Node`).

## Auditability
All security decisions are logged to the console with the `Audit:` prefix for traceability.
- `Audit: Security Check - User NOT verified for sensitive action. Outcome: Denied.`
- `Audit: Security Check - User verified for sensitive action. Outcome: Approved.`
