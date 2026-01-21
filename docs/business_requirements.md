# Documentação de Negócio: Arquitetura Cognitiva v2.0

## 1. Visão do Produto

Criar um **Agente de Inteligência Artificial Cognitiva** que transcende o conceito de "Chatbot". Diferente de bots tradicionais que sofrem de amnésia e falta de contexto, este agente possui **identidade**, **memória persistente** e **raciocínio determinístico**. Ele reconhece o usuário em múltiplos canais (Web, WhatsApp) e mantém uma conversa coerente ao longo de dias ou meses.

## 2. O Problema de Negócio

### A. Fragmentação da Identidade

**Cenário Atual**: O usuário fala com a marca no Instagram, depois no WhatsApp, e depois loga no site. Para a empresa, são três pessoas diferentes.
**Impacto**: Experiência desconexa, repetição de informações, frustração.

### B. "Amnésia Digital" (Lack of Context)

**Cenário Atual**: LLMs padrão têm uma janela de contexto limitada. Se a conversa é longa, o início é esquecido.
**Impacto**: O agente esquece preferências, acordos ou o histórico do problema do cliente.

### C. Alucinação e Falta de Controle

**Cenário Atual**: Bots puramente generativos podem inventar processos ou prometer o impossível.
**Impacto**: Risco reputacional e legal.

## 3. A Solução: Arquitetura Cognitiva com Identidade Unificada

### Pilares de Valor

1.  **Identity-First (Privy)**: O usuário é o centro. Não importa o canal, o agente sabe quem é, qual seu saldo, e suas permissões.
2.  **Memória Científica (Atkinson-Shiffrin)**:
    - _Curto Prazo_: Lembra do que você acabou de falar.
    - _Longo Prazo_: Lembra do seu aniversário e que você prefere respostas curtas.
3.  **Segurança em Ações Sensíveis**: O agente pode _falar_ sobre produtos livremente, mas para _comprar_ ou _transferir_, ele exige autenticação forte (biometria/carteira), mesmo dentro do WhatsApp.

## 4. Casos de Uso (User Stories)

| ID       | Persona              | Cenário                                   | Resultado Esperado                                                                                        |
| :------- | :------------------- | :---------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **US01** | **Cliente Web**      | Retorna ao site após 1 semana.            | O agente diz: "Olá, João! Pensou naquela proposta de seguro que discutimos semana passada?"               |
| **US02** | **Usuário WhatsApp** | Pede uma transferência bancária via chat. | O agente responde: "Para sua segurança, autentique-se aqui" (link seguro). Após auth, a transação ocorre. |
| **US03** | **Suporte Técnico**  | Pergunta técnica complexa.                | O agente consulta a base de conhecimento (RAG) e responde com precisão, sem inventar dados.               |

## 5. Diferenciais Competitivos

- **Persistência**: O agente "vive" junto com o cliente.
- **Auditabilidade**: Cada decisão do agente ("Por que ofereci este produto?") é logada e explicável.
- **Multimodalidade Segura**: Traz a segurança da Web3/Biometria para interfaces de texto simples como SMS/WhatsApp.
