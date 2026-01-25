import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { calculatorTool } from './tools/calculator';

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

    if (content.includes('clima') || content.includes('weather')) {
        return 'action';
    }

    if (content.includes('calc') || content.includes('conta') || /[\d]+\s*[\+\-\*\/]/.test(content)) {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool...');
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();

    if (content.includes('calc') || content.includes('conta') || /[\d]+\s*[\+\-\*\/]/.test(content)) {
        // Extract expression by removing non-math characters (keeping digits, operators, parens, dots, spaces)
        // We also want to keep the structure valid.
        // Simple heuristic: Remove text words.
        const expression = content.replace(/[a-z!@#$%^&_=\[\]{};':"\\|,<>?]/g, '');
        const result = calculatorTool(expression);
        return {
            messages: [new AIMessage(`Calculator Result: ${result}`)]
        };
    }

    // Simulation of other tool execution (e.g. Weather)
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
