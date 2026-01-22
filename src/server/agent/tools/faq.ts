import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const KNOWLEDGE_BASE: Record<string, string> = {
    "password": "To reset your password, go to the settings page and click 'Reset Password'.",
    "contact": "You can contact support at support@example.com.",
    "hours": "Our support hours are 9am to 5pm EST.",
    "pricing": "Our pricing starts at $10/month.",
};

export const faqTool = new DynamicStructuredTool({
    name: "faq_tool",
    description: "Searches the knowledge base for answers to common questions.",
    schema: z.object({
        query: z.string().describe("The user's question or keywords to search for."),
    }),
    func: async ({ query }) => {
        const lowerQuery = query.toLowerCase();
        // Simple keyword match
        const match = Object.keys(KNOWLEDGE_BASE).find(key => lowerQuery.includes(key));

        if (match) {
            return KNOWLEDGE_BASE[match];
        }

        return "I'm sorry, I couldn't find an answer to that in my knowledge base.";
    },
});
