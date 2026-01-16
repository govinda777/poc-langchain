export interface UserProfile {
    id: string;
    name: string;
    preferences: Record<string, any>;
    lastInteraction: string; // ISO date
}

export const MOCK_USERS: Record<string, UserProfile> = {
    'user-1': {
        id: 'user-1',
        name: 'Alice',
        preferences: {
            topic: 'insurance',
            language: 'pt-BR'
        },
        lastInteraction: '2023-10-01T10:00:00Z'
    },
    'user-2': {
        id: 'user-2',
        name: 'Bob',
        preferences: {},
        lastInteraction: '2023-10-02T10:00:00Z'
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    // Simulate async DB call
    await new Promise(resolve => setTimeout(resolve, 10));
    return MOCK_USERS[userId] || null;
}
