"""
Summarizer Module
=================

This module provides a class to summarize text using LangChain and OpenAI.
"""

from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.language_models.chat_models import BaseChatModel
import os

class Summarizer:
    """
    A class to summarize text using an LLM.

    Attributes:
        llm (BaseChatModel): The language model instance.
        chain (LLMChain): The summarization chain.
    """

    def __init__(self, api_key: Optional[str] = None, model_name: str = "gpt-3.5-turbo"):
        """
        Initialize the Summarizer.

        Args:
            api_key (Optional[str]): OpenAI API key. If not provided, it tries to fetch from env.
            model_name (str): The name of the model to use. Defaults to "gpt-3.5-turbo".

        Raises:
            ValueError: If the API key is missing.
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API Key is required.")

        self.llm = ChatOpenAI(
            openai_api_key=self.api_key,
            model_name=model_name,
            temperature=0.5
        )

        self.prompt_template = PromptTemplate(
            input_variables=["text"],
            template="Please summarize the following text:\n\n{text}\n\nSummary:"
        )

        self.chain = LLMChain(llm=self.llm, prompt=self.prompt_template)

    def summarize(self, text: str) -> str:
        """
        Summarizes the given text.

        Args:
            text (str): The text to be summarized.

        Returns:
            str: The summary of the text.

        Raises:
            ValueError: If the input text is empty.
        """
        if not text or not text.strip():
            raise ValueError("Input text cannot be empty.")

        try:
            result = self.chain.run(text)
            return result.strip()
        except Exception as e:
            # Wrap exceptions to ensure they are handled gracefully by the caller
            raise RuntimeError(f"Failed to summarize text: {str(e)}") from e
