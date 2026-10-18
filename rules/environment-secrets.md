# Environment and Secrets Rules

- Keep database credentials, session secrets, and other secrets in environment variables. Reason: prevent exposure in source code.
- Never commit real credentials or secrets. Reason: protect accounts and infrastructure.
- Use placeholder values in example environment files. Reason: document configuration without disclosing secrets.
- Verify required environment variables before using a service. Reason: detect missing configuration.
- Never expose secrets in browser code, logs, or user-facing errors. Reason: prevent information leakage.
- Do not change deployment secrets without approval. Reason: protect working environments.
- Do not assume a database server or deployment environment exists until verified. Reason: avoid unsupported setup assumptions.
