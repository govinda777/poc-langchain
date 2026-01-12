from langchain_poc.main import main

def test_main_function(capsys):
    """
    Test the main function to ensure it runs without errors.
    """
    main()
    captured = capsys.readouterr()
    assert "LangChain POC initialized." in captured.out
