# POC LangChain

Este repositório contém uma Prova de Conceito (POC) focada na exploração e implementação de funcionalidades utilizando o framework [LangChain](https://github.com/langchain-ai/langchain).

## 🎯 Objetivo

O objetivo desta POC é demonstrar como o LangChain pode ser utilizado para criar aplicações baseadas em LLMs (Large Language Models) que são capazes de:
- Manter contexto de conversação (Memory).
- Realizar cadeias de pensamento e execução (Chains).
- Utilizar ferramentas externas (Agents).
- Recuperar informações de bases de dados vetoriais (RAG - Retrieval Augmented Generation).

## ✨ Funcionalidades

- **Resumo de Texto**: Uma ferramenta para resumir textos longos. [Documentação](docs/features/summarization.md)

## 🏗 Arquitetura

A arquitetura básica do projeto está documentada em [docs/architecture.md](docs/architecture.md).

## 📋 Pré-requisitos

Para executar este projeto, você precisará de:

- **Python 3.10+** instalado.
- Uma chave de API da **OpenAI** (ou outro provedor de LLM compatível).

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/poc-langchain.git
   cd poc-langchain
   ```

2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/Mac
   # ou
   .venv\Scripts\activate  # Windows
   ```

3. Instale as dependências (incluindo ferramentas de dev/teste):
   ```bash
   pip install -r requirements.txt
   ```

4. Instale os Hooks do Git (Pre-commit):
   ```bash
   pre-commit install
   ```
   *Isso garante verificações de segurança e formatação antes de cada commit.*

5. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base).
   - Adicione sua chave da OpenAI:
     ```
     OPENAI_API_KEY=sk-...
     ```

## 🛠 Desenvolvimento e Testes

### Executar Testes
```bash
pytest
```

### Verificar Estilo e Segurança
```bash
pre-commit run --all-files
```

## 📂 Estrutura do Projeto

```
poc-langchain/
├── docs/               # Documentação do projeto
├── src/                # Código fonte
│   └── langchain_poc/  # Pacote principal
├── tests/              # Testes automatizados
├── .github/            # Workflows de CI/CD
├── .pre-commit-config.yaml # Configuração dos Hooks do Git
├── .env.example        # Modelo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── README.md           # Este arquivo
└── requirements.txt    # Dependências do projeto
```

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE) (ou a licença presente no repositório).
