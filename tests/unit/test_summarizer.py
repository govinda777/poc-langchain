import pytest
from unittest.mock import MagicMock
from langchain_poc.summarizer import Summarizer
from langchain_core.language_models import BaseChatModel


class MockLLM(BaseChatModel):
    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        return "Resumo simulado"

    @property
    def _llm_type(self):
        return "mock"


def test_summarizer_initialization():
    mock_llm = MagicMock(spec=BaseChatModel)
    summarizer = Summarizer(mock_llm)
    assert summarizer.llm == mock_llm


def test_summarize_valid_text():
    # Setup mock chain behavior
    mock_llm = MagicMock(spec=BaseChatModel)
    # Mocking the chain invoke is tricky because it's constructed in __init__
    # So we better mock the components or use a FakeLLM that works with the chain

    # Let's mock the chain attribute directly for unit testing the logic
    summarizer = Summarizer(mock_llm)
    summarizer.chain = MagicMock()
    summarizer.chain.invoke.return_value = "Resumo do texto."

    result = summarizer.summarize("Texto longo para resumir.")

    assert result == "Resumo do texto."
    summarizer.chain.invoke.assert_called_once_with(
        {"text": "Texto longo para resumir."}
    )


def test_summarize_empty_text_raises_error():
    mock_llm = MagicMock(spec=BaseChatModel)
    summarizer = Summarizer(mock_llm)

    with pytest.raises(ValueError, match="O texto não pode ser vazio"):
        summarizer.summarize("")

    with pytest.raises(ValueError, match="O texto não pode ser vazio"):
        summarizer.summarize("   ")
