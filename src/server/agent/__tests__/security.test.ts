import { HumanMessage } from "@langchain/core/messages";
import { graph } from "../graph";

describe('Feature: Security Gate (US02)', () => {

    it('Scenario: Unverified user attempts sensitive action (Transfer)', async () => {
        // Given
        const initialState = {
            messages: [new HumanMessage("Quero transferir dinheiro")],
            userId: "user-123",
            isVerified: false
        };

        // When
        const result = await graph.invoke(initialState);

        // Then
        // 1. Should have routed to security check
        expect(result.securityOutcome).toBe('denied');

        // 2. Should NOT have executed the action
        expect(result.messages.some((m: any) => m.content === "Tool execution simulated.")).toBe(false);

        // 3. Should have returned a refusal message
        const lastMessage = result.messages[result.messages.length - 1];
        expect(lastMessage.content).toContain("preciso que você confirme sua identidade");
    });

    it('Scenario: Verified user attempts sensitive action (Transfer)', async () => {
        // Given
        const initialState = {
            messages: [new HumanMessage("Quero transferir dinheiro")],
            userId: "user-123",
            isVerified: true
        };

        // When
        const result = await graph.invoke(initialState);

        // Then
        // 1. Should have routed to security check and passed
        expect(result.securityOutcome).toBe('approved');

        // 2. Should have executed the action (simulated)
        const actionMessage = result.messages.find((m: any) => m.content === "Tool execution simulated.");
        expect(actionMessage).toBeDefined();
    });

    it('Scenario: User asks about weather (Non-sensitive)', async () => {
        // Given
        const initialState = {
            messages: [new HumanMessage("Como está o clima?")],
            userId: "user-123",
            isVerified: false
        };

        // When
        const result = await graph.invoke(initialState);

        // Then
        // Should NOT go to security check (securityOutcome stays undefined or whatever default/previous value if we were keeping state, but here it's new run)
        expect(result.securityOutcome).toBeUndefined();

        // Should execute action directly
        const actionMessage = result.messages.find((m: any) => m.content === "Tool execution simulated.");
        expect(actionMessage).toBeDefined();
    });
});
