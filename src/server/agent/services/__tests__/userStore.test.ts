import { getUserProfile } from '../userStore';

describe('userStore', () => {
    it('should return a user profile if user exists', async () => {
        const profile = await getUserProfile('user-123');
        expect(profile).toBeDefined();
        expect(profile?.name).toBe('Alice');
    });

    it('should return null if user does not exist', async () => {
        const profile = await getUserProfile('non-existent');
        expect(profile).toBeNull();
    });
});
