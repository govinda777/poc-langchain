import { AgentState } from './state';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { addTask, listTasks } from './tools/taskManager';

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

    if (content.includes('clima') || content.includes('weather') || content.includes('task') || content.includes('tarefa') || content.includes('lembrete')) {
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

    let result = "Tool execution simulated.";

    if (content.includes('clima') || content.includes('weather')) {
        result = "Weather tool execution simulated.";
    } else if (content.includes('task') || content.includes('tarefa') || content.includes('lembrete')) {
        if (state.userProfile) {
             if (content.includes('add') || content.includes('adicionar') || content.includes('nova') || content.includes('new')) {
                // Simple extraction: assume everything after "task"/"tarefa" is the description
                const description = content.replace(/(add|adicionar|nova|new|task|tarefa|lembrete)/g, '').trim();
                result = await addTask(state.userProfile, description || "New Task");
             } else {
                result = await listTasks(state.userProfile);
             }
        } else {
            result = "User profile not found. Cannot manage tasks.";
        }
    }

    return {
        messages: [new AIMessage(result)]
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
