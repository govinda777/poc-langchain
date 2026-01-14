import { TextProcessor } from '@/lib/text-processor';

describe('TextProcessor', () => {
  describe('analyzeText', () => {
    it('should return 0 counts for empty string', () => {
      const stats = TextProcessor.analyzeText('');
      expect(stats).toEqual({ wordCount: 0, charCount: 0, paragraphCount: 0 });
    });

    it('should return 0 counts for whitespace string', () => {
      const stats = TextProcessor.analyzeText('   ');
      expect(stats).toEqual({ wordCount: 0, charCount: 0, paragraphCount: 0 });
    });

    it('should correctly count words and characters', () => {
      const text = 'Hello world';
      const stats = TextProcessor.analyzeText(text);
      expect(stats.wordCount).toBe(2);
      expect(stats.charCount).toBe(11);
      expect(stats.paragraphCount).toBe(1);
    });

    it('should correctly count paragraphs', () => {
      const text = 'Para 1\n\nPara 2';
      const stats = TextProcessor.analyzeText(text);
      expect(stats.paragraphCount).toBe(2);
      expect(stats.wordCount).toBe(4);
    });
  });

  describe('generateSummaryPrompt', () => {
    it('should format the prompt correctly', () => {
      const text = 'Some content';
      const prompt = TextProcessor.generateSummaryPrompt(text);
      expect(prompt).toContain('Please provide a concise summary');
      expect(prompt).toContain('"Some content"');
    });
  });
});
