import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './memory_store';

// Node: Hydration (Identity)
export async function hydrationNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Hydration Node: checking identity...');

    // If already hydrated, skip
    if (state.userProfile) {
         return {};
    }

    const userId = state.user?.id;
    if (userId) {
        const profile = await getUserProfile(userId);
        if (profile) {
            console.log(`Hydration Node: User identified as ${profile.name}`);
            return { userProfile: profile };
        }
    }
    return {};
}

// Node: Perception
export async function perceptionNode(_state: AgentState): Promise<Partial<AgentState>> {
    console.log('Perception Node: Processing input...');
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

    let greeting = "I am the Cognitive Agent.";
    if (state.userProfile) {
        greeting = `Hello, ${state.userProfile.name}! I am your Cognitive Agent.`;
    }

    return {
        messages: [new AIMessage(`${greeting} I received your message: "${lastUserMsg}". I am currently running in a basic configuration.`)]
    };
}
