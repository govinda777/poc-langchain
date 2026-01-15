import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function summarizeText(text: string): Promise<string> {
  if (!text) {
    throw new Error("Text is required for summarization.");
  }

  // Expects OPENAI_API_KEY to be set in environment variables
  const chat = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.5,
  });

  const messages = [
    new SystemMessage("You are a helpful assistant that summarizes text concisely."),
    new HumanMessage(`Please summarize the following text:\n\n${text}`),
  ];

  const response = await chat.invoke(messages);

  const content = response.content;
  if (typeof content === "string") {
    return content;
  } else {
    return JSON.stringify(content);
  }
}
