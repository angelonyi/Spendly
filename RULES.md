# Rules Index: Personal Expense Tracker

## Purpose

This file lists the rules that govern the coding agent when building the Personal Expense Tracker.

Rules define constraints the agent must follow. Each supporting rules file must have one clear responsibility.

Do not begin implementation until the required supporting rules files have been created and reviewed.

## 1. Non-Negotiable Rules

These rules apply across projects.

| File | Responsibility |
|---|---|
| `rules/code-quality.md` | Readable, maintainable code and consistent implementation practices. |
| `rules/dependencies.md` | Dependency approval and prevention of unnecessary packages. |
| `rules/environment-secrets.md` | Environment variables, credentials, and secret protection. |
| `rules/git-workflow.md` | Safe changes, clear commits, and version control. |
| `rules/testing.md` | Required testing and honest reporting of results. |

## 2. Project-Specific Rules

These rules apply to the Personal Expense Tracker.

| File | Responsibility |
|---|---|
| `rules/project-structure.md` | Organisation of application code and separation of responsibilities. |
| `rules/database-prisma.md` | Prisma, PostgreSQL, schema changes, migrations, and data integrity. |
| `rules/authentication.md` | Custom registration, login, password hashing, and session management. |
| `rules/privacy-ownership.md` | Server-side access control and isolation of each user's records. |
| `rules/monetary-currency.md` | Decimal precision, supported currencies, formatting, and currency-separated calculations. |
| `rules/validation.md` | Server-side validation and approved expense and budget limits. |
| `rules/ui-responsive.md` | Usable forms, interface states, accessibility basics, and responsive layouts. |
| `rules/error-handling.md` | Safe errors, failed operations, and user-facing feedback. |

## 3. Rules Governance

- Each supporting file must have one clear responsibility.
- Each rule must be specific, testable where practical, and include its reason.
- Do not duplicate the same requirement across multiple files without a clear need.
- Do not create rules that contradict `PRD.md` or `AGENTS.md`.
- Do not invent requirements that the approved PRD does not support.
- Update this index if a supporting file is added, removed, or renamed.
- Review the full contents of every supporting file before implementation begins.

## 4. Implementation Gate

The coding agent must not begin feature implementation until:

1. The required supporting rules files exist.
2. Their contents have been reviewed and corrected.
3. `AGENTS.md`, `RULES.md`, and the supporting rules agree with `PRD.md`.
4. The project owner has approved proceeding.
