/**
 * @jest-environment node
 */
import { summarizeText } from "../summarizer";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";

// Mock ChatOpenAI
jest.mock("@langchain/openai");

describe("summarizeText", () => {
  const mockInvoke = jest.fn();

  beforeEach(() => {
    // Reset mocks
    (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
      invoke: mockInvoke,
    }));
    mockInvoke.mockReset();
  });

  it("should return the summary text", async () => {
    mockInvoke.mockResolvedValue(new AIMessage("This is a summary."));
    const result = await summarizeText("Long text");
    expect(result).toBe("This is a summary.");
    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it("should throw error if text is empty", async () => {
    await expect(summarizeText("")).rejects.toThrow("Text is required");
  });
});
