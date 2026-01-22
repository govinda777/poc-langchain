# Cognitive Agent PoC

A Proof of Concept for a Cognitive Agent using Next.js, LangChain, and LangGraph.

## Features
- **Deterministic Agent Graph**: Uses LangGraph for state management and routing.
- **Identity & Memory**: User profile hydration and context persistence.
- **Tech Support (FAQ)**: Answers common support questions (US03).
- **Security**: "Git Guardian" hooks (Secretlint, Commitlint) and CI/CD.

## Getting Started

### Prerequisites
- Node.js 20+
- OpenAI API Key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment:
   ```bash
   cp .env.example .env.local
   # Add your OPENAI_API_KEY
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Git Hooks ("Guardians")
This project enforces quality gates via Husky:
- **Pre-commit**: Runs `secretlint` (scans for secrets) and `lint-staged` (lints/formats code).
- **Commit-msg**: Enforces Conventional Commits (e.g., `feat: add faq tool`).

### Testing
- Run unit tests: `npm test`
- Run specific test: `npm test path/to/test`

### CI/CD
GitHub Actions workflow is located in `.github/workflows/ci.yml` and runs:
1. Secret Scan
2. Formatting Check
3. Linting
4. Tests
5. Build
