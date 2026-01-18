import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

const CalculatorInput = z.object({
  operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The mathematical operation to perform"),
  a: z.number().describe("The first number"),
  b: z.number().describe("The second number"),
});

export const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description: "Perform basic mathematical operations (add, subtract, multiply, divide).",
  schema: CalculatorInput,
  func: async ({ operation, a, b }) => {
    switch (operation) {
      case "add":
        return (a + b).toString();
      case "subtract":
        return (a - b).toString();
      case "multiply":
        return (a * b).toString();
      case "divide":
        if (b === 0) {
          return "Error: Division by zero";
        }
        return (a / b).toString();
      default:
        return "Error: Unknown operation";
    }
  },
});
