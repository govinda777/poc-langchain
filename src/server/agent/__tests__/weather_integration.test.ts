import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

describe('Weather Integration Test', () => {
    // Increase timeout for graph execution
    jest.setTimeout(10000);

    it('should route to weather tool and return weather for Rio de Janeiro', async () => {
        const inputState: Partial<AgentState> = {
            messages: [new HumanMessage('What is the weather in Rio de Janeiro?')],
            sessionId: 'test-session-weather',
            userId: 'test-user-weather'
        };

        const result = await graph.invoke(inputState) as AgentState;

        // Check if the conversation history contains the weather info
        const allContent = result.messages.map(m => m.content.toString()).join('\n');
        expect(allContent).toContain('30°C, Sunny');
    });

    it('should route to weather tool and return weather for London (case insensitive)', async () => {
         const inputState: Partial<AgentState> = {
            messages: [new HumanMessage('clima em London')],
            sessionId: 'test-session-london',
            userId: 'test-user-london'
        };

        const result = await graph.invoke(inputState) as AgentState;
        const allContent = result.messages.map(m => m.content.toString()).join('\n');
        expect(allContent).toContain('15°C, Cloudy');
    });
});
