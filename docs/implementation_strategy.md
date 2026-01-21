# Planejamento Detalhado da Implementação: POC LangChain Cognitive Agent

Este documento descreve o roteiro de execução para a construção da Prova de Conceito (POC) do Agente Cognitivo.

## 1. Estratégia de Execução

A implementação seguirá uma abordagem **Incremental** e **Orientada a Comportamento (BDD)**. Cada fase entrega uma peça funcional da arquitetura cognitiva, validada por testes automatizados e critérios de aceite claros.

**Metodologia**: "Baby Steps" (Passos pequenos e seguros).
**Foco**: Validar a arquitetura LangGraph + Privy + Memória antes de avançar para UI complexa.

---

## 2. Roadmap de Fases

### Fase 1: Infraestrutura e Alicerce (Semana 1)

**Objetivo**: Garantir que todos os serviços externos (os "órgãos" do agente) estejam provisionados e conectados.

- **Atividades**:
  1.  **Vercel Init**: Setup do projeto Next.js com App Router.
  2.  **Redis (Memória de Trabalho)**: Provisionar Vercel KV.
  3.  **Vector DB (Memória Semântica)**: Criar Index no Pinecone/Supabase e configurar scripts de ingestão.
  4.  **Privy (Identidade)**: Configurar App ID, Segredos e Políticas de Auth.
  5.  **Environment Sync**: Validar conexão de todas as variáveis de ambiente locais e remotas.

### Fase 2: O Cérebro Determinístico (Semana 2)

**Objetivo**: Implementar a máquina de estados (LangGraph) que decide o fluxo da conversa.

- **Atividades**:
  1.  **LangGraph Setup**: Definir o `StateGraph` inicial e o schema do `AgentState`.
  2.  **Perception Node**: Normalização de input.
  3.  **Router Node**: Classificador de intenção (usando LLM) para decidir o próximo passo (Conversa, Ação, Dúvida).
  4.  **Action Node**: Execução de ferramentas simples (ex: Calculadora, Clima) como prova de conceito.

### Fase 3: Identidade e Memória Episódica (Semana 3)

**Objetivo**: Integrar o Privy para que o agente "saiba com quem está falando".

- **Atividades**:
  1.  **Hydration Node**: Implementar lookup de usuário (`getUserByPhoneNumber`).
  2.  **Auth Guard**: Criar lógica que bloqueia ações sensíveis para usuários "Guest" ou não autenticados.
  3.  **Metadata Sync**: Ler/Escrever preferências do usuário no Privy `app_metadata`.

### Fase 4: Observabilidade e Interfaces de Gestão (Semana 4)

**Objetivo**: Transformar a POC em um produto gerenciável e auditável.

- **Atividades**:
  1.  **Observabilidade**: Integrar **LangFuse** ou **LangSmith** para rastrear traces, latência e custos de cada interação.
  2.  **Backoffice (Admin)**: Painel restrito para:
      - Visualizar conversas em tempo real.
      - Gerenciar status de usuários.
      - Ajustar prompts de sistema (System Prompts) dinamicamente.
  3.  **Dashboard do Usuário**: Área logada onde o cliente pode:
      - Ver seu próprio histórico.
      - Conectar contas (Google, Stripe) via OAuth.
  4.  **Webhooks**: Implementar endpoint `/api/webhook/whatsapp` com validação de assinatura para receber mensagens reais.

---

## 3. Comandos e Interação com o Agente

O agente suportará comandos especiais ("Slash Commands") para facilitar testes e operações de power users:

| Comando  | Descrição                                               | Permissão Necessária |
| :------- | :------------------------------------------------------ | :------------------- |
| `/reset` | Limpa a memória de curto prazo (Redis) da sessão atual. | Todos                |
| `/debug` | Exibe o JSON do estado interno atual do LangGraph.      | Admin/Dev            |
| `/stats` | Mostra consumo de tokens e custo da sessão atual.       | Admin                |
| `/help`  | Lista as capacidades e ferramentas disponíveis.         | Todos                |

---

## 4. Detalhamento Técnico das Tarefas (Baby Steps)

### Aprovisionamento

- [ ] Criar projeto na Vercel.
- [ ] Configurar `OPENAI_API_KEY`.
- [ ] Configurar `PRIVY_APP_ID`.
- [ ] Configurar URL e Tokens do Redis/KV.
- [ ] Configurar projeto no LangSmith/LangFuse (Observabilidade).

### Core Engine (src/server/agent)

- [ ] Criar `graph.ts`: Definição da topologia.
- [ ] Criar `nodes.ts`: Implementação das funções de cada nó.
- [ ] Criar `state.ts`: Definição TypeScript do objeto de estado.
- [ ] Criar `commands.ts`: Parser de slash commands.

### Interfaces (src/app)

- [ ] `/dashboard`: Área do usuário (NextAuth/Privy Protected).
- [ ] `/admin`: Área de gestão (Role Based Access).
- [ ] `/api/webhooks`: Handlers para eventos externos.

### Testes BDD (features/)

- [ ] `identity.feature`: Cenários de login e permissão.
- [ ] `reasoning.feature`: Cenários de roteamento e uso de ferramentas.
- [ ] `memory.feature`: Cenários de persistência de contexto.
- [ ] `integrations.feature`: Cenários End-to-End com Google/Stripe.

---

## 5. Definição de Ferramentas (Tools e Integrações)

Implementaremos "Tools" modulares que o LangGraph pode invocar:

1.  **Weather**: (`GET` OpenWeather) - Clima atual.
2.  **Google Calendar**: (`POST` GCal API) - "Agendar reunião com X".
3.  **Google Contacts**: (`GET` People API) - "Qual o email do João?".
4.  **Google Drive**: (`GET` Drive API) - "Resuma o documento X".
5.  **Stripe**: (`GET/POST` Stripe API) - "Gerar link de pagamento".
6.  **SendGrid**: (`POST` Mail Send) - "Enviar resumo por email".

## 6. Próximos Passos Imediatos

Iniciar a **Fase 1**, começando pelo setup do Next.js e instalação das dependências core (`langchain`, `langgraph`, `@vercel/ai`).
