# US01 - Retorno do Cliente (Identidade e Memória)

## Descrição
Feature que permite ao agente reconhecer um usuário que retorna (ex: João) e retomar o contexto da conversa anterior.

## Pilar Reforçado
- **Identidade Unificada**: Mapeamento do usuário via `userId`.
- **Memória de Longo Prazo**: Armazenamento e recuperação do `lastConversationContext`.

## Implementação Técnica
- **AgentState**: Adicionado campo `lastConversationContext` ao `UserProfile`.
- **UserStore**: Mock atualizado para simular persistência de contexto.
- **AgentNode**: Lógica adicionada para condicionar a saudação à existência de contexto prévio.
- **Logs**: Adicionados logs de auditoria ("Audit: Using prior context...") para explicar a decisão do agente.

## Testes
- `src/server/agent/__tests__/us01_persistence.test.ts`: Valida que o usuário "joao-web" recebe a saudação contextualizada.

## Limitações Atuais
- O armazenamento é em memória (Mock). Reiniciar o servidor perde os dados (exceto os hardcoded).
- A detecção de contexto é manual (string fixa). No futuro, deve ser gerada via LLM summarization.

## Próximos Passos
- Implementar persistência real (Banco de Dados).
- Implementar "Memory Node" que resume a conversa atual e salva no `lastConversationContext` ao final da sessão.
