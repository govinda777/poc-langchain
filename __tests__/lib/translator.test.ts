/**
 * @jest-environment node
 */
import { translateText } from "@/lib/ai/translator";

// To avoid hoisting issues, we cannot use top-level variables inside jest.mock factory
// unless they are prefixed with 'mock'. However, even then, initialization order matters.
// Best approach: define the mock structure *inside* the mock factory or use a shared variable
// that is populated later, but since the require happens at top, we need the factory to be self-contained.

// We will make each mock return a generic object that has pipe/invoke.

const mockInvoke = jest.fn().mockResolvedValue("Translated Text");
const mockPipe = jest.fn();
// Circular return
mockPipe.mockImplementation(() => ({ pipe: mockPipe, invoke: mockInvoke }));

const sharedMockChain = {
  pipe: mockPipe,
  invoke: mockInvoke
};

jest.mock("@langchain/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
        pipe: jest.fn().mockImplementation(() => ({
            pipe: jest.fn().mockImplementation(() => ({
                invoke: jest.fn().mockResolvedValue("Translated Text")
            }))
        }))
    })),
  };
});

// Since the implementation is: prompt.pipe(model).pipe(parser).invoke()
// We can simplify by making prompt return an object that handles the full chain simulation.

jest.mock("@langchain/core/prompts", () => ({
  ChatPromptTemplate: {
    fromMessages: jest.fn().mockReturnValue({
        pipe: jest.fn().mockImplementation(() => ({
            pipe: jest.fn().mockImplementation(() => ({
                invoke: jest.fn().mockResolvedValue("Translated Text")
            }))
        }))
    }),
  },
}));

jest.mock("@langchain/core/output_parsers", () => ({
  StringOutputParser: jest.fn().mockImplementation(() => ({})),
}));

describe("Translator Service", () => {
  it("should translate text correctly", async () => {
    const input = { text: "Hello", targetLanguage: "Portuguese" };
    const result = await translateText(input);
    expect(result).toBe("Translated Text");
  });
});
