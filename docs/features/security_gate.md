# Feature: Security Gate for Sensitive Actions

## Contexto de Negócio
Para garantir a segurança dos usuários, ações sensíveis (como transferências financeiras ou alteração de dados cadastrais) não podem ser executadas apenas com base no fluxo conversacional. É necessário um mecanismo determinístico de verificação de identidade (Gate de Segurança).

Esta feature atende à **US02 - Usuário WhatsApp solicitando transferência bancária**.

## Pilar Reforçado
**Segurança em Ações Sensíveis** e **Auditabilidade**.

## Detalhes da Implementação

### 1. Novo Estado
Adicionados campos ao `AgentState`:
- `isVerified` (boolean): Indica se o usuário possui sessão autenticada forte.
- `securityOutcome` ('approved' | 'denied'): Resultado da verificação de segurança.

### 2. Fluxo (Grafo)
O fluxo foi alterado para interceptar intenções sensíveis:
1. `routerNode` detecta intenção "transfer".
2. Redireciona para `securityNode` (em vez de `action` ou `agent`).
3. `securityNode` verifica `isVerified`.
4. Se aprovado -> segue para `actionNode`.
5. Se negado -> segue para `agentNode` com instrução de negação.

### 3. Auditabilidade
Toda decisão de segurança gera logs explícitos:
- `Audit: User verified. Access granted.`
- `Audit: User NOT verified. Access denied.`

## Limitações Atuais
- A lógica de verificação (`isVerified`) está mockada no `hydrationNode` (apenas o usuário `user-123` é considerado verificado).
- A lista de intenções sensíveis está hardcoded no `routerNode`.

## Próximos Passos
- Integrar com provedor de autenticação real (ex: OAuth, Biometria via WhatsApp).
- Externalizar a configuração de intenções sensíveis.
