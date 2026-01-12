# POC LangChain

Este repositório contém uma Prova de Conceito (POC) focada na exploração e implementação de funcionalidades utilizando o framework [LangChain](https://github.com/langchain-ai/langchain).

## 🎯 Objetivo

O objetivo desta POC é demonstrar como o LangChain pode ser utilizado para criar aplicações baseadas em LLMs (Large Language Models) que são capazes de:
- Manter contexto de conversação (Memory).
- Realizar cadeias de pensamento e execução (Chains).
- Utilizar ferramentas externas (Agents).
- Recuperar informações de bases de dados vetoriais (RAG - Retrieval Augmented Generation).

## 🏗 Arquitetura

A arquitetura básica do projeto está documentada em [docs/architecture.md](docs/architecture.md).

## 📋 Pré-requisitos

Para executar este projeto, você precisará de:

- **Python 3.9+** instalado.
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

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure o pre-commit (para desenvolvimento):
   ```bash
   pre-commit install
   ```

5. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base).
   - Adicione sua chave da OpenAI:
     ```
     OPENAI_API_KEY=sk-...
     ```

## 🛠 Como Usar

### Executando a aplicação

Execute o módulo principal para iniciar a aplicação:

```bash
python -m src.langchain_poc.main
```

### Executando testes

Para rodar os testes automatizados:

```bash
pytest
```

## 📂 Estrutura do Projeto

```
poc-langchain/
├── docs/                   # Documentação do projeto
│   └── architecture.md     # Diagrama de arquitetura
├── src/
│   └── langchain_poc/      # Código fonte da aplicação
│       ├── __init__.py
│       └── main.py
├── tests/                  # Testes automatizados
│   ├── __init__.py
│   └── test_main.py
├── .env.example            # Modelo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── .pre-commit-config.yaml # Configuração de hooks git
├── README.md               # Este arquivo
└── requirements.txt        # Dependências do projeto
```

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).
