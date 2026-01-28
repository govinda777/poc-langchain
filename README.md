
## Features

### Agent Capabilities
- **Calculator**: Performs basic arithmetic operations.
- **Identity Hydration**: Manages user profiles.
- **Context Awareness**: Remembers conversation context.

## Development & Security

### CI/CD Pipeline
This project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs:
- **Secretlint**: Scans for accidental secret commits.
- **ESLint**: Linting for code quality.
- **Build**: Verifies the project builds correctly.
- **Tests**: Runs unit and integration tests.

### Git Hooks (Husky)
- **Pre-commit**: Runs `lint-staged` (Secretlint & ESLint) to ensure no bad code is committed.
- **Commit-msg**: Enforces Conventional Commits using `commitlint`.
