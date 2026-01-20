import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description: "Performs basic arithmetic operations: add, subtract, multiply, divide.",
  schema: z.object({
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The arithmetic operation to perform."),
    a: z.number().describe("The first number."),
    b: z.number().describe("The second number."),
  }),
  func: async ({ operation, a, b }) => {
    let result: number;
    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        if (b === 0) {
          return "Error: Division by zero.";
        }
        result = a / b;
        break;
      default:
        return "Error: Unknown operation.";
    }
    return result.toString();
  },
});
