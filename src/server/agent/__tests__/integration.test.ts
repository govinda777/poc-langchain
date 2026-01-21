import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';

describe('Agent Graph Integration', () => {
  it('should route "transfer" intent to security node and approve if verified', async () => {
    const initialState = {
      messages: [new HumanMessage('I want to transfer money')],
      isVerified: true,
      sessionId: 'test-integration-1',
    };

    const result = await graph.invoke(initialState);

    // Check if security node was visited and approved
    expect(result.securityOutcome).toBe('approved');
    // Check if it reached the end (which implies passing through agent)
    expect(result.messages.length).toBeGreaterThan(1); // Input + Response
  });

  it('should route "transfer" intent to security node and deny if NOT verified', async () => {
    const initialState = {
      messages: [new HumanMessage('I want to transfer money')],
      isVerified: false,
      sessionId: 'test-integration-2',
    };

    const result = await graph.invoke(initialState);

    // Check if security node was visited and denied
    expect(result.securityOutcome).toBe('denied');
    const lastMessage = result.messages[result.messages.length - 1];
    expect(lastMessage.content).toContain('Access denied');
  });

  it('should route normal conversation directly to agent (bypass security)', async () => {
    const initialState = {
      messages: [new HumanMessage('Hello there')],
      sessionId: 'test-integration-3',
    };

    const result = await graph.invoke(initialState);

    // Security outcome should be undefined as it was skipped
    expect(result.securityOutcome).toBeUndefined();
  });
});
