import { graph } from '../graph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// We need to mock the DB interactions to avoid side effects and control the test
jest.mock('../services/userStore', () => {
    const originalModule = jest.requireActual('../services/userStore');
    let mockDB: any = {
        'test-user-int': {
            id: 'test-user-int',
            name: 'Integration Test User',
            preferences: {},
            tasks: []
        }
    };
    return {
        ...originalModule,
        getUserProfile: jest.fn(async (id) => mockDB[id] || null),
        updateUserProfile: jest.fn(async (profile) => {
            mockDB[profile.id] = profile;
        })
    };
});

describe('Feature: Task Manager Integration', () => {
    it('should handle adding and listing tasks through the graph', async () => {
        // 1. Add Task
        const inputState: AgentState = {
            messages: [new HumanMessage("Add task Buy Groceries")],
            userId: 'test-user-int',
            sessionId: 'session-1',
            lastActive: Date.now()
        };

        const result = await graph.invoke(inputState) as AgentState;
        const lastMessage = result.messages[result.messages.length - 1] as AIMessage;

        expect(lastMessage.content).toContain('Task added');
        expect(result.userProfile?.tasks).toHaveLength(1);
        expect(result.userProfile?.tasks[0].description).toBe('Buy Groceries');

        // 2. List Tasks
        const listState: AgentState = {
            ...result, // Continue from previous state to keep profile
            messages: [...result.messages, new HumanMessage("List my tasks")]
        };

        const listResult = await graph.invoke(listState) as AgentState;
        const listMessage = listResult.messages[listResult.messages.length - 1] as AIMessage;

        expect(listMessage.content).toContain('Buy Groceries');
    }, 15000);
});
