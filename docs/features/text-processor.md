# Text Processor Feature

## Overview

The Text Processor is a utility service designed to analyze text and prepare it for further processing by LLMs (Large Language Models).

## Functionality

### 1. Text Analysis (`analyzeText`)

Calculates basic statistics for a given text input:

- **Word Count**: Number of words separated by whitespace.
- **Character Count**: Total number of characters.
- **Paragraph Count**: Number of paragraphs separated by double newlines.

### 2. Summary Prompt Generation (`generateSummaryPrompt`)

Prepares a standardized prompt for text summarization tasks. This ensures consistent input formatting for the underlying LLM chains.

## Usage

```typescript
import { TextProcessor } from '@/lib/text-processor';

const text = 'Hello world. This is a test.';
const stats = TextProcessor.analyzeText(text);

console.log(stats);
// Output: { wordCount: 6, charCount: 28, paragraphCount: 1 }

const prompt = TextProcessor.generateSummaryPrompt(text);
// Output: "Please provide a concise summary..."
```

## Testing

Unit tests are located in `__tests__/lib/text-processor.test.ts`. Run them using:

```bash
npm test
```
