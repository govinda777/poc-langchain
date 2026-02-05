import { z } from 'zod';

const serverSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().min(1).optional(),
  PINECONE_API_KEY: z.string().min(1).optional(),
  PINECONE_INDEX: z.string().min(1).optional(),
  PINECONE_ENV: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const clientSchema = z.object({
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1).optional(),
});

const _env = serverSchema.merge(clientSchema);

const formatErrors = (errors: z.ZodFormattedError<z.infer<typeof _env>>) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}`;
    })
    .filter(Boolean);

export const env = (() => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
      const parsed = _env.safeParse(process.env);
      if (!parsed.success) {
          console.error('❌ Invalid environment variables:', formatErrors(parsed.error.format()));
          throw new Error('Invalid environment variables');
      }
      return parsed.data;
  }

  // Client
  // We need to manually construct the object so Next.js bundler can replace the values
  const clientEnv = {
      NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  };

  const parsed = clientSchema.safeParse(clientEnv);
  if (!parsed.success) {
      console.error('❌ Invalid environment variables:', formatErrors(parsed.error.format()));
      throw new Error('Invalid environment variables');
  }

  return parsed.data as z.infer<typeof _env>;
})();
