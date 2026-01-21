# Arquitetura da POC LangChain

Este documento descreve a arquitetura de alto nível planejada para a Prova de Conceito (POC) utilizando LangChain.

## Visão Geral

A POC visa demonstrar a capacidade do LangChain de orquestrar interações entre Modelos de Linguagem (LLMs) e ferramentas externas ou bases de conhecimento.

```mermaid
graph TD
    User[Usuário] --> Interface[Interface (CLI/Web)]
    Interface --> App[Aplicação LangChain]
    App -->|Prompt| LLM[LLM (OpenAI/Outros)]
    App -->|Consulta| VectorStore[Vector Store (ChromaDB/FAISS)]
    App -->|Ação| Tools[Ferramentas (Search/Calc)]
    LLM -->|Resposta| App
    VectorStore -->|Contexto| App
    Tools -->|Resultado| App
    App -->|Resposta Final| Interface
```

## Componentes

### 1. Interface do Usuário

- Ponto de entrada para interação (pode ser linha de comando ou interface web simples como Streamlit).
- Captura a intenção do usuário.

### 2. Aplicação LangChain (Orquestrador)

- **Chains**: Sequências de chamadas para LLMs ou outras utilidades.
- **Agents**: Entidades que decidem quais ferramentas usar com base na entrada do usuário.
- **Memory**: Mantém o contexto da conversa.

### 3. LLM (Large Language Model)

- Motor de raciocínio e geração de texto (ex: GPT-3.5, GPT-4, Llama 2).

### 4. Vector Store (Opcional - RAG)

- Armazena embeddings de documentos para recuperação semântica.
- Permite que o LLM responda perguntas sobre dados específicos da empresa.

### 5. Ferramentas (Tools)

- Conectores externos que permitem ao modelo realizar ações (pesquisar na web, calcular, acessar API).
