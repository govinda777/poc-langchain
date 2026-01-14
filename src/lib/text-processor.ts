export interface TextStats {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
}

export class TextProcessor {
  /**
   * Analyzes the given text and returns basic statistics.
   * @param text The input text to analyze.
   * @returns TextStats object containing counts.
   */
  static analyzeText(text: string): TextStats {
    if (!text.trim()) {
      return { wordCount: 0, charCount: 0, paragraphCount: 0 };
    }

    const words = text.trim().split(/\s+/);
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    return {
      wordCount: words.length,
      charCount: text.length,
      paragraphCount: paragraphs.length,
    };
  }

  /**
   * Generates a prompt for a summarization task.
   * This prepares the input for an LLM chain.
   * @param text The text to be summarized.
   * @returns A formatted prompt string.
   */
  static generateSummaryPrompt(text: string): string {
    return `Please provide a concise summary of the following text:\n\n"${text}"\n\nSummary:`;
  }
}
