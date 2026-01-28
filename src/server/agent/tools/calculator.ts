export function calculate(expression: string): string {
    // Normalize and remove all spaces
    const cleanExpr = expression.replace(/\s+/g, '');

    // Regex to match "Number Operator Number"
    // Captures:
    // 1: First number (integer or float)
    // 3: Operator (+, -, *, /)
    // 4: Second number
    const regex = /^(\d+(\.\d+)?)([\+\-\*\/])(\d+(\.\d+)?)$/;
    const match = cleanExpr.match(regex);

    if (!match) {
        // Try to be helpful if they sent just "calculate" or something
        return "Error: usage is 'calculate <number> <operator> <number>', e.g., '2 + 2'.";
    }

    const num1 = parseFloat(match[1]);
    const operator = match[3];
    const num2 = parseFloat(match[4]);

    let result = 0;

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) return "Error: Division by zero.";
            result = num1 / num2;
            break;
        default:
            return "Error: Unknown operator.";
    }

    return result.toString();
}
