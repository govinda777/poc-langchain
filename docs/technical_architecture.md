# Documentação Técnica: Arquitetura Cognitiva v2.0

## 1. Visão Geral da Arquitetura
O sistema implementa uma **Máquina de Estados Finita (FSM)** utilizando **LangGraph** para orquestrar o raciocínio do agente. A persistência é garantida por uma estratégia de memória em três camadas inspirado no modelo cognitivo de Atkinson-Shiffrin, e a identidade é centralizada pelo **Privy**.

## 2. Stack Tecnológico

| Camada | Tecnologia | Função | Justificativa |
| :--- | :--- | :--- | :--- |
| **Frontend/API** | **Next.js 14+** (App Router) | Framework Web | Padrão de mercado, SSR, API Routes serverless. |
| **Orquestração** | **LangGraph** | Cérebro / FSM | Controle determinístico de fluxo, loops e persistência de estado. |
| **LLM** | **OpenAI (GPT-4o)** | Inteligência | Raciocínio complexo e geração de texto. |
| **Identidade** | **Privy** | Auth & User Store | Mapping telefone-usuário, gestão de carteiras/keys, metadados. |
| **Memória (Hot)** | **Redis (Vercel KV)** | State Checkpoint | Baixa latência para memória de trabalho. |
| **Memória (Cold)** | **Pinecone / PgVector** | RAG / Knowledge | Busca semântica em grandes volumes de dados. |

## 3. Modelo de Memória Científica (Atkinson-Shiffrin)

A arquitetura replica o processamento humano de informação:

1.  **Memória Sensorial (Input)**:
    - Ocorre no nó `PerceptionNode`.
    - Normaliza entradas de diferentes canais (WhatsApp, Web, API).
    - Vida útil: Apenas durante a transição do input.

2.  **Memória de Curto Prazo / Trabalho (Working Memory)**:
    - Implementada via **LangGraph State** persistido no **Redis**.
    - Mantém o contexto imediato da conversa ("O que você acabou de perguntar?").
    - **Capacity Limit**: Gerenciado por *windowing* ou *summary* automático pelo LLM.

3.  **Memória de Longo Prazo (Long-term Memory)**:
    - **Declarativa (Fatos)**: Recuperada via RAG (Vector DB) no nó `RAGNode`. Ex: Políticas da empresa, manuais.
    - **Episódica (Vivência)**: Armazenada no `app_metadata` do **Privy**. Ex: "O usuário prefere ser tratado formalmente", "Já comprou o produto X".

## 4. Diagramas de Arquitetura

### A. O Grafo Cognitivo (LangGraph Topology)

```mermaid
graph TD
    classDef memory fill:#f9f,stroke:#333,stroke-width:2px;
    classDef action fill:#bbf,stroke:#333,stroke-width:2px;
    classDef decision fill:#ff9,stroke:#333,stroke-width:4px;

    Start((Início)) --> Hydration[Hydration Node <br/>(Privy Sync)]:::memory
    Hydration --> Perception[Perception Node]
    Perception --> Router{Router / Classifier}:::decision

    Router -- "Info / Dúvida" --> RAG[RAG Node <br/>(Vector Search)]:::memory
    Router -- "Conversa Geral" --> Chat[General Chat Node]
    Router -- "Ação Sensível" --> AuthCheck{Auth Guard}:::decision

    AuthCheck -- "Role: Guest" --> RequestAuth[Generate Privy Link]:::action
    AuthCheck -- "Role: User" --> ToolExec[Execute Tool]:::action

    RAG --> Generator[Response Generator]
    Chat --> Generator
    ToolExec --> Generator
    RequestAuth --> Generator

    Generator --> End((Fim / Wait Input))
```

### B. Fluxo de Dados e Identidade

1.  **Requisição**: O WhatsApp envia um webhook com `phone_number`.
2.  **Resolução de Identidade**: O backend chama `privy.getUserByPhoneNumber(phone)`.
    - Se *encontrado*: O ID estável é recuperado. O grafo carrega o histórico desse ID.
    - Se *novo*: Um usuário provisório é criado no Privy.
3.  **Processamento**: O LangGraph executa os passos (Checkpoints salvos no Redis a cada passo).
4.  **Resposta**: O texto final é enviado de volta via API do WhatsApp.

## 5. Estratégia de Deploy (Vercel)

- **Serverless Functions**: Os nós do LangGraph rodam como funções serverless (tempo limite configurado para suportar chains longas ou uso de *streaming*).
- **Edge Middleware**: Para verificar assinaturas de webhooks (segurança).
- **Environment Management**: Segredos (OPENAI_KEY, PRIVY_APP_ID) gerenciados no Vercel Dashboard.
