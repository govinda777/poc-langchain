import { BaseMessage } from "@langchain/core/messages";
import { User } from "@privy-io/react-auth";
import { UserProfile } from "./memory_store";

export interface AgentState {
    messages: BaseMessage[];
    user?: User;
    userProfile?: UserProfile;
    sessionId: string;
    // Contextual data
    intent?: string;
    lastActive?: number;
}
