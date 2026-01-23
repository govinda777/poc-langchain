# Feature: Security Gate (US02)

## Purpose
Ensure that any sensitive action (financial transfer, data modification, PIX) is protected by a strong authentication gate. The agent must verify the user's identity before proceeding, adhering to the "Security in Sensitive Actions" principle.

## Implementation Details

### Architecture
- **Router Node**: Detects sensitive intents (e.g., "transfer", "pix", "saldo") and routes them to the `securityNode`.
- **Security Node**: Checks the `isVerified` flag in the `AgentState`.
  - If `isVerified` is `false`: Sets `securityOutcome` to `denied` and appends an "Access Denied" message.
  - If `isVerified` is `true`: Sets `securityOutcome` to `approved`.
- **Agent Node**: Respects `securityOutcome`. If denied, it halts further generation or reinforces the denial message.

### Data Model (`AgentState`)
- `isVerified: boolean`: Indicates if the user session is authenticated.
- `securityOutcome: 'approved' | 'denied' | 'pending'`: Tracks the result of the security check.

### Flows
1. **Unverified User**:
   - User: "Quero fazer um PIX"
   - Router: Routes to `security`.
   - Security: Checks `isVerified` (false). Sets `denied`. Returns "Acesso Negado...".
   - Agent: Stops.
   - Output: "Acesso Negado: Para sua segurança, é necessária autenticação forte para esta ação."

## Verification
- **BDD Test**: `src/server/agent/__tests__/security.test.ts`
- **Scenario**: User requests sensitive action without verification -> Access Denied.
