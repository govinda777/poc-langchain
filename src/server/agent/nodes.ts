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
    if (content.includes('transfer') || content.includes('transferencia') || content.includes('pagar') || content.includes('buy')) {
        intent = 'transfer';
    } else if (content.includes('clima') || content.includes('weather')) {
        intent = 'weather';
    }

    return {
        lastActive: Date.now(),
        intent
    };
}

// Node: Security (US02 Gate)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    const { intent, isVerified, userProfile } = state;
    console.log(`Security Node: Checking access for intent '${intent}'...`);

    const sensitiveIntents = ['transfer', 'buy', 'update_profile'];

    if (sensitiveIntents.includes(intent || '')) {
        if (!isVerified) {
            console.log(`Audit: Security Check - User ${userProfile?.id} DENIED for intent ${intent}. Reason: Unverified.`);
            return { securityOutcome: 'denied' };
        }
        console.log(`Audit: Security Check - User ${userProfile?.id} APPROVED for intent ${intent}.`);
        return { securityOutcome: 'approved' };
    }

    return { securityOutcome: 'approved' }; // Default approve for non-sensitive
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    // If security denied, route to agent to explain
    if (state.securityOutcome === 'denied') {
        return 'response';
    }

    const intent = state.intent;
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

    // US02: Handle denied access
    if (state.securityOutcome === 'denied') {
         return {
            messages: [new AIMessage("Para realizar essa ação, por favor autentique-se: [Link de Autenticação]")]
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
