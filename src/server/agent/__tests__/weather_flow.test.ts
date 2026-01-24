import { routerNode, actionNode } from '../nodes';
import { AgentState } from '../state';
import { HumanMessage } from '@langchain/core/messages';

describe('Weather Flow Integration', () => {
    it('should route "clima" requests to actionNode and return weather info', async () => {
        // 1. Setup State
        const state: AgentState = {
            messages: [new HumanMessage("Qual o clima em São Paulo?")],
            userProfile: { id: 'test', name: 'Tester', preferences: {} },
            userId: 'test',
            intent: '',
            lastActive: Date.now(),
            isVerified: true,
            securityOutcome: 'approved'
        };

        // 2. Test Router
        const route = await routerNode(state);
        expect(route).toBe('action');

        // 3. Test Action
        const actionResult = await actionNode(state);
        const lastMsg = actionResult.messages?.[0];

        expect(lastMsg).toBeDefined();
        expect(lastMsg?.content.toString()).toContain('A previsão do tempo');
        expect(lastMsg?.content.toString()).toContain('São Paulo');
    });
});
