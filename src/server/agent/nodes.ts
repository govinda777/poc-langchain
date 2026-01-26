import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';

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
    // Here we could normalize input, check safety, etc.
    return { lastActive: Date.now() };
}

// Node: Security Gate (US02)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Security Node: Checking verification status...');
    if (state.isVerified) {
        console.log('Audit: Sensitive action approved. User is verified.');
        return { securityOutcome: 'approved' };
    } else {
        console.log('Audit: Sensitive action denied. User NOT verified.');
        return {
            securityOutcome: 'denied',
            messages: [new AIMessage("Security Alert: Sensitive action detected. Please verify your identity to proceed.")]
        };
    }
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    console.log('Router Node: Deciding next step for:', content);

    const sensitiveKeywords = ['transfer', 'buy', 'pay', 'pagar', 'transferir', 'comprar'];
    if (sensitiveKeywords.some(keyword => content.includes(keyword))) {
        return 'security';
    }

    if (content.includes('clima') || content.includes('weather')) {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(_state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool...');
    // Simulation of a tool execution
    return {
        // We would append a ToolMessage here
        messages: [new AIMessage("Tool execution simulated.")]
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');
    const lastUserMsg = state.messages[state.messages.length - 1].content;
    const name = state.userProfile?.name || "User";

    return {
        messages: [new AIMessage(`Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`)]
    };
}
