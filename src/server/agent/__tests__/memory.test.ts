import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from '../state';
import { hydrationNode } from '../nodes';

// Mock implementation of a simple graph just for testing the node
async function createTestGraph() {
    const workflow = new StateGraph<AgentState>({
        channels: {
            messages: {
                reducer: (a, b) => a.concat(b),
                default: () => [],
            },
            userProfile: {
                reducer: (a, b) => b ?? a,
                default: () => undefined,
            },
            userId: {
                 reducer: (a, b) => b ?? a,
                 default: () => "anonymous",
            },
            sessionId: {
                reducer: (a, b) => b ?? a,
                default: () => "default",
            },
            intent: {
                reducer: (a, b) => b ?? a,
            },
            lastActive: {
                reducer: (a, b) => b ?? a,
            },
             user: {
                 reducer: (a, b) => b ?? a,
                 default: () => undefined
             }
        },
    });

    workflow.addNode('hydration', hydrationNode);
    workflow.setEntryPoint('hydration');
    workflow.addEdge('hydration', END);

    return workflow.compile();
}

describe('Feature: Long-Term Memory (Context Persistence)', () => {
    let app: any;

    beforeAll(async () => {
        app = await createTestGraph();
    });

    it('Scenario: US01 - Web client, return after 1 week', async () => {
        // Given that the user João interacted in the past about an insurance proposal
        // (We simulated this by seeding 'joao-123' in the MOCK_DB with lastConversationContext)
        const userId = 'joao-123';
        const initialState = {
            userId: userId,
            messages: []
        };

        // When he returns to access the site (The agent hydrates his profile)
        const result = await app.invoke(initialState);

        // Then the agent must have access to the previous context
        expect(result.userProfile).toBeDefined();
        expect(result.userProfile.name).toBe('João');
        expect(result.userProfile.lastConversationContext).toBe('discussed insurance proposal');
    });
});
