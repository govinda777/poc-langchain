import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// Mock User object structure as expected by AgentState (from Privy)
const mockUser = {
    id: 'user-1',
    // ... other fields are optional for this test
} as any;

describe('Agent Identity & Memory', () => {
    it('should recognize a returning user and greet them by name', async () => {
        // Given
        const inputs: Partial<AgentState> = {
            messages: [new HumanMessage("Hello, I'm back!")],
            user: mockUser,
            sessionId: 'test-session-1'
        };

        // When
        const finalState = await graph.invoke(inputs);

        // Then
        const lastMessage = finalState.messages[finalState.messages.length - 1];
        const content = lastMessage.content.toString();

        console.log('Bot response:', content);

        expect(content).toContain('Hello, Alice!');
        expect(finalState.userProfile).toBeDefined();
        expect(finalState.userProfile?.name).toBe('Alice');
    });

    it('should handle anonymous users gracefully', async () => {
        // Given
        const inputs: Partial<AgentState> = {
            messages: [new HumanMessage("Hi there!")],
            user: undefined,
            sessionId: 'test-session-anon'
        };

        // When
        const finalState = await graph.invoke(inputs);

        // Then
        const lastMessage = finalState.messages[finalState.messages.length - 1];
        const content = lastMessage.content.toString();

        expect(content).toContain('I am the Cognitive Agent.');
        expect(content).not.toContain('Hello, undefined');
        expect(finalState.userProfile).toBeUndefined();
    });
});
