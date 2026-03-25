# Contributing

## Prerequisites

- Node.js (see `.nvmrc`)
- pnpm (see `package.json#packageManager`)

## Setup

```bash
pnpm install
```

Git hooks (Husky) are installed automatically on install.

## Git Workflow

This project uses a **feature branch workflow** to protect the `main` branch.

### Branch Protection

- Direct commits to `main` are **blocked** via a pre-push hook
- All changes must go through a Pull Request
- PRs require passing CI checks before merging

### Creating a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/my-feature

# Make your changes and commit
git add .
git commit -m "feat: add my feature"

# Push your branch
git push origin feature/my-feature
```

### Branch Naming Conventions

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### GitHub Branch Protection (Recommended)

For full protection, enable these settings in GitHub repo settings:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - Require a pull request before merging
   - Require status checks to pass (select `quality` and `test`)
   - Require branches to be up to date before merging

## Common Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
```

Notes:

- Prettier and typecheck are treated as required checks.
- ESLint is run in CI in “informational” mode for now while existing violations are cleaned up.

## Commit Messages (Conventional Commits)

This repo enforces Conventional Commits.

Examples:

- `feat(api): standardize response envelope`
- `fix(auth): prevent org bypass in agents route`
- `chore(ci): add lint + typecheck`

## Pull Requests

### Checklist

- Typecheck/format checks pass
- No secrets or credentials added
- API changes documented (if applicable)
- New/changed API routes follow the standard response envelope
