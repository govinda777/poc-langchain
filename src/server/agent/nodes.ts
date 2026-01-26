import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { getWeather } from './tools/weather';

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

    if (content.includes('clima') || content.includes('weather') || content.includes('tempo')) {
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

    // Simple keyword extraction for weather
    if (content.toLowerCase().includes('weather') || content.toLowerCase().includes('clima') || content.toLowerCase().includes('tempo')) {
        let location = "London"; // Default fallback
        // Naive extraction: capture text after "in", "em", "for", "para"
        const match = content.match(/(?:in|em|for|para)\s+([a-zA-Z\s]+)/i);
        if (match && match[1]) {
            location = match[1].trim();
        }

        try {
            const result = await getWeather({ location });
            const resultMsg = `Weather Report for ${result.location}: ${result.condition}, ${result.temperature}°C, Humidity ${result.humidity}%`;
            return {
                messages: [new AIMessage(resultMsg)]
            };
        } catch (error) {
            return {
                messages: [new AIMessage("I couldn't fetch the weather information. Please specify a location.")]
            };
        }
    }

    return {
        messages: [new AIMessage("Tool execution simulated (Unknown tool).")]
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');
    const lastMsg = state.messages[state.messages.length - 1];
    const content = lastMsg.content.toString();
    const name = state.userProfile?.name || "User";

    // If the last message is a Weather Report (from Action Node), we just wrap up.
    if (content.startsWith("Weather Report")) {
         return {
             messages: [new AIMessage("Here is your forecast. Let me know if you need anything else.")]
         };
    }

    return {
        messages: [new AIMessage(`Hello ${name}. I am the Cognitive Agent. I received your message: "${content}".`)]
    };
}
