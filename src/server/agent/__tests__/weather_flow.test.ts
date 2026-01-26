import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// We need to increase timeout for integration tests potentially
jest.setTimeout(10000);

describe('Weather Flow Integration', () => {
    it('should route to action and return weather when asked', async () => {
        const inputState: Partial<AgentState> = {
            messages: [new HumanMessage("What is the weather in Paris?")],
            userId: "test-user"
        };

        const result = await graph.invoke(inputState as any);

        const messages = result.messages;
        const weatherMsg = messages.find((m: any) => m.content.toString().includes("Weather Report"));

        expect(weatherMsg).toBeDefined();
        expect(weatherMsg?.content).toContain("Paris");
    });

    it('should not trigger weather tool for unrelated queries', async () => {
        const inputState: Partial<AgentState> = {
             messages: [new HumanMessage("Hello, who are you?")],
             userId: "test-user"
        };

        const result = await graph.invoke(inputState as any);
        const messages = result.messages;

        const weatherMsg = messages.find((m: any) => m.content.toString().includes("Weather Report"));
        expect(weatherMsg).toBeUndefined();
    });
});
