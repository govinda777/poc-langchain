import { HumanMessage } from '@langchain/core/messages';
import { graph } from '../graph';
import { AgentState } from '../state';

// We need to cast the result to unknown first because the graph returns a generic state
// and our local AgentState definition might not yet match the runtime result until we update state.ts
// But for the test, we assume the properties will be there.

describe('Feature: Security Gate (US02)', () => {
    // Increase timeout for integration tests
    jest.setTimeout(10000);

    it('Scenario: Unverified user requests transfer -> Agent denies and asks for auth', async () => {
        // Given that the user is NOT verified (default)
        const inputs = {
            messages: [new HumanMessage("Quero fazer uma transferência de 100 reais")],
            userId: 'user-123',
            // isVerified: false // Default
        };

        // When the intent "transfer" is detected
        const result = await graph.invoke(inputs) as unknown as AgentState;

        // Then the security outcome should be 'denied'
        // Note: These properties don't exist on AgentState yet, so we cast to any for now to write the test
        expect((result as any).securityOutcome).toBe('denied');

        // And the agent should respond with an authentication requirement
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('Authentication required');
    });

    it('Scenario: Verified user requests transfer -> Agent proceeds', async () => {
        // Given that the user IS verified
        const inputs = {
            messages: [new HumanMessage("Quero fazer uma transferência de 100 reais")],
            userId: 'user-123',
            isVerified: true
        } as any; // Cast to any to inject isVerified before it exists in the interface

        // When the intent "transfer" is detected
        const result = await graph.invoke(inputs) as unknown as AgentState;

        // Then the security outcome should be 'approved'
        expect((result as any).securityOutcome).toBe('approved');

        // And the agent should NOT respond with an authentication requirement
        // (It should proceed to action or acknowledge)
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).not.toContain('Authentication required');
    });
});
