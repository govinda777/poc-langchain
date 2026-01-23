import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';

describe('Feature: Security Gate (US02)', () => {

    it('Scenario: User requests sensitive action without verification', async () => {
        // Given that the user is NOT authenticated (default state)
        // and sends a sensitive request
        const inputState = {
            userId: 'user-hacker',
            messages: [new HumanMessage("Quero fazer uma Transferência bancária")]
        };

        // When the agent processes the request
        // @ts-ignore - The graph.invoke returns unknown, but we know it matches AgentState roughly
        const result: any = await graph.invoke(inputState);

        // Then the agent must intercept and deny the action
        // For now, checking the state. In a real chat, we'd check the response message text too.

        // This expectation will fail currently because logic is missing
        expect(result.securityOutcome).toBe('denied');

        // Optional: Check if response contains a warning (this depends on implementation)
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toMatch(/autentic|security|segurança/i);
    });
});
