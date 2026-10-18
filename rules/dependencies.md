# Dependency Rules

- Preserve the approved stack: Next.js, TypeScript, Prisma, and PostgreSQL. Reason: maintain the agreed architecture.
- Inspect existing dependencies before proposing a new package. Reason: avoid unnecessary additions.
- Obtain approval before adding, removing, or replacing a dependency. Explain its purpose and alternatives. Reason: control complexity and cost.
- Use established, maintained libraries for security-sensitive functionality. Reason: avoid unsafe custom implementations.
- Do not introduce a paid service without approval. Reason: respect the project's cost constraints.
- Do not assume a package is installed or configured. Verify the project files. Reason: prevent incorrect implementation.
