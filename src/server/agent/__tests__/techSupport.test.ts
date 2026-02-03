import { createSupportTicket } from '../tools/techSupport';
import { perceptionNode, routerNode } from '../nodes';
import { AgentState } from '../state';
import { HumanMessage } from '@langchain/core/messages';

describe('US03: Tech Support Feature', () => {
  describe('Tool: createSupportTicket', () => {
    it('should create a ticket with a unique ID', () => {
      const ticket = createSupportTicket("System crashed");
      expect(ticket).toHaveProperty('id');
      expect(ticket.description).toBe("System crashed");
      expect(ticket.status).toBe('open');
    });
  });

  describe('Agent Workflow Integration', () => {
    let state: AgentState;

    beforeEach(() => {
        state = {
            messages: [new HumanMessage("Encontrei um bug no sistema")],
            userProfile: { id: "test", name: "TestUser", preferences: {} },
            userId: "test-user-id",
            intent: "conversation", // default
            securityOutcome: 'approved',
            isVerified: true,
            lastActive: Date.now()
        } as unknown as AgentState;
    });

    it('Perception Node should detect tech_support intent', async () => {
        const result = await perceptionNode(state);
        expect(result.intent).toBe('tech_support');
    });

    it('Router Node should route tech_support to action', async () => {
        state.intent = 'tech_support';
        const result = await routerNode(state);
        expect(result).toBe('action');
    });
  });
});
