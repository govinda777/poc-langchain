import os
import pytest
from langchain_openai import ChatOpenAI
from langchain_poc.summarizer import Summarizer

# Check if OPENAI_API_KEY is present
has_openai_key = "OPENAI_API_KEY" in os.environ and os.environ["OPENAI_API_KEY"]


@pytest.mark.skipif(not has_openai_key, reason="OpenAI API key not found")
def test_summarizer_integration():
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    summarizer = Summarizer(llm)

    text = (
        "O LangChain é um framework para desenvolver aplicações "
        "impulsionadas por modelos de linguagem. Ele permite que as "
        "aplicações se conectem a outras fontes de dados e interajam "
        "com o ambiente."
    )

    summary = summarizer.summarize(text)

    assert isinstance(summary, str)
    assert len(summary) > 0
    # Basic check to see if it's actually summarizing or returning garbage
    # (Hard to deterministically check content, but length/type is a good start)
