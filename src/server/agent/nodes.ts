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
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    let intent = 'general';
    const sensitiveKeywords = ['transferencia', 'transfer', 'pagar', 'pay', 'buy', 'comprar'];
    const weatherKeywords = ['clima', 'weather'];

    if (sensitiveKeywords.some(kw => content.includes(kw))) {
        intent = 'transfer';
    } else if (weatherKeywords.some(kw => content.includes(kw))) {
        intent = 'weather';
    }

    return {
        lastActive: Date.now(),
        intent
    };
}

// Node: Security
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log(`Security Node: Checking security for intent "${state.intent}"...`);

    // Sensitive intents require verification
    const sensitiveIntents = ['transfer'];

    if (sensitiveIntents.includes(state.intent || '')) {
        if (!state.isVerified) {
            console.log('Audit: Security Check - User NOT verified for sensitive action. Outcome: Denied.');
            return { securityOutcome: 'denied' };
        } else {
             console.log('Audit: Security Check - User verified for sensitive action. Outcome: Approved.');
             return { securityOutcome: 'approved' };
        }
    }

    console.log('Audit: Security Check - Action not sensitive. Outcome: Approved.');
    return { securityOutcome: 'approved' };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    // Security check shortcut
    if (state.securityOutcome === 'denied') {
        console.log('Router Node: Security denied. Routing to response.');
        return 'response';
    }

    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    console.log('Router Node: Deciding next step for:', content);

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

    if (state.securityOutcome === 'denied') {
        return {
            messages: [new AIMessage("Authentication required for this action. Please verify your identity.")]
        };
    }

    const lastUserMsg = state.messages[state.messages.length - 1].content;
    const name = state.userProfile?.name || "User";

    let response = `Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`;

    if (state.userProfile?.lastConversationContext) {
        console.log(`Audit: Integrating long-term memory into response: "${state.userProfile.lastConversationContext}"`);
        response += `\n\nContinuing our discussion about: ${state.userProfile.lastConversationContext}.`;
    }

    return {
        messages: [new AIMessage(response)]
    };
}
