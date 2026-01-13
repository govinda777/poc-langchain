terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    pinecone = {
      source  = "skyscrapr/pinecone"
      version = "0.0.14" // Exemplo de versão
    }
  }
}

provider "vercel" {
  # As chaves são carregadas via variáveis de ambiente: VERCEL_API_TOKEN
}

provider "pinecone" {
  # Carregado via PINECONE_API_KEY
}
