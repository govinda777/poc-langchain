import { BaseMessage } from "@langchain/core/messages";
import { User } from "@privy-io/react-auth";

export interface UserProfile {
    id: string;
    name: string;
    preferences: Record<string, any>;
    // Future: long term memory summaries, etc.
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
