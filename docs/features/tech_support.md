# US03: Technical Support Helper

## Description
The Technical Support Helper allows the agent to handle basic technical inquiries and log support tickets for the user.

## Intent Detection
- **Keywords:** `bug`, `erro`, `error`, `falha`, `ajuda`, `suporte`, `help`, `crash`.
- **Intent Name:** `tech_support`.

## Tools
### `createSupportTicket`
- **Input:** Description of the issue.
- **Output:** A ticket object containing `id`, `status` (open), `description`, and `createdAt`.

## Flow
1. User mentions an error (e.g., "Encontrei um bug").
2. Perception node identifies `tech_support` intent.
3. Router node directs to Action node.
4. Action node invokes `createSupportTicket`.
5. Agent responds with the Ticket ID and a reassurance message.
