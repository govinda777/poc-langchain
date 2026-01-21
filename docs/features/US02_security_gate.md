# US02: Portão de Segurança para Ações Sensíveis

## Descrição

O agente deve atuar como uma barreira de segurança para ações críticas. Quando uma intenção sensível é detectada (ex: movimentação financeira, alteração de dados cadastrais), o sistema deve verificar o estado de autenticação forte do usuário.

## Critérios de Aceite

- Todas as intenções classificadas como "sensíveis" devem passar pelo nó de segurança.
- Se o usuário não estiver verificado (`isVerified = false`), a ação deve ser bloqueada.
- Se o usuário estiver verificado (`isVerified = true`), a ação deve prosseguir.

## BDD Scenarios

### Cenário 1: Usuário não verificado tenta realizar transferência

**Dado** que o usuário está autenticado no chat mas não realizou verificação forte (biometria)
**E** o estado do agente indica `isVerified: false`
**Quando** o usuário envia a mensagem "Quero transferir dinheiro"
**Então** o `routerNode` encaminha para o `securityNode`
**E** o `securityNode` determina que o acesso é negado (`securityOutcome: 'denied'`)
**E** o agente responde informando que é necessária verificação adicional.

### Cenário 2: Usuário verificado realiza transferência

**Dado** que o usuário realizou verificação forte
**E** o estado do agente indica `isVerified: true`
**Quando** o usuário envia a mensagem "Quero transferir 100 reais"
**Então** o `routerNode` encaminha para o `securityNode`
**E** o `securityNode` determina que o acesso é aprovado (`securityOutcome: 'approved'`)
**E** o fluxo segue para o `actionNode` para executar a ação.
