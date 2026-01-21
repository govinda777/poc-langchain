import { UserProfile } from '../state';

// Mock User Store
// In a real application, this would connect to a database
const MOCK_DB: Record<string, UserProfile> = {
  'user-123': {
    id: 'user-123',
    name: 'Alice',
    preferences: { theme: 'dark' },
  },
  'user-456': {
    id: 'user-456',
    name: 'Bob',
    preferences: { language: 'pt-BR' },
  },
  'joao-123': {
    id: 'joao-123',
    name: 'João',
    preferences: {},
    lastConversationContext: 'discussed insurance proposal',
  },
};

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  // Simulate async DB call
  await new Promise((resolve) => setTimeout(resolve, 10));
  return MOCK_DB[userId] || null;
}
