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

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base).
   - Adicione sua chave da OpenAI:
     ```
     OPENAI_API_KEY=sk-...
     ```

## 🛠 Como Usar

### Funcionalidade de Resumo

O projeto inclui um módulo `Summarizer` que utiliza LLMs para resumir textos.

Exemplo de uso em Python:

```python
from src.summarizer import Summarizer

# Instancie o sumarizador (certifique-se de ter OPENAI_API_KEY no .env)
summarizer = Summarizer()

texto = "Seu texto longo aqui..."
resumo = summarizer.summarize(texto)

print(resumo)
```

## ✅ Testes e Qualidade

O projeto utiliza `pytest` para testes, `black` para formatação e `pre-commit` para hooks de segurança e qualidade.

### Executar testes

```bash
pytest
```

### Configurar Pre-commit (Hooks)

Para instalar os hooks do Git (incluindo verificação de segredos e formatação):

```bash
pre-commit install
```

## 📂 Estrutura do Projeto

```
poc-langchain/
├── docs/               # Documentação do projeto
├── src/                # Código fonte
│   ├── summarizer.py   # Módulo de resumo
│   └── ...
├── tests/              # Testes automatizados
├── .github/            # Workflows de CI/CD
├── .pre-commit-config.yaml # Configuração de hooks do Git
├── .env.example        # Modelo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── README.md           # Este arquivo
└── requirements.txt    # Dependências do projeto
```

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE) (ou a licença presente no repositório).
