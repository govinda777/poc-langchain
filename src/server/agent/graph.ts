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
workflow.addNode('action', actionNode);
workflow.addNode('agent', agentNode);
workflow.addNode('security', securityNode);

// Add edges
// Step 1: Hydrate Identity
workflow.setEntryPoint('hydration' as any);

// Step 2: Perceive Input
workflow.addEdge('hydration' as any, 'perception' as any);

// Step 3: Route
workflow.addConditionalEdges(
    'perception' as any,
    routerNode,
    {
        action: 'action',
        response: 'agent',
        security: 'security',
    } as any
);

// Step 4: Security Gate
workflow.addConditionalEdges(
    'security' as any,
    (state) => state.securityOutcome || 'denied',
    {
        approved: 'action',
        denied: 'agent',
    } as any
);

workflow.addEdge('action' as any, 'agent' as any); // After action, go back to agent to generate response
workflow.addEdge('agent' as any, END);

// Compile
export const graph = workflow.compile();
