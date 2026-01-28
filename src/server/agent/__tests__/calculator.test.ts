import { calculate } from '../tools/calculator';
import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';

describe('Calculator Tool', () => {
    describe('Unit Tests', () => {
        test('adds numbers correctly', () => {
            expect(calculate('2 + 2')).toBe('4');
        });

        test('subtracts numbers correctly', () => {
            expect(calculate('5 - 3')).toBe('2');
        });

        test('multiplies numbers correctly', () => {
            expect(calculate('3 * 4')).toBe('12');
        });

        test('divides numbers correctly', () => {
            expect(calculate('10 / 2')).toBe('5');
        });

        test('handles division by zero', () => {
            expect(calculate('10 / 0')).toBe('Error: Division by zero.');
        });

        test('handles invalid format', () => {
            expect(calculate('invalid')).toContain('Error');
        });

        test('handles decimals', () => {
            expect(calculate('2.5 + 2.5')).toBe('5');
        });
    });

    describe('Integration Tests (Graph)', () => {
        test('Graph routes "calculate 2 + 2" to calculator and returns 4', async () => {
            const result = await graph.invoke({
                messages: [new HumanMessage("calculate 2 + 2")],
                userId: 'test-user',
            });

            const messages = result.messages;

            // Verify that the calculation result message exists in the conversation history
            const calcMessage = messages.find((m: any) => m.content.includes('Calculation Result: 4'));
            expect(calcMessage).toBeDefined();
        });
    });
});
