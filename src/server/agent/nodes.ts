import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { env } from '../../lib/env';
import { getUserProfile } from './services/userStore';
import { googleCalendarTool } from './tools/googleCalendar';

// Node: Hydration (Identity First)
export async function hydrationNode(state: AgentState): Promise<Partial<AgentState>> {
    const logs: string[] = [];
    console.log('Hydration Node: Resolving identity...');
    logs.push('Hydration Node: Resolving identity...');

    const userId = state.userId || 'anonymous';
    let profile = await getUserProfile(userId);

    if (!profile) {
        console.log(`User ${userId} not found. Creating transient profile.`);
        logs.push(`User ${userId} not found. Creating transient profile.`);
        profile = {
            id: userId,
            name: 'Visitor',
            preferences: {}
        };
    } else {
         console.log(`User ${userId} recognized as ${profile.name}.`);
         logs.push(`User ${userId} recognized as ${profile.name}.`);
         if (profile.lastConversationContext) {
             console.log(`Audit: Loaded long-term memory context for user ${userId}: "${profile.lastConversationContext}"`);
             logs.push(`Audit: Loaded long-term memory context for user ${userId}: "${profile.lastConversationContext}"`);
         }
    }

    return {
        userProfile: profile,
        lastActive: Date.now(),
        auditLogs: logs
    };
}

// Node: Perception
export async function perceptionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log(`Perception Node: Processing input for ${state.userProfile?.name}...`);
    const logs: string[] = [];
    logs.push(`Perception Node: Processing input for ${state.userProfile?.name}...`);

    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    let intent = 'conversation';
    if (content.includes('clima') || content.includes('weather')) {
        intent = 'weather';
    } else if (content.includes('transfer') || content.includes('pagar') || content.includes('pay')) {
        intent = 'transfer';
    } else if (['calendar', 'agenda', 'reuniao', 'meeting', 'evento', 'schedule'].some(k => content.includes(k))) {
        intent = 'calendar';
    }

    logs.push(`Perception Node: Detected intent '${intent}'`);

    return {
        lastActive: Date.now(),
        intent,
        auditLogs: logs
    };
}

// Node: Security (Gatekeeper)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    const logs: string[] = [];
    const isVerified = state.isVerified || false;
    const userId = state.userId || 'unknown';
    console.log(`Security Node: Checking verification for ${userId}...`);
    logs.push(`Security Node: Checking verification for ${userId}...`);

    let securityOutcome: 'approved' | 'denied' = 'denied';

    if (isVerified) {
        securityOutcome = 'approved';
    }

    const auditMsg = `Audit: Security Check - User ${userId}, Verified: ${isVerified}, Outcome: ${securityOutcome}`;
    console.log(auditMsg);
    logs.push(auditMsg);

    return {
        securityOutcome,
        auditLogs: logs
    };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    const intent = state.intent || 'conversation';
    console.log('Router Node: Deciding next step for intent:', intent);

    if (intent === 'weather') {
        return 'action';
    }
    if (intent === 'transfer') {
        return 'security';
    }
    if (intent === 'calendar') {
        return 'action';
    }

    // Default to responding directly
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool...');
    const logs: string[] = [];
    logs.push('Action Node: Executing tool...');

    const intent = state.intent;
    const lastMessage = state.messages[state.messages.length - 1].content.toString();
    let result = "Tool execution simulated.";

    if (intent === 'transfer') {
        result = "Audit: Transfer executed successfully.";
        logs.push(result);
    } else if (intent === 'calendar') {
        logs.push("Action: Triggering Google Calendar Tool...");
        const toolResult = await googleCalendarTool(lastMessage);
        result = `Google Calendar Tool Result: ${toolResult}`;
        logs.push(`Audit: Executed Google Calendar Tool. Result: ${toolResult}`);
    }

    return {
        messages: [new AIMessage(result)],
        auditLogs: logs
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');
    const logs: string[] = [];
    logs.push('Agent Node: Generating response...');

    // Check security outcome first
    if (state.securityOutcome === 'denied') {
        logs.push('Agent Node: Access Denied block.');
        return {
             messages: [new AIMessage("Access Denied. Please authenticate to perform this action.")],
             auditLogs: logs
        };
    }

    const name = state.userProfile?.name || "User";

    const model = new ChatOpenAI({
        apiKey: env.OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        temperature: 0
    });

    const systemMessage = new SystemMessage(
        `You are a helpful assistant named Cognitive Agent. You are talking to ${name}.`
    );

    const inputMessages = [systemMessage, ...state.messages];

    logs.push('Agent Node: Calling OpenAI...');
    const result = await model.invoke(inputMessages);
    let responseContent = result.content.toString();

    if (state.userProfile?.lastConversationContext) {
        console.log(`Audit: Integrating long-term memory into response: "${state.userProfile.lastConversationContext}"`);
        logs.push(`Audit: Integrating long-term memory into response: "${state.userProfile.lastConversationContext}"`);
        responseContent += `\n\nContinuing our discussion about: ${state.userProfile.lastConversationContext}.`;
    }

    return {
        messages: [new AIMessage(responseContent)],
        auditLogs: logs
    };
}
