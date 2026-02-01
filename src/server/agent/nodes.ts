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
    const lastMessage = state.messages[state.messages.length - 1].content.toString().toLowerCase();

    let intent = 'general';
    // US02: Detect sensitive intents
    if (lastMessage.includes('transfer') || lastMessage.includes('pagar') || lastMessage.includes('buy')) {
        intent = 'transfer';
    } else if (lastMessage.includes('clima') || lastMessage.includes('weather')) {
        intent = 'weather';
    }

    console.log(`Perception Node: Identified intent '${intent}'`);
    return { lastActive: Date.now(), intent };
}

// Node: Security (US02)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Security Node: Checking authorization...');
    const sensitiveIntents = ['transfer', 'buy']; // 'transfer' covers 'pagar'/'buy' mapped in perception
    const isSensitive = sensitiveIntents.includes(state.intent || '');

    let outcome: 'approved' | 'denied' | 'pending' = 'approved';

    if (isSensitive) {
        if (state.isVerified) {
             console.log(`Audit: Security Check - User ${state.userId} is verified. Action approved.`);
             outcome = 'approved';
        } else {
             console.log(`Audit: Security Check - User ${state.userId} NOT verified. Action denied.`);
             outcome = 'denied';
        }
    } else {
        console.log('Audit: Security Check - Intent is not sensitive. Approved.');
    }

    return { securityOutcome: outcome };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    const intent = state.intent || 'general';
    console.log('Router Node: Deciding next step for intent:', intent);

    if (intent === 'weather') {
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

    // US02: Check security outcome
    if (state.securityOutcome === 'denied') {
        console.log('Audit: Blocking response due to security denial.');
        return {
            messages: [new AIMessage("Authentication required. Please click here to authenticate.")]
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
