import { taskManager } from '../tools/taskManager';
import { UserProfile } from '../state';
import * as userStore from '../services/userStore';

// Mock the userStore
jest.mock('../services/userStore', () => ({
    updateUserProfile: jest.fn().mockResolvedValue(undefined)
}));

describe('TaskManager Tool', () => {
    let mockProfile: UserProfile;

    beforeEach(() => {
        mockProfile = {
            id: 'test-user',
            name: 'Test',
            preferences: {},
            tasks: []
        };
        jest.clearAllMocks();
    });

    it('should add a task', async () => {
        const result = await taskManager.addTask(mockProfile, 'Buy milk');

        expect(result.profile.tasks).toHaveLength(1);
        expect(result.profile.tasks[0].description).toBe('Buy milk');
        expect(result.message).toContain('Task added');
        expect(userStore.updateUserProfile).toHaveBeenCalledWith(result.profile);
    });

    it('should list tasks', async () => {
        const profileWithTasks: UserProfile = {
            ...mockProfile,
            tasks: [
                { id: '1', description: 'Task 1', status: 'pending', createdAt: 123 },
                { id: '2', description: 'Task 2', status: 'completed', createdAt: 124 }
            ]
        };

        const message = await taskManager.listTasks(profileWithTasks);
        expect(message).toContain('1. [ ] Task 1');
        expect(message).toContain('2. [x] Task 2');
    });

    it('should complete a task', async () => {
         const profileWithTasks: UserProfile = {
            ...mockProfile,
            tasks: [
                { id: '1', description: 'Task 1', status: 'pending', createdAt: 123 }
            ]
        };

        const result = await taskManager.completeTask(profileWithTasks, 1);
        expect(result.profile.tasks[0].status).toBe('completed');
        expect(result.message).toContain('marked as completed');
    });

    it('should delete a task', async () => {
         const profileWithTasks: UserProfile = {
            ...mockProfile,
            tasks: [
                { id: '1', description: 'Task 1', status: 'pending', createdAt: 123 }
            ]
        };

        const result = await taskManager.deleteTask(profileWithTasks, 1);
        expect(result.profile.tasks).toHaveLength(0);
        expect(result.message).toContain('deleted');
    });
});
