import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from '../state';
import { hydrationNode, perceptionNode, routerNode, actionNode, agentNode } from '../nodes';
import { HumanMessage } from '@langchain/core/messages';

async function createToolTestGraph() {
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
    workflow.addNode('action', actionNode);
    workflow.addNode('agent', agentNode);

    workflow.setEntryPoint('hydration');
    workflow.addEdge('hydration', 'perception');

    // Use routerNode as a conditional edge from perception
    // Note: In the real app, this might be separate, but here we invoke routerNode logic
    // We bind the routerNode function to the ConditionalEdge

    workflow.addConditionalEdges(
        'perception',
        routerNode,
        {
            action: 'action',
            response: 'agent'
        }
    );

    workflow.addEdge('action', END);
    workflow.addEdge('agent', END);

    return workflow.compile();
}

describe('Feature: Tool Execution (Unit Converter)', () => {
    let app: any;

    beforeAll(async () => {
        app = await createToolTestGraph();
    });

    it('Scenario: US08 - User asks for unit conversion', async () => {
        // Given the user asks to convert units
        const initialState = {
            userId: 'test-user',
            messages: [new HumanMessage("Converte 10 km para m")]
        };

        // When the agent processes the message
        const result = await app.invoke(initialState);

        // Then the router should route to action
        // And the action node should execute the conversion
        const lastMessage = result.messages[result.messages.length - 1];
        const content = lastMessage.content.toString();

        console.log("Agent Response:", content);

        expect(content).toContain('Conversion Result: 10000 m');
    });

    it('Scenario: User asks for unsupported conversion', async () => {
        const initialState = {
            userId: 'test-user',
            messages: [new HumanMessage("Converte 10 km para liter")]
        };

        const result = await app.invoke(initialState);
        const lastMessage = result.messages[result.messages.length - 1];

        // Should catch the error
        expect(lastMessage.content).toContain('Error: Unsupported conversion');
    });

    it('Scenario: User asks general question (Router -> Agent)', async () => {
         const initialState = {
            userId: 'test-user',
            messages: [new HumanMessage("Hello")]
        };

        const result = await app.invoke(initialState);
        // Should go to agent node
        expect(result.messages[result.messages.length - 1].content).toContain("Hello Visitor");
    });
});
