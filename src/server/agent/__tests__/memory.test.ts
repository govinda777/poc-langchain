import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from '../state';
import { hydrationNode, perceptionNode, routerNode, agentNode } from '../nodes';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';

// Recreate the minimal graph needed for US01 (Hydration -> Perception -> Agent)
// We skip Action node for this specific test to keep it focused on Memory/Identity
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
    workflow.addNode('perception', perceptionNode);
    workflow.addNode('agent', agentNode);

    workflow.setEntryPoint('hydration');
    workflow.addEdge('hydration', 'perception');

    // Simplified routing for test: always go to agent
    workflow.addEdge('perception', 'agent');
    workflow.addEdge('agent', END);

    return workflow.compile();
}

describe('Feature: Long-Term Memory (Context Persistence)', () => {
    let app: any;

    beforeAll(async () => {
        app = await createTestGraph();
    });

    it('Scenario: US01 - Web client, return after 1 week (Identity & Context Restoration)', async () => {
        // Given that the user João interacted in the past about an insurance proposal
        // (We simulated this by seeding 'joao-123' in the MOCK_DB with lastConversationContext)
        const userId = 'joao-123';
        const initialState = {
            userId: userId,
            messages: [new HumanMessage("Olá")]
        };

        // When he returns to access the site (The agent hydrates his profile)
        const result = await app.invoke(initialState);

        // Then the agent must have access to the previous context
        expect(result.userProfile).toBeDefined();
        expect(result.userProfile.name).toBe('João');
        expect(result.userProfile.lastConversationContext).toBe('discussed insurance proposal');

        // And the Agent should mention the context in the response
        const lastMessage = result.messages[result.messages.length - 1];
        const content = lastMessage.content.toString();

        console.log("Agent Response:", content);

        // Expect the response to contain a reference to the insurance proposal
        expect(content).toContain('insurance proposal');
    });
});
