import { actionNode, routerNode } from '../nodes';
import { AgentState } from '../state';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

describe('Calculator Integration', () => {
    it('router should route math request to action', async () => {
        const state: AgentState = {
            messages: [new HumanMessage('calculate 2 + 2')],
            sessionId: 'test'
        };
        const route = await routerNode(state);
        expect(route).toBe('action');
    });

    it('actionNode should perform calculation', async () => {
        const state: AgentState = {
            messages: [new HumanMessage('calculate 2 + 2')],
            sessionId: 'test'
        };
        const result = await actionNode(state);
        const msg = result.messages![0] as AIMessage;
        expect(msg.content).toContain('4');
    });
});
