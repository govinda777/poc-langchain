import { faqTool } from '../faq';

describe('Tool: FAQ (Tech Support)', () => {
    it('should return answer for password reset', async () => {
        const result = await faqTool.invoke({ query: 'how to reset password' });
        expect(result).toContain('settings page');
    });

    it('should return answer for contact support', async () => {
        const result = await faqTool.invoke({ query: 'how to contact support' });
        expect(result).toContain('support@example.com');
    });

    it('should return not found message for unknown query', async () => {
        const result = await faqTool.invoke({ query: 'how to fly to mars' });
        expect(result).toContain('sorry');
    });
});
