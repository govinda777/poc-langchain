export function calculatorTool(expression: string): string {
  try {
    // Allow only digits, operators, parens, spaces, dots
    const validPattern = /^[0-9+\-*/().\s]+$/;

    if (!validPattern.test(expression)) {
      return "Error: Invalid expression. Only numbers and basic operators are allowed.";
    }

    // Evaluate
    const fn = new Function(`return ${expression}`);
    const result = fn();

    return String(result);
  } catch (_error) {
    return "Error: Could not evaluate expression.";
  }
}
