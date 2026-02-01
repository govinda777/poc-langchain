import { addTask, listTasks } from '../../tools/taskManager';
import { UserProfile } from '../../state';

describe('Task Manager Tool', () => {
    let mockProfile: UserProfile;

    beforeEach(() => {
        mockProfile = {
            id: 'test-user',
            name: 'Test',
            preferences: {},
            tasks: []
        };
    });

    test('should add a task', async () => {
        const result = await addTask(mockProfile, 'Buy milk');
        expect(result).toContain('Task added');
        expect(mockProfile.tasks).toHaveLength(1);
        expect(mockProfile.tasks?.[0].title).toBe('Buy milk');
    });

    test('should list tasks', async () => {
        await addTask(mockProfile, 'Task 1');
        await addTask(mockProfile, 'Task 2');
        const list = await listTasks(mockProfile);
        expect(list).toContain('Task 1');
        expect(list).toContain('Task 2');
    });

    test('should handle empty list', async () => {
        const list = await listTasks(mockProfile);
        expect(list).toContain('no tasks');
    });
});
