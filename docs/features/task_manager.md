# Task Manager Feature (US07)

The Task Manager feature allows users to manage a personal todo list through the agent.

## Capabilities

*   **Add Task:** Create a new task.
*   **List Tasks:** View all pending and completed tasks.
*   **Complete Task:** Mark a specific task as done.
*   **Delete Task:** Remove a task from the list.

## Usage

| Action | Example Command |
| :--- | :--- |
| **Add** | "Add task Buy Milk" |
| **List** | "List my tasks", "Minha lista" |
| **Complete** | "Complete task 1", "Fazer tarefa 2" |
| **Delete** | "Delete task 3", "Apagar tarefa 1" |

## Technical Implementation

### Components

*   **Tool:** `src/server/agent/tools/taskManager.ts` contains the logic for manipulating the task list.
*   **State:** The `UserProfile` in `src/server/agent/state.ts` now includes a `tasks` array.
*   **Persistence:** Tasks are stored in the `UserProfile` object. In the current mock implementation (`userStore.ts`), this is in-memory but structured to support database persistence.

### Integration

*   **Router:** The `routerNode` detects keywords like 'task', 'tarefa', 'todo', 'lista' and routes to the `actionNode`.
*   **Action Node:** The `actionNode` parses the specific intent (add/list/complete/delete) and arguments, calls the tool, and updates the state.

## Testing

*   **Unit Tests:** `src/server/agent/__tests__/taskManager.test.ts`
*   **Integration Tests:** `src/server/agent/__tests__/feature_tasks.test.ts`
