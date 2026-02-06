import { jest } from '@jest/globals';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

jest.mock('../../../lib/env', () => ({
  env: {
    OPENAI_API_KEY: 'sk-dummy',
    NODE_ENV: 'test'
  }
}));

jest.mock('@langchain/openai', () => ({
    ChatOpenAI: jest.fn().mockImplementation(() => ({
        invoke: jest.fn().mockResolvedValue({ content: 'Mocked Response' })
    }))
}));

import { graph } from '../graph';

// Increase timeout for integration tests
jest.setTimeout(10000);

describe('Feature: Security Gate (US02)', () => {

    it('Scenario: Unverified user requests transfer -> Denied', async () => {
        const initialState: Partial<AgentState> = {
            userId: 'user-unverified',
            messages: [new HumanMessage("Quero transferir dinheiro")],
            isVerified: false
        };

        // Cast to unknown first to avoid type issues with StateGraph compilation
        const result = await graph.invoke(initialState as any) as AgentState;

        // Assertions
        expect(result.intent).toBe('transfer');
        expect(result.securityOutcome).toBe('denied');

        const lastMessage = result.messages[result.messages.length - 1].content.toString();
        expect(lastMessage).toContain('Access Denied');
        expect(lastMessage).toContain('authenticate');
    });

    it('Scenario: Verified user requests transfer -> Approved', async () => {
        const initialState: Partial<AgentState> = {
            userId: 'user-verified',
            messages: [new HumanMessage("Quero transferir dinheiro")],
            isVerified: true
        };

        const result = await graph.invoke(initialState as any) as AgentState;

        // Assertions
        expect(result.intent).toBe('transfer');
        expect(result.securityOutcome).toBe('approved');

        // Check if action was executed
        const messages = result.messages;
        const actionMessage = messages.find((m) => m.content.toString().includes('Transfer executed successfully'));
        expect(actionMessage).toBeDefined();
    });
});
