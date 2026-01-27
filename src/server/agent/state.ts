import { BaseMessage } from "@langchain/core/messages";
import { User } from "@privy-io/react-auth";

export interface Task {
    id: string;
    description: string;
    completed: boolean;
    createdAt: number;
}

export interface UserProfile {
    id: string;
    name: string;
    preferences: Record<string, unknown>;
    lastConversationContext?: string; // Long-term memory of the last interaction
    tasks?: Task[];
}

export interface AgentState {
    messages: BaseMessage[];
    userId?: string; // Input channel to identify the user
    userProfile?: UserProfile; // Hydrated profile
    user?: User; // Legacy/Privy User
    sessionId: string;
    // Contextual data
    intent?: string;
    lastActive?: number;
}
