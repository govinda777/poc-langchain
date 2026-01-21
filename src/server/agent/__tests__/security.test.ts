import { securityNode } from '../nodes';
import { AgentState } from '../state';
import { BaseMessage } from '@langchain/core/messages';

const createMockState = (isVerified?: boolean): AgentState => ({
  messages: [] as BaseMessage[],
  sessionId: 'test-session',
  isVerified: isVerified,
  intent: 'transfer',
});

describe('Security Node', () => {
  it('should approve access if user is verified', async () => {
    const state = createMockState(true);
    const result = await securityNode(state);
    expect(result.securityOutcome).toBe('approved');
  });

  it('should deny access if user is NOT verified', async () => {
    const state = createMockState(false);
    const result = await securityNode(state);
    expect(result.securityOutcome).toBe('denied');
  });

  it('should deny access if verification status is undefined', async () => {
    const state = createMockState(undefined);
    const result = await securityNode(state);
    expect(result.securityOutcome).toBe('denied');
  });

  it('should log an audit message (mocked via console)', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const state = createMockState(false);
    await securityNode(state);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Audit: Security Check')
    );
    consoleSpy.mockRestore();
  });
});
