import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { celsiusToFahrenheit, fahrenheitToCelsius } from "@/lib/temperature";

export const temperatureTool = new DynamicStructuredTool({
  name: "temperature_converter",
  description: "Converts temperatures between Celsius and Fahrenheit. Use this tool when the user asks to convert a specific temperature value to another unit. If the target is Fahrenheit, the input is assumed to be Celsius, and vice versa.",
  schema: z.object({
    value: z.number().describe("The numerical value of the temperature to convert"),
    targetUnit: z.enum(["celsius", "fahrenheit"]).describe("The unit to convert TO"),
  }),
  func: async ({ value, targetUnit }) => {
    try {
        let result: number;
        if (targetUnit === "fahrenheit") {
            result = celsiusToFahrenheit(value);
            return `${value}°C is ${result.toFixed(2)}°F`;
        } else {
            result = fahrenheitToCelsius(value);
            return `${value}°F is ${result.toFixed(2)}°C`;
        }
    } catch (_error) {
      // In LangChain tools, it's often better to return a string explaining the error than to throw
      return "Error: Failed to perform temperature conversion.";
    }
  },
});
