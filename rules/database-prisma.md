# Database and Prisma Rules

- Use PostgreSQL for persistent storage and Prisma for database access. Reason: preserve the approved stack.
- Verify the existing Prisma configuration and database connection before database work. Reason: do not assume setup is complete.
- Follow the approved data requirements in `PRD.md`. Reason: preserve product behaviour.
- Use exact decimal storage for monetary amounts. Reason: avoid floating-point storage errors.
- Enforce unique email addresses and a unique combination of user, calendar month, and currency for monthly budgets. Reason: preserve data integrity.
- Use appropriate foreign keys and database constraints. Reason: prevent invalid relationships.
- Use migrations to track approved schema changes. Reason: make changes reproducible.
- Explain schema or migration changes and obtain approval before applying them. Reason: protect existing data.
- Never reset, drop, or erase a database without explicit approval. Reason: prevent data loss.
- Keep database credentials on the server. Reason: protect database access.
