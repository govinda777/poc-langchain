import { HumanMessage } from "@langchain/core/messages";
import { routerNode, actionNode } from "../nodes";
import { AgentState } from "../state";

describe('Currency Integration Flow', () => {
    const mockState: AgentState = {
        messages: [],
        sessionId: 'test-session',
        userProfile: { id: 'test', name: 'Tester', preferences: {} }
    };

    test('Router should route currency request to action', async () => {
        const state = {
            ...mockState,
            messages: [new HumanMessage("Convert 10 USD to BRL")]
        };
        const nextNode = await routerNode(state);
        expect(nextNode).toBe('action');
    });

    test('Action node should perform currency conversion', async () => {
        const state = {
            ...mockState,
            messages: [new HumanMessage("Convert 10 USD to BRL")]
        };

        const result = await actionNode(state);
        // Expecting "Converted: 10 USD = 55 BRL"
        // Note: The logic in nodes.ts returns: `Converted: ${amount} ${from} = ${result} ${to}`
        const content = result.messages?.[0].content;
        expect(content).toContain('Converted: 10 USD = 55 BRL');
    });

    test('Action node handles invalid currency gracefully', async () => {
        const state = {
             ...mockState,
            messages: [new HumanMessage("Convert 10 XYZ to BRL")]
        };

        const result = await actionNode(state);
        const content = result.messages?.[0].content;
        expect(content).toContain('Error converting currency');
    });
});
