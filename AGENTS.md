# Personal Expense Tracker

## Description

Personal Expense Tracker is a responsive web application for recording expenses and managing monthly budgets. Users can register, sign in, and manage their own financial records. The MVP supports NGN, USD, GBP, and EUR without automatic currency conversion.

## Who Uses It

- Individuals managing personal expenses.
- Each user has an independent private account.
- Shared accounts and administrative access to private financial records are outside the MVP.

## One Thing the Agent Must Do Well

Build a reliable expense tracker that calculates spending accurately and prevents users from accessing another user's data.

## Defined Scope for MVP

- User registration, login, logout, and session management.
- Create, view, edit, and permanently delete personal expenses.
- Predefined expense categories.
- Four supported currencies: NGN, USD, GBP, and EUR.
- Monthly spending summaries separated by currency.
- One monthly budget per user, calendar month, and currency.
- Exact decimal storage for monetary values.
- Server-side validation and ownership checks.
- Responsive user interface.
- Tests for critical functionality and privacy.

## Not in Scope

- AI features or financial advice.
- Bank integrations or automatic transaction imports.
- Automatic currency conversion.
- Receipt scanning or uploads.
- Recurring expenses.
- Custom categories.
- Shared accounts.
- Investment tracking.
- Payment processing.
- Data export.
- Expense recovery after deletion.

Do not add excluded features without approval.

## Stack

- Next.js
- TypeScript
- Prisma ORM
- PostgreSQL

Authentication will use a custom registration and login flow, without Clerk. Use established security libraries where appropriate. Do not assume that PostgreSQL is installed or configured until setup has been verified.

## Folder Map

- `PRD.md`: Product requirements and approved decisions.
- `AGENTS.md`: Project-wide instructions for the coding agent.
- `RULES.md`: Index of required project rules.
- `rules/`: Supporting rule files approved for the project.
- `SKILLS.md`: Index of approved repeatable workflows.
- Skill directories: Individual approved `SKILL.md` files.

Keep this map aligned with the actual files. Do not claim a file exists until it has been created.

## How to Work in This Codebase

1. Read `PRD.md`, `AGENTS.md`, `RULES.md`, and relevant supporting rule files before making changes.
2. Follow the approved PRD. Do not invent missing requirements.
3. Work on one clearly defined task at a time.
4. Explain the intended change before making changes that affect multiple parts of the application.
5. Ask before adding dependencies or changing the agreed technology stack.
6. Do not alter database schemas, migrations, or stored data without explaining the change and obtaining approval.
7. Never expose secrets, credentials, password hashes, or session tokens in logs or client responses.
8. Validate untrusted input on the server.
9. Derive user identity from trusted server-side authentication state. Never trust a client-supplied user ID to establish ownership.
10. Enforce ownership checks on every protected expense, budget, and summary operation.
11. Keep monetary calculations accurate. Do not combine different currencies.
12. Run relevant tests after changes and report failures honestly.
13. Do not claim that a feature or test works unless it has been verified.
14. If a requirement is unclear or missing, ask before making a consequential assumption.
15. Keep implementation focused on the MVP.
16. Summarise completed work, tests performed, remaining problems, and any assumptions at the end of each task.

## Where Detailed Rules Live

`RULES.md` is the index for the approved supporting rule files.

Read and follow the relevant supporting files for database changes, authentication, privacy, validation, testing, environment configuration, and other approved project constraints.

Use the actual filenames recorded in `RULES.md`. Do not invent rule files or assume that an uncreated file exists.

If instructions conflict, stop and identify the conflict. The approved PRD defines product requirements. Security requirements must not be weakened to make implementation easier.

## Definitions

- **MVP:** The smallest usable version containing only the approved essential features.
- **Expense:** A user's recorded spending entry.
- **Budget:** A user's spending limit for one calendar month and one currency.
- **Calendar month:** The period from the first day to the last day of a month, based on the recorded expense date.
- **Currency separation:** Amounts in different currencies must never be combined into one total.
- **Ownership check:** A server-side check confirming that the authenticated user is authorised to access or change a record.
- **Exact decimal storage:** Storing monetary values using an exact decimal database type instead of a floating-point database type.

## Self-Audit

- The product purpose and scope match `PRD.md`.
- The required technology stack is preserved.
- The four supported currencies and no-conversion requirement are explicit.
- Expense and budget privacy requirements are explicit.
- Out-of-scope features are identified.
- Database setup is not falsely assumed to be complete.
- Supporting rule filenames are not invented.
- No specific authentication library, hosting provider, or database connection configuration is assumed.
- The file contains project instructions, not implementation code.
