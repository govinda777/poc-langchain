import { UserProfile } from '../state';

// Mock User Store
// In a real application, this would connect to a database
const MOCK_DB: Record<string, UserProfile> = {
    'user-123': {
        id: 'user-123',
        name: 'Alice',
        preferences: { theme: 'dark' }
    },
    'user-456': {
        id: 'user-456',
        name: 'Bob',
        preferences: { language: 'pt-BR' }
    },
    'joao-123': {
        id: 'joao-123',
        name: 'João',
        preferences: {},
        lastConversationContext: "discussed insurance proposal"
    }
};

const profileCache = new Map<string, UserProfile | null>();

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    if (profileCache.has(userId)) {
        return profileCache.get(userId) || null;
    }

    // Simulate async DB call
    const profile = MOCK_DB[userId] || null;
    profileCache.set(userId, profile);
    return profile;
}
