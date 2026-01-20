# Feature: Long-Term Memory (Context Persistence)

## Overview
This feature enables the agent to store and retrieve the context of previous conversations for a specific user. It supports the **Identity-First** and **Scientific Memory** principles by persisting key information across sessions.

## Business Value
- **US01:** Allows the agent to greet returning users (e.g., "Welcome back, João!") and resume previous topics (e.g., "Did you think about that insurance proposal?").
- Improves user experience by making interactions feel continuous rather than episodic.

## Implementation Details

### Data Model
The `UserProfile` interface in `src/server/agent/state.ts` has been updated to include:
```typescript
interface UserProfile {
    // ...
    lastConversationContext?: string; // Summary or key info from the last session
}
```

### Flow
1. **Hydration:** When a user connects, the `hydrationNode` fetches the `UserProfile` from the store (currently `MOCK_DB`).
2. **Context Loading:** If `lastConversationContext` exists, it is loaded into the `AgentState`.
3. **Auditability:** The agent logs `Audit: Loaded long-term memory context for user ...` to ensure transparency.

## Future Improvements
- Implement a mechanism to **write** to this memory field at the end of a conversation (e.g., summarization node).
- Move from `MOCK_DB` to a real persistent database (Postgres/Redis).
- Support more structured memory (e.g., list of topics, specific facts).
