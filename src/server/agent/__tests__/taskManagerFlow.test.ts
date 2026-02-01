import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// We need to increase timeout because of the async nature and potential delays
jest.setTimeout(10000);

describe('Task Manager Integration (US07)', () => {
    test('should process "add task" request', async () => {
        const initialState: AgentState = {
            messages: [new HumanMessage("add task Buy groceries")],
            sessionId: "test-session-task",
            userId: "user-123" // existing mock user
        };

        const result = await graph.invoke(initialState) as unknown as AgentState;

        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('Task added');
        expect(lastMessage.content.toLowerCase()).toContain('buy groceries');
    });

    test('should process "list tasks" request', async () => {
        // First add a task
        const addState: AgentState = {
            messages: [new HumanMessage("add task Pay bills")],
            sessionId: "test-session-task-2",
            userId: "user-456"
        };
        await graph.invoke(addState);

        // Then list them
        const listState: AgentState = {
            messages: [new HumanMessage("list tasks")],
            sessionId: "test-session-task-2",
            userId: "user-456"
        };

        const result = await graph.invoke(listState) as unknown as AgentState;
        const lastMessage = result.messages[result.messages.length - 1];

        expect(lastMessage.content.toLowerCase()).toContain('pay bills');
    });
});
