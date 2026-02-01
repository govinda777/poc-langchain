import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from './state';
import { hydrationNode, perceptionNode, routerNode, actionNode, agentNode } from './nodes';

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
    },
});

// Add nodes
workflow.addNode('hydration', hydrationNode);
workflow.addNode('perception', perceptionNode);
workflow.addNode('action', actionNode);
workflow.addNode('agent', agentNode);

// Add edges
// Step 1: Hydrate Identity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
workflow.setEntryPoint('hydration' as any);

// Step 2: Perceive Input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
workflow.addEdge('hydration' as any, 'perception' as any);

// Step 3: Route
workflow.addConditionalEdges(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'perception' as any,
    routerNode,
    {
        action: 'action',
        response: 'agent',
    } as any // eslint-disable-line @typescript-eslint/no-explicit-any
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
workflow.addEdge('action' as any, 'agent' as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
workflow.addEdge('agent' as any, END);

// Compile
export const graph = workflow.compile();
