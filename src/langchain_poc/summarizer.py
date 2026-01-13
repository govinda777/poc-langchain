from langchain_core.prompts import PromptTemplate
from langchain_core.language_models import BaseChatModel
from langchain_core.output_parsers import StrOutputParser


class Summarizer:
    """
    A class to summarize text using a Language Model.
    """

    def __init__(self, llm: BaseChatModel):
        """
        Initialize the Summarizer with a Language Model.

        Args:
            llm (BaseChatModel): The language model to use for summarization.
        """
        self.llm = llm
        self.prompt = PromptTemplate.from_template(
            "Resuma o seguinte texto em português de forma concisa:\n\n{text}"
        )
        self.chain = self.prompt | self.llm | StrOutputParser()

    def summarize(self, text: str) -> str:
        """
        Summarize the given text.

        Args:
            text (str): The text to summarize.

        Returns:
            str: The summary of the text.

        Raises:
            ValueError: If the input text is empty.
        """
        if not text or not text.strip():
            raise ValueError("O texto não pode ser vazio.")

        return self.chain.invoke({"text": text})
