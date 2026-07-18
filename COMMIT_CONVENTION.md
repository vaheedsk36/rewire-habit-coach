# Commit Convention

This repo follows [**Conventional Commits 1.0.0**](https://www.conventionalcommits.org/).
A commit message template is wired into git (`git config commit.template .gitmessage`), so `git commit`
opens with the format prefilled.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **subject**: imperative mood, lower-case, no trailing period, ≤ 72 chars ("add form", not "added form").
- **body** (optional): the *why*, wrapped at ~72 chars.
- **footer** (optional): `BREAKING CHANGE: …`, or issue refs like `Closes #12`.

## Types

| Type | Use for |
|---|---|
| `feat` | A new user-facing feature |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting only (whitespace, semicolons) — no logic change |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `build` | Build system, dependencies, tooling config |
| `ci` | CI configuration |
| `chore` | Housekeeping that doesn't touch src or tests |
| `revert` | Reverting a previous commit |

## Scopes (this project)

`ui`, `form`, `api`, `ai`, `types`, `hooks`, `results`, `config`, `deploy`, `docs`

## Examples

```
feat(ai): add generate-plan service using OpenAI generateObject
fix(api): return 504 on LLM request timeout
refactor(types): derive UI props from the plan output schema
docs(readme): document required environment variables
chore(config): scaffold Next.js app with tailwind and shadcn/ui
```

## Rules of thumb

- One logical change per commit.
- If the subject needs "and", it's probably two commits.
- Breaking changes: add `!` after the type/scope (`feat(api)!: …`) **and** a `BREAKING CHANGE:` footer.
