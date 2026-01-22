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

    // Mock Verification Logic
    // In a real system, this would come from the auth provider or session
    const isVerified = userId === 'user-123';

    return {
        userProfile: profile,
        lastActive: Date.now(),
        isVerified
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

    if (content.includes('clima') || content.includes('weather')) {
        return 'action';
    }

    if (content.includes('transfer')) {
        return 'security';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Security (Gatekeeper)
export async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log(`Security Node: Checking verification for ${state.userProfile?.name}...`);

    if (state.isVerified) {
         console.log('Audit: User verified. Access granted.');
         return { securityOutcome: 'approved' };
    } else {
         console.log('Audit: User NOT verified. Access denied.');
         return { securityOutcome: 'denied' };
    }
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

    if (state.securityOutcome === 'denied') {
        return {
            messages: [new AIMessage(`Access Denied. For your security, please authenticate before proceeding with this action.`)]
        };
    }

    return {
        messages: [new AIMessage(`Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`)]
    };
}
