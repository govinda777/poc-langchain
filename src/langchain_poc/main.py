import os
from dotenv import load_dotenv

load_dotenv()

def main():
    """
    Main entry point for the LangChain POC.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Warning: OPENAI_API_KEY not found in environment variables.")

    print("LangChain POC initialized.")

if __name__ == "__main__":
    main()
