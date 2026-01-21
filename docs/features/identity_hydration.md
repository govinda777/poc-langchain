# Identity Hydration (Identity-First)

## Descrição

Implementação do princípio "Identity-First", onde a identidade do usuário é resolvida e carregada (hidratada) no estado do agente _antes_ de qualquer processamento de intenção. Isso permite que o agente reconheça o usuário através de canais (Web, WhatsApp, etc.) caso o ID seja mapeado corretamente.

## Pilares Atendidos

- **Identidade Unificada**: Centraliza o carregamento de perfil.
- **US01 (Cliente Web, retorno)**: Permite que o agente reconheça "João" e carregue suas preferências assim que ele envia uma mensagem.

## Implementação Técnica

- **`AgentState`**: Expandido para incluir `userId` (entrada) e `userProfile` (saída da hidratação).
- **`hydrationNode`**: Novo nó de entrada do grafo. Consulta um `User Store` (atualmente mockado) e preenche `state.userProfile`.
- **Fluxo**: `hydration` -> `perception` -> `router` ...

## Dados de Memória

- **Curto Prazo**: O `userProfile` carregado fica disponível na memória de trabalho do grafo durante a execução.
- **Longo Prazo**: O `User Store` (mockado em `src/server/agent/services/userStore.ts`) representa a persistência.

## Auditoria

O nó de hidratação loga:

- Se o usuário foi encontrado ou se um perfil transiente foi criado.
- Qual perfil foi carregado para a sessão.
