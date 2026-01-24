import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from '../state';
import { hydrationNode, perceptionNode, routerNode, securityNode, actionNode, agentNode } from '../nodes';
import { HumanMessage } from "@langchain/core/messages";

// Mock graph construction for testing integration of security
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
            user: {
                 reducer: (a, b) => b ?? a,
                 default: () => undefined,
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
            isVerified: {
                reducer: (a, b) => b ?? a,
                default: () => false,
            },
            securityOutcome: {
                reducer: (a, b) => b ?? a,
            }
        },
    });

    // Add nodes
    workflow.addNode('hydration', hydrationNode);
    workflow.addNode('perception', perceptionNode);
    workflow.addNode('security', securityNode);
    workflow.addNode('action', actionNode);
    workflow.addNode('agent', agentNode);

    // Set Entry
    workflow.setEntryPoint('hydration');

    // Edges
    workflow.addEdge('hydration', 'perception');

    workflow.addConditionalEdges(
        'perception',
        routerNode,
        {
            action: 'action',
            security: 'security',
            response: 'agent',
        }
    );

    // Security Logic
    workflow.addConditionalEdges(
        'security',
        (state) => state.securityOutcome === 'approved' ? 'action' : 'agent',
        {
            action: 'action',
            agent: 'agent'
        }
    );

    workflow.addEdge('action', 'agent');
    workflow.addEdge('agent', END);

    return workflow.compile();
}

describe('Feature: Security Gate (US02)', () => {
    let app: any;

    beforeAll(async () => {
        app = await createSecurityTestGraph();
    });

    it('Scenario: Unverified user requests transfer -> Denied', async () => {
        const initialState = {
            userId: 'user-unverified',
            messages: [new HumanMessage("Quero fazer um pix de 100 reais")],
            isVerified: false
        };

        const result = await app.invoke(initialState);

        expect(result.securityOutcome).toBe('denied');
        const lastMsg = result.messages[result.messages.length - 1];
        // If denied, we expect the agent to respond with Auth required.
        // Or the security node to add a system message.
        // We will implement securityNode to add "Authentication required".
        // And then agentNode might wrap it or just return it.
        // Let's check if "Authentication required" is in the conversation.
        const authMsg = result.messages.find((m: any) => m.content.includes('Authentication required'));
        expect(authMsg).toBeDefined();
    });

    it('Scenario: Verified user requests transfer -> Approved', async () => {
        const initialState = {
            userId: 'user-verified',
            messages: [new HumanMessage("Quero fazer um pix de 100 reais")],
            isVerified: true
        };

        const result = await app.invoke(initialState);

        expect(result.securityOutcome).toBe('approved');
        const toolMsg = result.messages.find((m: any) => m.content === 'Tool execution simulated.');
        expect(toolMsg).toBeDefined();
    });
});
