import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state';

// Increase timeout for integration tests
jest.setTimeout(10000);

describe('Feature: Google Calendar Integration (US-Calendar)', () => {

    it('Scenario: User requests to schedule a meeting -> Tool triggered', async () => {
        const initialState: Partial<AgentState> = {
            userId: 'user-calendar',
            messages: [new HumanMessage("Please schedule a meeting for tomorrow")],
            isVerified: true
        };

        // Invoke the graph
        const result = await graph.invoke(initialState as any) as AgentState;

        // Verify Intent
        expect(result.intent).toBe('calendar');

        // Verify Audit Logs (Observability)
        const logs = result.auditLogs || [];
        expect(logs.some(l => l.includes("Perception Node: Detected intent 'calendar'"))).toBe(true);
        expect(logs.some(l => l.includes("Action: Triggering Google Calendar Tool..."))).toBe(true);
        expect(logs.some(l => l.includes("Audit: Executed Google Calendar Tool"))).toBe(true);

        // Verify Tool Output in Messages
        // The action node pushes a message with the result
        const toolMsg = result.messages.find(m => m.content.toString().includes('Google Calendar Tool Result'));
        expect(toolMsg).toBeDefined();
        expect(toolMsg?.content).toContain('SUCCESS');
    });

    it('Scenario: User requests to list events -> Tool triggered', async () => {
        const initialState: Partial<AgentState> = {
            userId: 'user-calendar-list',
            messages: [new HumanMessage("List my agenda events")],
        };

        const result = await graph.invoke(initialState as any) as AgentState;

        expect(result.intent).toBe('calendar');

        const logs = result.auditLogs || [];
        expect(logs.some(l => l.includes('Triggering Google Calendar Tool'))).toBe(true);

        const toolMsg = result.messages.find(m => m.content.toString().includes('Google Calendar Tool Result'));
        expect(toolMsg).toBeDefined();
        // The mock returns a JSON list including "Daily Standup"
        expect(toolMsg?.content).toContain('Daily Standup');
    });
});
