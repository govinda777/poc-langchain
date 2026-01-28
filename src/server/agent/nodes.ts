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

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    console.log('Router Node: Deciding next step for:', content);

    // US02: Transfer intent -> Security
    if (content.includes('transfer') || content.includes('transferência')) {
        return 'security';
    }

    if (content.includes('clima') || content.includes('weather')) {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Security (US02)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Security Node: Checking verification status...');
    const isVerified = state.isVerified ?? false;

    const outcome = isVerified ? 'approved' : 'denied';

    console.log(`Audit: Security Gate - User ${state.userId} action ${outcome}. Verified: ${isVerified}`);

    return {
        securityOutcome: outcome
    };
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

    // US02: Handle Security Denial
    if (state.securityOutcome === 'denied') {
        console.log('Audit: Refusing action due to security policy.');
        return {
            messages: [new AIMessage("Access Denied. For your security, please authenticate to proceed with this sensitive action.")]
        };
    }

    const lastUserMsg = state.messages[state.messages.length - 1].content;
    const name = state.userProfile?.name || "User";

    let response = `Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`;

    if (state.userProfile?.lastConversationContext) {
        console.log(`Audit: Integrating long-term memory into response: "${state.userProfile.lastConversationContext}"`);
        response += `\n\nContinuing our discussion about: ${state.userProfile.lastConversationContext}.`;
    }

    // If security was approved, maybe acknowledge it?
    if (state.securityOutcome === 'approved') {
         response += "\n(Security verification passed)";
    }

    return {
        messages: [new AIMessage(response)]
    };
}
