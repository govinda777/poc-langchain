import { HumanMessage } from '@langchain/core/messages';
import { graph } from '../graph';

describe('Feature: Security Gate (US02)', () => {

    it('Scenario: Deny Unverified Request (Transfer)', async () => {
        // Given that the user is NOT verified
        const initialState = {
            userId: 'user-unverified',
            messages: [new HumanMessage("Quero transferir 100 reais")],
            isVerified: false
        };

        // When the agent processes the request
        // Cast to any because of StateGraph type complexity in tests
        const result = await graph.invoke(initialState) as any;

        // Then it should be denied
        expect(result.securityOutcome).toBe('denied');

        // And the last message should ask for authentication
        // The graph goes: hydration -> perception -> router (security) -> security (denied) -> agent (response)
        // Agent node appends a response. Security node appends a denial message.
        // Let's check if the denial message is present in the history.
        const messages = result.messages;
        const denialMessage = messages.find((m: any) => m.content.includes('Action denied'));
        expect(denialMessage).toBeDefined();
    });

    it('Scenario: Allow Verified Request (Transfer)', async () => {
        // Given that the user IS verified
        const initialState = {
            userId: 'user-verified',
            messages: [new HumanMessage("Quero transferir 100 reais")],
            isVerified: true
        };

        // When the agent processes the request
        const result = await graph.invoke(initialState) as any;

        // Then it should be approved
        expect(result.securityOutcome).toBe('approved');

        // And it should have reached the action node (simulated by tool execution message)
        // Graph: hydration -> perception -> router (security) -> security (approved) -> action -> agent
        const messages = result.messages;
        const toolExecution = messages.find((m: any) => m.content === 'Tool execution simulated.');
        expect(toolExecution).toBeDefined();
    });
});
