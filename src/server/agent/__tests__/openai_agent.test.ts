import { jest } from '@jest/globals';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// Mock env before importing nodes
jest.mock('../../../lib/env', () => ({
  env: {
    OPENAI_API_KEY: 'sk-dummy-key',
    NODE_ENV: 'test'
  }
}));

// Mock ChatOpenAI
const mockInvoke = jest.fn();
jest.mock('@langchain/openai', () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => {
      return {
        invoke: mockInvoke
      };
    })
  };
});

// Import agentNode after mocking
import { agentNode } from '../nodes';
import { ChatOpenAI } from '@langchain/openai';

describe('Agent Node OpenAI Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockInvoke.mockResolvedValue(new AIMessage('This is a mock response from OpenAI.'));
    });

    it('should call ChatOpenAI with system message and user history', async () => {
        const state: AgentState = {
            messages: [new HumanMessage('Hello AI')],
            userProfile: { id: '1', name: 'TestUser', preferences: {} },
            sessionId: 'test-session',
            securityOutcome: 'approved'
        };

        const result = await agentNode(state);

        expect(ChatOpenAI).toHaveBeenCalledWith(expect.objectContaining({
            apiKey: 'sk-dummy-key'
        }));

        expect(mockInvoke).toHaveBeenCalled();
        const calls = mockInvoke.mock.calls[0];
        const messages = calls[0]; // First argument to invoke is messages array

        expect(messages[0]).toBeInstanceOf(SystemMessage);
        expect(messages[0].content).toContain('Cognitive Agent');
        expect(messages[1]).toBeInstanceOf(HumanMessage);
        expect(messages[1].content).toBe('Hello AI');

        expect(result.messages?.[0].content).toBe('This is a mock response from OpenAI.');
    });

    it('should append lastConversationContext if present (US01)', async () => {
        const state: AgentState = {
            messages: [new HumanMessage('Hi again')],
            userProfile: {
                id: '1',
                name: 'TestUser',
                preferences: {},
                lastConversationContext: 'previous topic'
            },
            sessionId: 'test-session',
            securityOutcome: 'approved'
        };

        mockInvoke.mockResolvedValue(new AIMessage('Hello there.'));

        const result = await agentNode(state);

        const content = result.messages?.[0].content as string;
        expect(content).toContain('Hello there.');
        expect(content).toContain('Continuing our discussion about: previous topic');
    });

    it('should block if securityOutcome is denied', async () => {
         const state: AgentState = {
            messages: [new HumanMessage('Do secret stuff')],
            userProfile: { id: '1', name: 'BadUser', preferences: {} },
            sessionId: 'test-session',
            securityOutcome: 'denied'
        };

        const result = await agentNode(state);

        // Should NOT call OpenAI
        expect(mockInvoke).not.toHaveBeenCalled();
        expect(result.messages?.[0].content).toContain('Access Denied');
    });
});
