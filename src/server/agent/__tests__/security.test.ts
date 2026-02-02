import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// Integration Tests for US02 (Security Gate)
describe('US02: Security Gate', () => {
    // 10s timeout for async graph operations
    jest.setTimeout(10000);

    it('should deny sensitive action if user is NOT verified', async () => {
        const inputState: Partial<AgentState> = {
            messages: [new HumanMessage("Quero fazer uma transferencia")],
            userId: 'user-123',
            isVerified: false,
            sessionId: 'test-session-1'
        };

        const result = await graph.invoke(inputState) as AgentState;

        // Check if intent was detected
        expect(result.intent).toBe('transfer');

        // Check security outcome
        expect(result.securityOutcome).toBe('denied');

        // Check agent response
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('Authentication required');
    });

    it('should approve sensitive action if user IS verified', async () => {
        const inputState: Partial<AgentState> = {
            messages: [new HumanMessage("Quero fazer uma transferencia")],
            userId: 'user-123',
            isVerified: true,
            sessionId: 'test-session-2'
        };

        const result = await graph.invoke(inputState) as AgentState;

        expect(result.intent).toBe('transfer');
        expect(result.securityOutcome).toBe('approved');

        // Response should not be the auth required message
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).not.toContain('Authentication required');
    });

    it('should allow non-sensitive action without verification', async () => {
         const inputState: Partial<AgentState> = {
            messages: [new HumanMessage("Ola, tudo bem?")],
            userId: 'user-123',
            isVerified: false, // Not verified
            sessionId: 'test-session-3'
        };

        const result = await graph.invoke(inputState) as AgentState;

        expect(result.intent).not.toBe('transfer');
        expect(result.securityOutcome).toBe('approved');
    });
});
