import { graph } from '../graph';
import { HumanMessage } from "@langchain/core/messages";

describe('US01: Web Client Return (Identity & Memory)', () => {

    it('Scenario: Returning user João is recognized and context is recalled', async () => {
        // Given that the user "joao-web" has a history (simulated in userStore)
        // And the user initiates a new session
        const input = {
            userId: 'joao-web',
            messages: [new HumanMessage("Olá, estou de volta.")]
        };

        // When the agent processes the message
        const result = await graph.invoke(input);
        const lastMessage = result.messages[result.messages.length - 1];
        const responseText = lastMessage.content.toString();

        // Then the agent should greet him by name
        expect(responseText).toContain("João");

        // And the agent should mention the previous context "insurance proposal"
        // (This relies on the implementation we are about to do)
        expect(responseText.toLowerCase()).toContain("insurance proposal");
    });
});
