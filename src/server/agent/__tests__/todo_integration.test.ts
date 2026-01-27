import { graph } from '../graph';
import { HumanMessage } from '@langchain/core/messages';

describe('Todo Flow Integration', () => {
    // Increase timeout for integration
    jest.setTimeout(10000);

    test('should add and list tasks via graph', async () => {
        // 1. Add Task
        const input1 = {
            messages: [new HumanMessage("Adicionar tarefa: Integrar testes")],
            userId: 'integration-user',
            sessionId: 'test-session'
        };

        const resultAdd = await graph.invoke(input1);

        // Assert the final message confirms addition
        const finalMsgAdd = resultAdd.messages[resultAdd.messages.length - 1];
        expect(finalMsgAdd.content).toContain('Tarefa adicionada');
        // Check state update
        expect(resultAdd.userProfile.tasks).toHaveLength(1);
        expect(resultAdd.userProfile.tasks[0].description).toBe('Integrar testes');

        // 2. List Tasks
        // Pass the modified profile back to simulate persistence
        const input2 = {
            messages: [new HumanMessage("Listar tarefas")],
            userId: 'integration-user',
            sessionId: 'test-session',
            userProfile: resultAdd.userProfile
        };

        const resultList = await graph.invoke(input2);

        const finalMsgList = resultList.messages[resultList.messages.length - 1];
        expect(finalMsgList.content).toContain('1. [ ] Integrar testes');
    });

    test('should complete task via graph', async () => {
        const input = {
            messages: [new HumanMessage("Concluir tarefa 1")],
            userId: 'integration-user-2',
            sessionId: 'test-session-2',
            userProfile: {
                id: 'integration-user-2',
                name: 'Test User',
                preferences: {},
                tasks: [{
                    id: '1',
                    description: 'Existing Task',
                    completed: false,
                    createdAt: Date.now()
                }]
            }
        };

        const resultComplete = await graph.invoke(input);

        const finalMsgComplete = resultComplete.messages[resultComplete.messages.length - 1];
        expect(finalMsgComplete.content).toContain('concluída');
        expect(resultComplete.userProfile.tasks[0].completed).toBe(true);
    });
});
