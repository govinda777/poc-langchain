import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from '../state';
import { hydrationNode, perceptionNode, securityNode, routerNode, agentNode } from '../nodes';
import { BaseMessage, HumanMessage } from "@langchain/core/messages";

// We'll construct a graph that mimics the production topology for the security slice
// hydration -> perception -> security -> router -> (action/agent)
async function createSecurityTestGraph() {
    const workflow = new StateGraph<AgentState>({
        channels: {
            messages: {
                reducer: (a, b) => a.concat(b),
                default: () => [],
            },
            userId: {
                 reducer: (a, b) => b ?? a,
                 default: () => "anonymous",
            },
            userProfile: {
                 reducer: (a, b) => b ?? a,
                 default: () => undefined,
            },
            sessionId: {
                reducer: (a, b) => b ?? a,
                default: () => "test-session",
            },
            intent: {
                reducer: (a, b) => b ?? a,
            },
            lastActive: {
                reducer: (a, b) => b ?? a,
            },
            isVerified: {
                reducer: (a, b) => b ?? a,
                default: () => false,
            },
            securityOutcome: {
                reducer: (a, b) => b ?? a,
                default: () => 'pending',
            },
            user: {
                 reducer: (a, b) => b ?? a,
                 default: () => undefined
             }
        },
    });

    workflow.addNode('hydration', hydrationNode);
    workflow.addNode('perception', perceptionNode);
    workflow.addNode('security', securityNode);
    workflow.addNode('agent', agentNode);
    // Mock action node for test
    workflow.addNode('action', async (state) => ({ messages: [new HumanMessage("Action executed")] }));

    workflow.setEntryPoint('hydration');
    workflow.addEdge('hydration', 'perception');
    workflow.addEdge('perception', 'security');

    // Use routerNode as conditional edge, matching production
    workflow.addConditionalEdges(
        'security',
        routerNode,
        {
            action: 'action',
            response: 'agent',
        }
    );

    workflow.addEdge('action', 'agent');
    workflow.addEdge('agent', END);

    return workflow.compile();
}

describe('User Story US02: Security Gate for Sensitive Actions', () => {
    let app: any;

    beforeAll(async () => {
        // Note: This will fail to compile until securityNode is implemented and exported
        app = await createSecurityTestGraph();
    });

    it('Scenario: Unverified user attempts transfer -> Denied', async () => {
        // Given
        const initialState = {
            userId: 'user-hacker',
            messages: [new HumanMessage("Quero fazer uma transferencia")],
            isVerified: false
        };

        // When
        const result = await app.invoke(initialState);

        // Then
        expect(result.intent).toContain('transfer'); // Perception should detect it
        expect(result.securityOutcome).toBe('denied');

        // And the agent should ask for authentication
        const lastMsg = result.messages[result.messages.length - 1].content;
        expect(lastMsg).toMatch(/autentique-se|authenticate/i);
    });

    it('Scenario: Verified user attempts transfer -> Approved', async () => {
        // Given
        const initialState = {
            userId: 'user-valid',
            messages: [new HumanMessage("Quero transferir 100 reais")],
            isVerified: true
        };

        // When
        const result = await app.invoke(initialState);

        // Then
        expect(result.intent).toContain('transfer');
        expect(result.securityOutcome).toBe('approved');

        // And the agent should NOT ask for authentication (it might say something else, or execute tool)
        const lastMsg = result.messages[result.messages.length - 1].content;
        expect(lastMsg).not.toMatch(/autentique-se|authenticate/i);
    });
});
