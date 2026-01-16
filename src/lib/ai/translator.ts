import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export const TranslatorInputSchema = z.object({
  text: z.string().min(1, "Text to translate cannot be empty"),
  targetLanguage: z.string().min(2, "Target language must be specified"),
});

export type TranslatorInput = z.infer<typeof TranslatorInputSchema>;

export async function translateText({ text, targetLanguage }: TranslatorInput): Promise<string> {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant that translates text to {target_language}."],
    ["user", "{text}"],
  ]);

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  try {
    const result = await chain.invoke({
      target_language: targetLanguage,
      text: text,
    });
    return result;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text.");
  }
}
