# Contributing to Media Converter API

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/media-converter-api.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Run checks locally before committing

## Development Workflow

### Running Checks Locally

Before committing, ensure your code passes all checks:

```bash
# Run linting
npm run lint

# Check formatting
npm run format:check

# Fix formatting
npm run format

# Build project
npm run build

# Run tests
npm test
```

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

### Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature (bumps MINOR version, e.g., 0.1.0 → 0.2.0)
- **fix**: A bug fix (bumps PATCH version, e.g., 0.1.0 → 0.1.1)
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring without adding features or fixing bugs
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, etc.

### Breaking Changes

To indicate a breaking change (bumps MAJOR version, e.g., 0.1.0 → 1.0.0):

```
feat!: remove deprecated API endpoint

BREAKING CHANGE: The /old-endpoint has been removed. Use /new-endpoint instead.
```

### Examples

```bash
# Feature (minor version bump)
git commit -m "feat: add support for audio transcoding"

# Bug fix (patch version bump)
git commit -m "fix: correct file size validation logic"

# Breaking change (major version bump)
git commit -m "feat!: redesign API response format"

# With scope
git commit -m "feat(probe): add support for image metadata extraction"

# Chore (no version bump, but included in changelog)
git commit -m "chore: update dependencies"
```

## Pull Requests

1. Ensure all checks pass locally
2. Push your branch to your fork
3. Create a Pull Request against the `main` branch
4. Fill out the PR template with a clear description of changes
5. Wait for CI checks to complete
6. Request review from maintainers

### PR Title

PR titles should also follow conventional commit format:

```
feat: add new endpoint for video conversion
fix: resolve memory leak in file cache service
```

## Questions?

If you have any questions or need help, feel free to open an issue or reach out to the maintainers.
