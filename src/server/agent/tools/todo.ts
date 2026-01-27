import { UserProfile, Task } from '../state';

export function addTask(profile: UserProfile, description: string): string {
    if (!profile.tasks) {
        profile.tasks = [];
    }

    const newTask: Task = {
        id: Date.now().toString(),
        description,
        completed: false,
        createdAt: Date.now()
    };

    profile.tasks.push(newTask);
    console.log(`Audit: Added task "${description}" for user ${profile.id}`);
    return `Tarefa adicionada com sucesso: "${description}"`;
}

export function listTasks(profile: UserProfile): string {
    if (!profile.tasks || profile.tasks.length === 0) {
        return "Você não tem tarefas pendentes.";
    }

    const tasksList = profile.tasks.map((t, index) => {
        const status = t.completed ? "[x]" : "[ ]";
        return `${index + 1}. ${status} ${t.description}`;
    }).join('\n');

    return `Suas tarefas:\n${tasksList}`;
}

export function completeTask(profile: UserProfile, index: number): string {
    if (!profile.tasks || index < 1 || index > profile.tasks.length) {
        return "Índice de tarefa inválido.";
    }

    const task = profile.tasks[index - 1];
    task.completed = true;
    console.log(`Audit: Completed task "${task.description}" for user ${profile.id}`);
    return `Tarefa "${task.description}" marcada como concluída.`;
}
