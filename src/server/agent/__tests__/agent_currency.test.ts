import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';

describe('Agent Currency Flow', () => {
    it('should route to action and return dollar rate', async () => {
        const result = await graph.invoke({
            messages: [new HumanMessage('Qual o valor do dolar?')],
            userId: 'test-user'
        }) as any;

        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('R$ 5.00');
    });
});
