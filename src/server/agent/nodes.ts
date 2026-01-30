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

    let intent = state.intent || 'general';

    if (content.includes('transfer') || content.includes('transferência')) {
        intent = 'transfer';
    } else if (content.includes('clima') || content.includes('weather')) {
        intent = 'weather';
    }

    return {
        lastActive: Date.now(),
        intent
    };
}

// Node: Security (New)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Security Node: Checking verification...');
    const { intent, isVerified, userId } = state;
    let securityOutcome: 'approved' | 'denied' | 'pending' = 'approved';

    if (intent === 'transfer') {
        if (!isVerified) {
             console.log(`Audit: Security Check - User ${userId} DENIED for sensitive action '${intent}'.`);
             securityOutcome = 'denied';
        } else {
             console.log(`Audit: Security Check - User ${userId} APPROVED for sensitive action '${intent}'.`);
             securityOutcome = 'approved';
        }
    }

    return { securityOutcome };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    console.log('Router Node: Deciding next step...');

    if (state.securityOutcome === 'denied') {
        return 'response';
    }

    const intent = state.intent;

    if (intent === 'weather') {
        return 'action';
    }

    return 'response';
}

// Node: Action (Tools)
export async function actionNode(_state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool...');
    // Simulation of a tool execution
    return {
        messages: [new AIMessage("Tool execution simulated.")]
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');

    if (state.securityOutcome === 'denied') {
        return {
             messages: [new AIMessage("Authentication required for this action.")]
        };
    }

    const lastUserMsg = state.messages[state.messages.length - 1].content;
    const name = state.userProfile?.name || "User";

    let response = `Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`;

    if (state.intent === 'transfer' && state.securityOutcome === 'approved') {
        response = `Transfer initiated for ${name}.`;
    }

    if (state.userProfile?.lastConversationContext) {
        console.log(`Audit: Integrating long-term memory into response: "${state.userProfile.lastConversationContext}"`);
        response += `\n\nContinuing our discussion about: ${state.userProfile.lastConversationContext}.`;
    }

    return {
        messages: [new AIMessage(response)]
    };
}
