# Funcionalidade de Resumo de Texto

O módulo `langchain_poc.summarizer` fornece uma funcionalidade simples para resumir textos utilizando LLMs.

## Uso

```python
from langchain_openai import ChatOpenAI
from langchain_poc.summarizer import Summarizer

# Inicialize o LLM
llm = ChatOpenAI(api_key="...", model="gpt-3.5-turbo")

# Inicialize o Summarizer
summarizer = Summarizer(llm)

# Gere o resumo
texto_longo = """
O LangChain é um framework para desenvolver aplicações impulsionadas por modelos de linguagem.
Ele permite que as aplicações se conectem a outras fontes de dados e interajam com o ambiente.
"""

resumo = summarizer.summarize(texto_longo)
print(resumo)
```

## Configuração

Certifique-se de que as dependências estão instaladas e a chave da API está configurada no ambiente.
