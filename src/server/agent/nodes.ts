import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { convertUnits } from './tools/unitConverter';

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

    if (content.includes('clima') || content.includes('weather') || content.includes('convert') || content.includes('converte')) {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool...');
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString();

    // Regex for unit conversion: "10 km para m" or "convert 10 km to m"
    const conversionRegex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*(?:para|to)\s*([a-zA-Z]+)/i;
    const match = content.match(conversionRegex);

    if (match) {
        const value = parseFloat(match[1]);
        const fromUnit = match[2];
        const toUnit = match[3];

        try {
            console.log(`Audit: Executing Unit Conversion: ${value} ${fromUnit} -> ${toUnit}`);
            const result = convertUnits(value, fromUnit, toUnit);
            return {
                messages: [new AIMessage(`Conversion Result: ${result}`)]
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
             return {
                messages: [new AIMessage(`Error: ${errorMessage}`)]
            };
        }
    }

    // Fallback or other tools
    return {
        messages: [new AIMessage("Tool execution simulated (no matching tool found).")]
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');
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
