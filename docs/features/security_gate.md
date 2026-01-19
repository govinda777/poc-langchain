# Feature: Security Gate (US02)

## Visão Geral
Esta funcionalidade implementa um mecanismo de controle de acesso (Security Gate) dentro do grafo do agente cognitivo. O objetivo é garantir que ações sensíveis (como transações financeiras) só sejam executadas por usuários devidamente autenticados.

## Pilar Reforçado
**Segurança e Auditabilidade**
- Garante autenticação forte para operações críticas.
- Gera logs de auditoria para decisões de acesso (bloqueio/permissão).

## User Story Relacionada
**US02 – Usuário WhatsApp solicitando transferência bancária**
- "Dado que o usuário está pedindo uma transferência..."
- "Então o agente deve interromper o fluxo... e exigir autenticação."

## Implementação Técnica

### Fluxo no Grafo
1. **Perception**: Agente recebe a mensagem.
2. **Router**: Identifica a intenção. Se for `transfer` ou `transferir`, classifica como `sensitive`.
3. **Security Node**:
    - Verifica o estado `isVerified` do usuário (sessão atual).
    - Se `true`: Define `securityOutcome = 'approved'` e loga "Audit: Allowed sensitive action...".
    - Se `false`: Define `securityOutcome = 'denied'` e loga "Audit: Blocked sensitive action...".
4. **Conditional Edge**:
    - Se `approved`: Encaminha para `Action Node`.
    - Se `denied`: Encaminha para `Agent Node`.
5. **Agent Node**:
    - Se receber um outcome `denied`, gera uma resposta solicitando autenticação.

### Estado (AgentState)
Novos campos adicionados:
- `isVerified: boolean`: Indica se o usuário está autenticado na sessão atual.
- `securityOutcome: 'approved' | 'denied'`: Resultado da verificação de segurança.

## Auditoria
O sistema gera logs no console (stdout) para cada decisão de segurança:
- `Audit: Allowed sensitive action for verified user.`
- `Audit: Blocked sensitive action for unverified user.`

## Limitações e Próximos Passos
- **Limitação Atual**: A flag `isVerified` é apenas um estado em memória. Não há integração real com sistema de autenticação (OAuth, Biometria, etc).
- **Próximo Passo**: Integrar com um provedor de identidade real ou implementar um fluxo de "Login Link" que atualize essa flag após sucesso.
