import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { convertCurrency } from './tools/currency';

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

    if (content.includes('convert') || content.includes('currency') || content.includes('cotação') || content.includes('dolar') || content.includes('real')) {
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

    // Check for Weather (stub)
    if (content.toLowerCase().includes('weather') || content.toLowerCase().includes('clima')) {
         return {
            messages: [new AIMessage("Tool execution simulated: Weather is sunny.")]
        };
    }

    // Check for Currency
    // Regex for: 10 USD to BRL, 10 USD para BRL
    const currencyRegex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]{3})\s*(?:to|para|em)\s*([a-zA-Z]{3})/i;
    const match = content.match(currencyRegex);

    if (match) {
        const amount = parseFloat(match[1]);
        const from = match[2].toUpperCase();
        const to = match[3].toUpperCase();

        try {
            const result = convertCurrency(amount, from, to);
             return {
                messages: [new AIMessage(`Converted: ${amount} ${from} = ${result} ${to}`)]
            };
        } catch (error) {
             return {
                messages: [new AIMessage(`Error converting currency: ${(error as Error).message}`)]
            };
        }
    }

    return {
        // We would append a ToolMessage here
        messages: [new AIMessage("Tool execution simulated. No specific tool matched.")]
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
