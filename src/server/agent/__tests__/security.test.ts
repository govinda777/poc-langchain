import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

describe('Feature: Security Gate (US02)', () => {

    // Increase timeout just in case
    jest.setTimeout(10000);

    // US02: Sensitive actions require authentication
    it('Scenario: Unverified user requests transfer -> Access Denied', async () => {
        const initialState = {
            userId: 'user-123',
            isVerified: false,
            messages: [new HumanMessage("Quero fazer uma transferência bancária")]
        };

        // We cast to any because graph.invoke returns unknown/StateSnapshot
        const result = await graph.invoke(initialState) as unknown as AgentState;

        // Expect security outcome to have triggered denial logic
        // Note: agentNode resets it to 'pending' after handling, so we check the response message.
        const lastMessage = result.messages[result.messages.length - 1];
        const content = lastMessage.content.toString();

        console.log("Agent Response (Unverified):", content);

        expect(content).toContain('Access Denied');
        expect(content).toContain('authenticate');
    });

    it('Scenario: Verified user requests transfer -> Access Granted', async () => {
        const initialState = {
            userId: 'user-123',
            isVerified: true,
            messages: [new HumanMessage("Quero fazer uma transferência bancária")]
        };

        const result = await graph.invoke(initialState) as unknown as AgentState;

        const messages = result.messages.map(m => m.content.toString());
        console.log("Agent Response (Verified):", messages);

        // Should have executed the tool
        // actionNode returns a message "Tool execution simulated."
        const toolExecution = messages.some(m => m.includes("Tool execution simulated"));
        expect(toolExecution).toBe(true);

        // And final response from agentNode
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage).toContain('Hello Alice');
    });
});
