import pytest
from unittest.mock import MagicMock, patch
from src.summarizer import Summarizer

@pytest.fixture
def mock_openai_key(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

def test_summarizer_init_no_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(ValueError, match="OpenAI API Key is required"):
        Summarizer(api_key=None)

def test_summarizer_init_with_key(mock_openai_key):
    # Should not raise
    s = Summarizer()
    assert s.api_key == "test-key"

@patch("src.summarizer.ChatOpenAI")
@patch("src.summarizer.LLMChain")
def test_summarize_success(mock_chain, mock_chat, mock_openai_key):
    # Setup mock
    chain_instance = mock_chain.return_value
    chain_instance.run.return_value = "This is a summary."

    s = Summarizer()
    result = s.summarize("Some long text")

    assert result == "This is a summary."
    chain_instance.run.assert_called_once_with("Some long text")

def test_summarize_empty_text(mock_openai_key):
    s = Summarizer(api_key="test") # Explicit key to bypass env check if fixture fails
    with pytest.raises(ValueError, match="Input text cannot be empty"):
        s.summarize("")

    with pytest.raises(ValueError, match="Input text cannot be empty"):
        s.summarize("   ")

@patch("src.summarizer.ChatOpenAI")
@patch("src.summarizer.LLMChain")
def test_summarize_api_error(mock_chain, mock_chat, mock_openai_key):
    chain_instance = mock_chain.return_value
    chain_instance.run.side_effect = Exception("API Error")

    s = Summarizer()
    with pytest.raises(RuntimeError, match="Failed to summarize text: API Error"):
        s.summarize("text")
