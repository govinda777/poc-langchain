# Text Summarization Service

This feature provides an automated text summarization service using OpenAI's GPT models via LangChain.

## API Endpoint

### `POST /api/summarize`

Accepts a JSON body with a `text` field and returns a summary.

**Request:**

```json
{
  "text": "Long text content here..."
}
```

**Response:**

```json
{
  "summary": "Summarized content."
}
```

## Internal Architecture

- **Service**: `src/lib/ai/summarizer.ts` - Encapsulates LangChain logic.
- **Route Handler**: `src/app/api/summarize/route.ts` - Exposes the service via Next.js App Router.

## Testing

Run tests with:

```bash
npm test
```

## Security

Ensure `OPENAI_API_KEY` is set in the environment variables.
