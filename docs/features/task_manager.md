# Feature: Gestão de Tarefas (Task Manager)

**User Story:** US07

## Description
The agent provides a simple task management system allowing users to add, list, and complete tasks. These tasks are associated with the user's profile and simulated as long-term memory state.

## Functionality
1.  **Add Task**: Users can add a new task with a description.
2.  **List Tasks**: Users can view all their current pending and completed tasks.
3.  **Complete Task**: Users can mark a specific task as completed.

## Inputs/Outputs

| Intent | Input Example | Action | Output Example |
| :--- | :--- | :--- | :--- |
| `add_task` | "Adicionar tarefa: Comprar leite" | `todoTool.addTask` | "Tarefa adicionada com sucesso." |
| `list_tasks` | "Quais são minhas tarefas?" | `todoTool.listTasks` | "Suas tarefas:\n1. [ ] Comprar leite" |
| `complete_task` | "Concluir tarefa 1" | `todoTool.completeTask` | "Tarefa 'Comprar leite' marcada como concluída." |

## Security & Audit
- **Access Control**: Users can only access their own tasks (enforced by `UserProfile` isolation in `state.ts`).
- **Audit Logging**: All task modifications (Add/Complete) must generate an "Audit:" log entry visible in the server logs for traceability.

## Technical Implementation
- **Tool**: `src/server/agent/tools/todo.ts`
- **State**: `tasks` array in `UserProfile` (`src/server/agent/state.ts`).
- **Persistence**: In-memory (for POC), attached to `userProfile`.
