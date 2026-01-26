import { graph } from '../graph';
import { HumanMessage } from "@langchain/core/messages";
import { AgentState } from '../state';

describe('Feature: Security Gate (US02)', () => {

    it('Scenario: Unverified user attempts sensitive action (Transfer)', async () => {
        // Given
        const initialState = {
            userId: 'user-123', // Alice
            messages: [new HumanMessage("I want to transfer money")],
            isVerified: false
        };

        // When
        const result = await graph.invoke(initialState) as AgentState;

        // Then
        expect(result.securityOutcome).toBe('denied');
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('Security Alert');
    });

    it('Scenario: Verified user attempts sensitive action (Transfer)', async () => {
        // Given
        const initialState = {
            userId: 'user-123',
            messages: [new HumanMessage("I want to transfer money")],
            isVerified: true
        };

        // When
        const result = await graph.invoke(initialState) as AgentState;

        // Then
        expect(result.securityOutcome).toBe('approved');

        // Check if action node was executed (it adds "Tool execution simulated.")
        const toolMessage = result.messages.find((m: any) => m.content === "Tool execution simulated.");
        expect(toolMessage).toBeDefined();

        // Check if agent node generated a final response
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('Cognitive Agent');
    });
});
