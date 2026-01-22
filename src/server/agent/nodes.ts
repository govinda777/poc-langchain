import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage, FunctionMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { faqTool } from './tools/faq';

// Node: Hydration (Identity First)
export async function hydrationNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Hydration Node: Resolving identity...');
    const userId = state.userId || 'anonymous';
    let profile = await getUserProfile(userId);

    if (!profile) {
        console.log(`User ${userId} not found. Creating transient profile.`);
        profile = {
            id: userId,
            name: 'Visitor',
            preferences: {}
        };
    } else {
         console.log(`User ${userId} recognized as ${profile.name}.`);
         if (profile.lastConversationContext) {
             console.log(`Audit: Loaded long-term memory context for user ${userId}: "${profile.lastConversationContext}"`);
         }
    }

    return {
        userProfile: profile,
        lastActive: Date.now()
    };
}

// Node: Perception
export async function perceptionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log(`Perception Node: Processing input for ${state.userProfile?.name}...`);
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    let intent = 'general';
    if (content.includes('clima') || content.includes('weather')) {
        intent = 'weather';
    } else if (content.includes('password') || content.includes('support') || content.includes('help') || content.includes('reset') || content.includes('contact')) {
        intent = 'faq';
    }

    return {
        lastActive: Date.now(),
        intent: intent
    };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    console.log('Router Node: Deciding next step based on intent:', state.intent);

    if (state.intent === 'weather' || state.intent === 'faq') {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool for intent:', state.intent);

    if (state.intent === 'faq') {
        const lastMessage = state.messages[state.messages.length - 1];
        const query = lastMessage.content.toString();
        const result = await faqTool.invoke({ query });

        return {
            messages: [new AIMessage(result)]
        };
    }

    // Simulation of a tool execution for other intents
    return {
        messages: [new AIMessage("Tool execution simulated (Weather pending).")]
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');

    // If the last message was from the Action node (AIMessage with tool output), we might want to just return it or wrap it.
    // But currently the Action node returns an AIMessage.
    // The graph edge goes Action -> Agent.
    // If Action produced an AIMessage, Agent sees it in history.

    // Let's check if we already have an answer (from Action)
    const lastMsg = state.messages[state.messages.length - 1];
    if (state.intent === 'faq' && lastMsg instanceof AIMessage) {
        // If we just came from action and it was FAQ, we are done.
        // But the agent node logic below blindly generates a hello message.
        // We should respect the tool output.
        // In a real LLM agent, the LLM would see the ToolOutput and generate a response.
        // Here we are mocking.
        return {}; // No new message, just pass through (or maybe we want to format it?)
    }

    const lastUserMsg = state.messages[state.messages.length - 1].content;
    const name = state.userProfile?.name || "User";

    return {
        messages: [new AIMessage(`Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`)]
    };
}
