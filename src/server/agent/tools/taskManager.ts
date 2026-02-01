import { UserProfile, Task } from '../state';
import { saveUserProfile } from '../services/userStore';

export async function addTask(profile: UserProfile, description: string): Promise<string> {
    if (!profile.tasks) {
        profile.tasks = [];
    }

    const newTask: Task = {
        id: Date.now().toString(),
        title: description,
        status: 'pending',
        createdAt: Date.now()
    };

    profile.tasks.push(newTask);
    await saveUserProfile(profile);

    return `Task added: "${description}"`;
}

export async function listTasks(profile: UserProfile): Promise<string> {
    if (!profile.tasks || profile.tasks.length === 0) {
        return "You have no tasks.";
    }

    const taskList = profile.tasks
        .map(t => `- [${t.status === 'completed' ? 'x' : ' '}] ${t.title}`)
        .join('\n');

    return `Your tasks:\n${taskList}`;
}
