import { graph } from '../graph';
import { HumanMessage } from "@langchain/core/messages";

describe('Feature: Security Gate (US02)', () => {
    // We will implement logic such that:
    // 'user-123' (Alice) is verified.
    // 'user-456' (Bob) is NOT verified.

    it('Scenario: Unverified user requests transfer (Security Gate)', async () => {
        // Given Bob (unverified)
        const inputs = {
            userId: 'user-456', // Bob
            messages: [new HumanMessage("I want to transfer money")]
        };

        // When
        // We cast to any because the graph return type might not be fully inferred in test env yet
        const result: any = await graph.invoke(inputs);

        // Then
        // The agent should refuse the action
        const lastMsg = result.messages[result.messages.length - 1].content;
        expect(lastMsg).toMatch(/Access Denied|authenticate/i);

        // And the security outcome should be recorded
        expect(result.securityOutcome).toBe("denied");
    });

    it('Scenario: Verified user requests transfer (Security Gate)', async () => {
        // Given Alice (verified)
        const inputs = {
            userId: 'user-123', // Alice
            messages: [new HumanMessage("I want to transfer money")]
        };

        // When
        const result: any = await graph.invoke(inputs);

        // Then
        // The agent should proceed (mock action execution)
        const lastMsg = result.messages[result.messages.length - 1].content;
        expect(lastMsg).not.toMatch(/Access Denied/i);

        // And the security outcome should be recorded
        expect(result.securityOutcome).toBe("approved");
    });
});
