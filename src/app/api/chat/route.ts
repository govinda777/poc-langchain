import { NextRequest, NextResponse } from 'next/server';
import { graph } from '@/server/agent/graph';
import { HumanMessage } from '@langchain/core/messages';
import { AgentState } from '@/server/agent/state';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, sessionId } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const inputs = {
            messages: [new HumanMessage(message)],
            sessionId: sessionId || 'default',
        };

        const config = { configurable: { thread_id: sessionId || 'default' } };

        // Run the graph
        // The outputs type depends on your graph state
        // Cast to AgentState to fix TypeScript error
        const result = await graph.invoke(inputs, config) as unknown as AgentState;

        if (!result.messages || result.messages.length === 0) {
            return NextResponse.json({ response: 'No response generated.' });
        }

        const lastMessage = result.messages[result.messages.length - 1];
        const response = lastMessage.content;

        return NextResponse.json({ response, agentState: result });
    } catch (error: any) {
        console.error('Error in chat API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
