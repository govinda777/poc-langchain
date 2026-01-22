import { graph } from '../graph';
import { HumanMessage } from "@langchain/core/messages";

describe('Feature: US03 Tech Support (FAQ Integration)', () => {
    it('should route password questions to FAQ tool', async () => {
        const initialState = {
            messages: [new HumanMessage("How do I reset my password?")],
            sessionId: "test-faq",
        };

        const result = await graph.invoke(initialState);

        // Expect intent to be detected
        expect(result.intent).toBe('faq');

        // Expect response from FAQ tool
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('settings page');
    });

    it('should route general questions to general agent', async () => {
        const initialState = {
            messages: [new HumanMessage("Hello there")],
            sessionId: "test-general",
        };

        const result = await graph.invoke(initialState);

        // Expect intent to be general (default)
        // Or explicitly 'general' if perception sets it (it does)
        expect(result.intent).toBe('general');

        // Expect generic response
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain('Cognitive Agent');
    });
});
