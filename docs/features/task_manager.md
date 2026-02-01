# Task Manager (US07)

## Overview
The Task Manager allows users to create and list simple tasks ("lembretes"). It maintains a persistent state associated with the user profile.

## Usage
- **Add a task:** "Add task buy milk", "Lembrete comprar pão", "Nova tarefa estudar"
- **List tasks:** "List tasks", "quais minhas tarefas", "meus lembretes"

## Implementation
- **Tool:** `src/server/agent/tools/taskManager.ts`
- **State:** `UserProfile` updated to include `tasks: Task[]`.
- **Persistence:** Mocked in `userStore.ts`.

## Testing
- Unit tests: `src/server/agent/__tests__/tools/taskManager.test.ts`
- Integration tests: `src/server/agent/__tests__/taskManagerFlow.test.ts`
