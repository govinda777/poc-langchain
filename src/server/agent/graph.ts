import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from './state';
import { perceptionNode, routerNode, actionNode, agentNode, hydrationNode } from './nodes';

// Define the graph
const workflow = new StateGraph<AgentState>({
    channels: {
        messages: {
            reducer: (a, b) => a.concat(b),
            default: () => [],
        },
        user: {
            reducer: (a, b) => b ?? a,
            default: () => undefined,
        },
        userProfile: {
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
workflow.setEntryPoint('hydration');
workflow.addEdge('hydration', 'perception');

workflow.addConditionalEdges(
    'perception',
    routerNode,
    {
        action: 'action',
        response: 'agent',
    }
);

workflow.addEdge('action', 'agent'); // After action, go back to agent to generate response
workflow.addEdge('agent', END);

// Compile
export const graph = workflow.compile();
