import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';
import { taskManager } from './tools/taskManager';

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
    if (content.includes('task') || content.includes('tarefa') || content.includes('todo') || content.includes('lista')) {
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
    const lowerContent = content.toLowerCase();

    // Default response
    let toolResponse = "Tool execution simulated.";
    let updatedProfile = state.userProfile;

    // Task Manager Logic
    if (lowerContent.includes('task') || lowerContent.includes('tarefa') || lowerContent.includes('todo') || lowerContent.includes('lista')) {
        if (!updatedProfile) {
            return { messages: [new AIMessage("Error: User profile not found.")] };
        }

        if (lowerContent.includes('add') || lowerContent.includes('adicionar') || lowerContent.includes('nova')) {
             // Extract description (naive regex)
             const description = content.replace(/(add|adicionar|nova|task|tarefa|todo)/gi, '').trim();
             if (description) {
                 const result = await taskManager.addTask(updatedProfile, description);
                 updatedProfile = result.profile;
                 toolResponse = result.message;
             } else {
                 toolResponse = "Please specify the task description.";
             }
        } else if (lowerContent.includes('complete') || lowerContent.includes('completar') || lowerContent.includes('fazer') || lowerContent.includes('done')) {
             const match = content.match(/(\d+)/);
             if (match) {
                 const index = parseInt(match[1]);
                 const result = await taskManager.completeTask(updatedProfile, index);
                 updatedProfile = result.profile;
                 toolResponse = result.message;
             } else {
                 toolResponse = "Please specify the task number to complete.";
             }
        } else if (lowerContent.includes('delete') || lowerContent.includes('apagar') || lowerContent.includes('remover')) {
            const match = content.match(/(\d+)/);
            if (match) {
                const index = parseInt(match[1]);
                const result = await taskManager.deleteTask(updatedProfile, index);
                updatedProfile = result.profile;
                toolResponse = result.message;
            } else {
                toolResponse = "Please specify the task number to delete.";
            }
       } else {
             // List tasks by default if keyword matches but no specific action
             toolResponse = await taskManager.listTasks(updatedProfile);
        }
    }

    return {
        messages: [new AIMessage(toolResponse)],
        userProfile: updatedProfile
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
