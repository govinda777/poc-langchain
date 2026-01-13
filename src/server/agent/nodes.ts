import { AgentState } from './state';
import { END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';

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
    return {
        messages: [new AIMessage(`I am the Cognitive Agent. I received your message: "${lastUserMsg}". I am currently running in a basic configuration.`)]
    };
}
