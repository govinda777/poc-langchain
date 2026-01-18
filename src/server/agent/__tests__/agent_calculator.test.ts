import { actionNode } from '../nodes';
import { AgentState } from '../state';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

describe('Agent Calculator Integration', () => {
  it('should process "calc: add 10 20" correctly', async () => {
    const mockState: AgentState = {
      messages: [new HumanMessage("calc: add 10 20")],
      sessionId: "test-session",
    };

    const result = await actionNode(mockState);

    // actionNode returns a Partial<AgentState> which may contain messages
    expect(result.messages).toBeDefined();
    expect(result.messages![0].content).toContain("Calculation Result: 30");
  });

  it('should handle errors in calculation', async () => {
     const mockState: AgentState = {
      messages: [new HumanMessage("calc: divide 10 0")],
      sessionId: "test-session",
    };

    const result = await actionNode(mockState);
    expect(result.messages![0].content).toContain("Error: Division by zero");
  });
});
