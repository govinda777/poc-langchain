# US05 - Previsão do Tempo

## Descrição
Como usuário, quero saber a previsão do tempo para uma determinada cidade para poder planejar minhas atividades.

## Critérios de Aceitação
1. O agente deve identificar a intenção de consulta de clima quando o usuário mencionar palavras-chave como "clima", "tempo", "previsão".
2. O agente deve identificar a localidade mencionada na mensagem do usuário.
3. Se a localidade não for encontrada, o agente deve assumir uma localidade padrão ou solicitar ao usuário (para este MVP, assumiremos uma localidade mockada se não detectada, ou a ferramenta lidará com isso).
4. O sistema deve retornar uma resposta textual com a condição climática (ex: "Ensolarado", "Chuvoso") e temperatura.

## Cenários de Teste
- **Cenário 1:** Usuário pergunta "Como está o clima em São Paulo?"
  - **Resultado Esperado:** O agente responde com a previsão para São Paulo.
- **Cenário 2:** Usuário pergunta "Vai chover hoje?"
  - **Resultado Esperado:** O agente responde com a previsão (pode assumir localização padrão ou perguntar).

## Notas Técnicas
- Utilizar `weatherTool` (mockada para este estágio).
- Integração via `actionNode`.
