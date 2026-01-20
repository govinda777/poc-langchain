import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';

describe('Agent Calculator Integration', () => {
    // Increase timeout because graph execution might be slightly slow
    jest.setTimeout(10000);

    it('should correctly route and calculate "sum 5 10"', async () => {
        const input = {
            messages: [new HumanMessage("Please calculate sum 5 10")],
            userId: 'user-123'
        };

        const result = await graph.invoke(input);
        const lastMessage = result.messages[result.messages.length - 1];

        // The final response comes from agentNode, wrapping the actionNode output
        expect(lastMessage.content).toContain('15');
    });

    it('should correctly calculate "multiply 10 10"', async () => {
         const input = {
            messages: [new HumanMessage("multiply 10 10")],
            userId: 'user-123'
        };

        const result = await graph.invoke(input);
        const lastMessage = result.messages[result.messages.length - 1];

        expect(lastMessage.content).toContain('100');
    });
});
