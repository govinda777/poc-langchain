# Feature: Security Gate (US02)

## Description
To ensure user safety and prevent unauthorized transactions, the agent must enforce a **Security Gate** before executing any sensitive action (e.g., financial transfers, data modification, purchases). This gate validates the user's identity strength (`isVerified`).

## User Story
**US02**: As a user interacting via WhatsApp (or any channel), when I request a sensitive operation (like "transfer money"), the agent must interrupt the conversation flow to verify my identity securely before proceeding.

## Principles
- **Safety First**: No critical action runs without `isVerified = true`.
- **Auditability**: Every security decision (Approve/Deny) is logged.
- **Identity-First**: Verification is tied to the unique `userId`.

## BDD Scenarios

### Scenario 1: Deny Unverified Request
**Given** that the user is NOT verified (`isVerified: false`)
**When** the user sends a message with a sensitive intent (e.g., "Quero transferir 100 reais")
**Then** the agent's Router detects the sensitive intent
**And** routes the flow to the `securityNode`
**And** the Security Gate denies the request
**And** the agent responds with an authentication request message.

### Scenario 2: Allow Verified Request
**Given** that the user IS verified (`isVerified: true`)
**When** the user sends a message with a sensitive intent (e.g., "Pagar boleto")
**Then** the agent's Router detects the sensitive intent
**And** routes the flow to the `securityNode`
**And** the Security Gate approves the request (`securityOutcome: 'approved'`)
**And** the flow proceeds to the `actionNode` to execute the task.

## Audit Logs
The system must produce logs for every security check:
- `Audit: Security Gate checked verification. User: {id}, Verified: {bool}, Outcome: {approved|denied}`
