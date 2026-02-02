import { UserProfile, Task } from '../state';
import { updateUserProfile } from '../services/userStore';

export const taskManager = {
    async addTask(profile: UserProfile, description: string): Promise<{ profile: UserProfile; message: string }> {
        const newTask: Task = {
            id: Date.now().toString(),
            description,
            status: 'pending',
            createdAt: Date.now()
        };

        const updatedProfile = {
            ...profile,
            tasks: [...(profile.tasks || []), newTask]
        };

        await updateUserProfile(updatedProfile);

        return {
            profile: updatedProfile,
            message: `Task added: "${description}"`
        };
    },

    async listTasks(profile: UserProfile): Promise<string> {
        const tasks = profile.tasks || [];
        if (tasks.length === 0) {
            return "You have no tasks in your list.";
        }

        const taskList = tasks.map((t, index) =>
            `${index + 1}. [${t.status === 'completed' ? 'x' : ' '}] ${t.description}`
        ).join('\n');

        return `Here are your tasks:\n${taskList}`;
    },

    async completeTask(profile: UserProfile, taskIndex: number): Promise<{ profile: UserProfile; message: string }> {
        const tasks = profile.tasks || [];
        // Adjust for 1-based index from user input
        const index = taskIndex - 1;

        if (index < 0 || index >= tasks.length) {
            return { profile, message: `Task #${taskIndex} not found.` };
        }

        const updatedTasks = [...tasks];
        updatedTasks[index] = {
            ...updatedTasks[index],
            status: 'completed'
        };

        const updatedProfile = {
            ...profile,
            tasks: updatedTasks
        };

        await updateUserProfile(updatedProfile);

        return {
            profile: updatedProfile,
            message: `Task #${taskIndex} marked as completed.`
        };
    },

    async deleteTask(profile: UserProfile, taskIndex: number): Promise<{ profile: UserProfile; message: string }> {
        const tasks = profile.tasks || [];
        // Adjust for 1-based index from user input
        const index = taskIndex - 1;

        if (index < 0 || index >= tasks.length) {
            return { profile, message: `Task #${taskIndex} not found.` };
        }

        const updatedTasks = tasks.filter((_, i) => i !== index);

        const updatedProfile = {
            ...profile,
            tasks: updatedTasks
        };

        await updateUserProfile(updatedProfile);

        return {
            profile: updatedProfile,
            message: `Task #${taskIndex} deleted.`
        };
    }
};
