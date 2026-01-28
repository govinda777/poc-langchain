import { HumanMessage } from "@langchain/core/messages";
import { graph } from '../graph';

describe('US02: Security Gate for Sensitive Actions', () => {
    // Helper to simulate a user session
    const simulateInteraction = async (input: string, initialState: any = {}) => {
        const state = {
            messages: [new HumanMessage(input)],
            userId: 'test-user',
            sessionId: 'session-123',
            ...initialState
        };
        return await graph.invoke(state as any) as any;
    };

    it('Scenario: Unverified user requests transfer -> Denied', async () => {
        // Given: User is NOT verified
        const initialState = {
            isVerified: false
        };

        // When: User asks for transfer
        const result = await simulateInteraction("Quero fazer uma transferência", initialState);

        // Then:
        // 1. Intent detected (optional check, but good for debugging)
        // 2. Security Outcome is denied
        expect(result.securityOutcome).toBe('denied');

        // 3. Agent response mentions authentication/security
        const lastMessage = result.messages[result.messages.length - 1].content;
        expect(lastMessage.toLowerCase()).toContain('security');
        expect(lastMessage.toLowerCase()).toContain('authenticate');
    });

    it('Scenario: Verified user requests transfer -> Approved', async () => {
        // Given: User IS verified
        const initialState = {
            isVerified: true
        };

        // When: User asks for transfer
        const result = await simulateInteraction("Quero fazer uma transferência", initialState);

        // Then:
        // 1. Security Outcome is approved
        expect(result.securityOutcome).toBe('approved');

        // 2. Agent response acknowledges (or proceeds, currently just approval is enough check)
        // For MVP, we might not have the full transfer logic, but we shouldn't get the denial message.
        const lastMessage = result.messages[result.messages.length - 1].content;
        expect(lastMessage.toLowerCase()).not.toContain('authenticate');
    });
});
