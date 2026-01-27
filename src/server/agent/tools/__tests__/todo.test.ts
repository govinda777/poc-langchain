import { addTask, listTasks, completeTask } from '../todo';
import { UserProfile } from '../../state';

describe('Todo Tool', () => {
    let mockProfile: UserProfile;

    beforeEach(() => {
        mockProfile = {
            id: 'test-user',
            name: 'Test User',
            preferences: {},
            tasks: []
        };
    });

    test('should add a task', () => {
        const result = addTask(mockProfile, 'Buy milk');
        expect(mockProfile.tasks).toHaveLength(1);
        expect(mockProfile.tasks?.[0].description).toBe('Buy milk');
        expect(mockProfile.tasks?.[0].completed).toBe(false);
        expect(result).toContain('Tarefa adicionada');
    });

    test('should list tasks', () => {
        addTask(mockProfile, 'Task 1');
        addTask(mockProfile, 'Task 2');
        const list = listTasks(mockProfile);
        expect(list).toContain('Task 1');
        expect(list).toContain('Task 2');
    });

    test('should complete a task', () => {
        addTask(mockProfile, 'Task to complete');
        const taskIndex = 1; // 1-based index usually
        const result = completeTask(mockProfile, taskIndex);
        expect(mockProfile.tasks?.[0].completed).toBe(true);
        expect(result).toContain('concluída');
    });

    test('should handle invalid index when completing', () => {
        const result = completeTask(mockProfile, 99);
        expect(result).toContain('inválido');
    });
});
