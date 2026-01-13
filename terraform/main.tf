resource "pinecone_index" "cognitive_agent" {
  name      = "cognitive-agent-v1"
  dimension = 1536
  metric    = "cosine"
  spec = {
    serverless = {
      cloud  = "aws"
      region = "us-east-1"
    }
  }
}

resource "vercel_project" "poc_langchain" {
  name      = "poc-langchain"
  framework = "nextjs"
  
  git_repository = {
    type = "github"
    repo = "govinda777/poc-langchain" # Exemplo
  }
}

# Injeta as credenciais do Pinecone automaticamente no projeto Vercel
resource "vercel_project_environment_variable" "pinecone_api_key" {
  project_id = vercel_project.poc_langchain.id
  key        = "PINECONE_API_KEY"
  value      = var.pinecone_api_key
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "pinecone_index" {
  project_id = vercel_project.poc_langchain.id
  key        = "PINECONE_INDEX"
  value      = pinecone_index.cognitive_agent.name
  target     = ["production", "preview", "development"]
}

# Obs: O provisionamento do Vercel KV geralmente requer interação via CLI ou criação manual do Storage
# e posterior linkagem das variáveis (KV_REST_API_URL, KV_REST_API_TOKEN).
