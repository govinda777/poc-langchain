# Security Gate (US02)

## Overview
The Security Gate ensures that sensitive actions (like financial transactions) are never executed without explicit user verification. It follows the principle of "Verify then Trust".

## How it Works
The workflow includes a dedicated `securityNode` that intercepts requests between Perception and Execution.

1. **Perception**: The agent identifies the user's intent (e.g., 'transfer').
2. **Security Check**:
   - If the intent is classified as **sensitive** (e.g., 'transfer', 'buy'):
     - The agent checks `state.isVerified`.
     - If `false`: `securityOutcome` is set to 'denied'.
     - If `true`: `securityOutcome` is set to 'approved'.
   - If the intent is **non-sensitive** (e.g., 'weather'):
     - `securityOutcome` is set to 'approved'.
3. **Enforcement**:
   - The `agentNode` (or `routerNode`) respects `securityOutcome`.
   - If 'denied', the flow is interrupted, and the agent responds with "Authentication required".

## Auditability
All security decisions are logged with `Audit:` prefix:
- "Audit: Security Check - User X NOT verified. Action denied."
- "Audit: Security Check - User X is verified. Action approved."

## User Story Mapping
- **US02**: "For your safety, authenticate here". The system detects the sensitive intent and blocks it until verification is present.
