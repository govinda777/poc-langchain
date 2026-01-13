import { BaseMessage } from "@langchain/core/messages";
import { User } from "@privy-io/react-auth";

export interface AgentState {
    messages: BaseMessage[];
    user?: User;
    sessionId: string;
    // Contextual data
    intent?: string;
    lastActive?: number;
}
