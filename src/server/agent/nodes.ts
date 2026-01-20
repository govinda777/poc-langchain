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

    if (content.includes('calc') || content.includes('somar') || content.includes('sum') || content.includes('multiply') || content.includes('divide')) {
        return 'action';
    }

    // Default to responding directly (or handoff to LLM generation node)
    return 'response';
}

// Node: Action (Tools)
export async function actionNode(state: AgentState): Promise<Partial<AgentState>> {
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toString().toLowerCase();
    console.log('Action Node: Executing tool for:', content);

    if (content.includes('calc') || content.includes('sum') || content.includes('somar') || content.includes('multiply') || content.includes('divide')) {
        let operation = "add";
        if (content.includes("multiply") || content.includes("multiplicar")) operation = "multiply";
        else if (content.includes("subtract") || content.includes("subtrair")) operation = "subtract";
        else if (content.includes("divide") || content.includes("dividir")) operation = "divide";

        const numbers = content.match(/-?\d+(\.\d+)?/g)?.map(Number);

        if (numbers && numbers.length >= 2) {
             try {
                const result = await calculatorTool.invoke({
                    operation: operation as any,
                    a: numbers[0],
                    b: numbers[1]
                });
                return {
                    messages: [new AIMessage(`Calculation Result: ${result}`)]
                };
             } catch (error) {
                 return {
                     messages: [new AIMessage(`Error executing calculator: ${error}`)]
                 };
             }
        } else {
             return {
                messages: [new AIMessage("I detected a calculation intent but couldn't find two numbers to operate on.")]
            };
        }
    }

    // Fallback for simulation (e.g. weather)
    return {
        messages: [new AIMessage("Tool execution simulated (Weather/Other).")]
    };
}

// Node: Agent (Response Generation)
export async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('Agent Node: Generating response...');
    const lastUserMsg = state.messages[state.messages.length - 1].content;
    const name = state.userProfile?.name || "User";

    // If the last message was from the action node (AIMessage), we might want to just return it or wrap it?
    // In this graph topology: Action -> Agent -> End.
    // So 'Agent Node' will see the output of 'Action Node' in the messages history?
    // Actually, Action Node returns { messages: [AIMessage] }.
    // The Reducer appends it.
    // So AgentNode will see UserMessage, then AIMessage (from Action).

    // Check if the last message is already an AIMessage (from ActionNode)
    const lastMsg = state.messages[state.messages.length - 1];
    if (lastMsg._getType() === 'ai' && lastMsg.content.toString().includes('Result')) {
         // If we just got a result, we might want to finalize it or just let it be.
         // For now, let's append a polite closing if needed, or just END.
         // Actually, the graph is Action -> Agent -> End.
         // So Agent Node runs AFTER Action Node.
         return {
             messages: [new AIMessage(`Here is your answer: ${lastMsg.content}`)]
         };
    }

    return {
        messages: [new AIMessage(`Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`)]
    };
}
