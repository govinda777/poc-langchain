import { AgentState } from './state';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { addTask, listTasks, completeTask } from './tools/todo';

// Node: Hydration (Identity First)
export async function hydrationNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Hydration Node: Resolving identity...');

    // If profile is already provided in input (e.g. from previous turn), use it.
    if (state.userProfile) {
        console.log('Hydration Node: Using existing profile from state.');
        return { lastActive: Date.now() };
    }

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

    let intent = 'chat';
    if (content.includes('clima') || content.includes('weather')) intent = 'weather';
    else if (content.includes('adicionar tarefa') || content.includes('nova tarefa')) intent = 'add_task';
    else if (content.includes('listar tarefas') || content.includes('ver tarefas')) intent = 'list_tasks';
    else if (content.includes('concluir tarefa') || content.includes('terminar tarefa')) intent = 'complete_task';

    return {
        lastActive: Date.now(),
        intent: intent
    };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
    console.log('Router Node: Deciding next step for intent:', state.intent);

    if (['weather', 'add_task', 'list_tasks', 'complete_task'].includes(state.intent || '')) {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Action Node: Executing tool...', state.intent);

    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString();
    let result = "Ação desconhecida.";

    if (state.intent === 'add_task') {
        // Extract description: "Adicionar tarefa: Comprar leite" or just "Adicionar tarefa Comprar leite"
        const match = content.match(/tarefa:?\s*(.+)/i);
        const description = match ? match[1] : "Sem descrição";
        if (state.userProfile) {
            result = addTask(state.userProfile, description);
        }
    } else if (state.intent === 'list_tasks') {
        if (state.userProfile) {
            result = listTasks(state.userProfile);
        }
    } else if (state.intent === 'complete_task') {
        const match = content.match(/(\d+)/);
        const index = match ? parseInt(match[1]) : 0;
        if (state.userProfile) {
            result = completeTask(state.userProfile, index);
        }
    } else {
        // Simulation of other tools (weather)
         if (state.intent === 'weather') {
             result = "O tempo está ensolarado (Simulado).";
         } else {
             result = "Tool execution simulated.";
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
