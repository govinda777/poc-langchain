import { graph } from '../graph';
import { HumanMessage } from "@langchain/core/messages";
import { AgentState } from '../state';

// Increase timeout for graph execution
jest.setTimeout(10000);

describe('Feature: Security Gate (US02)', () => {

    it('Scenario: Unverified user requests transfer -> Access Denied', async () => {
        // Given
        const initialState = {
            userId: 'user-123',
            messages: [new HumanMessage("Quero fazer uma transferencia")],
            isVerified: false // Explicitly unverified
        };

        // When
        const result = await graph.invoke(initialState) as unknown as AgentState;

        // Then
        // Security checks
        expect(result.intent).toBe('transfer');
        expect(result.securityOutcome).toBe('denied');

        // Response check
        const lastMessage = result.messages[result.messages.length - 1].content.toString();
        expect(lastMessage).toContain('Authentication required');
    });

    it('Scenario: Verified user requests transfer -> Access Approved', async () => {
        // Given
        const initialState = {
            userId: 'user-123',
            messages: [new HumanMessage("Quero pagar uma conta")],
            isVerified: true // Explicitly verified
        };

        // When
        const result = await graph.invoke(initialState) as unknown as AgentState;

        // Then
        expect(result.intent).toBe('transfer'); // mapped from 'pagar'
        expect(result.securityOutcome).toBe('approved');

        // Response check (should NOT be auth required)
        const lastMessage = result.messages[result.messages.length - 1].content.toString();
        expect(lastMessage).not.toContain('Authentication required');
    });

    it('Scenario: Unverified user checks weather -> Access Approved', async () => {
        // Given
        const initialState = {
            userId: 'user-123',
            messages: [new HumanMessage("Como está o clima?")],
            isVerified: false
        };

        // When
        const result = await graph.invoke(initialState) as unknown as AgentState;

        // Then
        expect(result.intent).toBe('weather');
        expect(result.securityOutcome).toBe('approved'); // Not sensitive

        // Check routing to action (mocked) or response
        // In current implementation weather routes to actionNode which returns "Tool execution simulated."
        const messages = result.messages;
        const toolMsg = messages.find((m) => m.content.toString() === "Tool execution simulated.");
        expect(toolMsg).toBeDefined();
    });
});
