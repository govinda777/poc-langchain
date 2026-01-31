import { StateGraph, END, CompiledStateGraph } from '@langchain/langgraph';
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

describe('Feature: Identity Unification', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let app: CompiledStateGraph<AgentState, any, any>;

    beforeAll(async () => {
        app = await createTestGraph();
    });

    it('Scenario: User recognized (Existing User)', async () => {
        // Given a user with ID "user-123" exists (we will mock this in the node/store)
        const initialState = {
            userId: 'user-123',
            messages: []
        };

        // When the graph runs
        const result = await app.invoke(initialState);

        // Then the agent state should be hydrated with the user's profile
        expect(result.userProfile).toBeDefined();
        expect(result.userProfile.name).toBe('Alice'); // We expect "Alice" for "user-123"
        expect(result.userProfile.preferences).toEqual({ theme: 'dark' });
    });

    it('Scenario: New User (Anonymous/Unknown)', async () => {
        // Given a user ID that does not exist
        const initialState = {
            userId: 'unknown-user',
            messages: []
        };

        // When the graph runs
        const result = await app.invoke(initialState);

        // Then a default profile is created
        expect(result.userProfile).toBeDefined();
        expect(result.userProfile.name).toBe('Visitor');
    });
});
