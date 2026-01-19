import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from './state';
import { hydrationNode, perceptionNode, routerNode, actionNode, agentNode, securityNode } from './nodes';

// Define the graph
const workflow = new StateGraph<AgentState>({
    channels: {
        messages: {
            reducer: (a, b) => a.concat(b),
            default: () => [],
        },
        userId: {
            reducer: (a, b) => b ?? a,
            default: () => undefined,
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

// Add edges
// Step 1: Hydrate Identity
workflow.setEntryPoint('hydration');

// Step 2: Perceive Input
workflow.addEdge('hydration', 'perception');

// Step 3: Route
workflow.addConditionalEdges(
    'perception',
    routerNode,
    {
        sensitive: 'security',
        action: 'action',
        response: 'agent',
    }
);

// Step 4: Security Check
workflow.addConditionalEdges(
    'security',
    (state) => state.securityOutcome === 'approved' ? 'approved' : 'denied',
    {
        approved: 'action',
        denied: 'agent',
    }
);

workflow.addEdge('action', 'agent'); // After action, go back to agent to generate response
workflow.addEdge('agent', END);

// Compile
export const graph = workflow.compile();
