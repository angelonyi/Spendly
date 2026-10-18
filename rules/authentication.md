# Authentication Rules

- Implement custom registration, login, logout, and session management without Clerk. Reason: follow the approved product decision.
- Never store passwords in plain text. Reason: protect account credentials.
- Use an established password-hashing library and secure session handling. Reason: avoid unsafe security implementations.
- Verify authentication on the server before protected operations. Reason: prevent unauthenticated access.
- Validate authentication input on the server. Reason: browser validation can be bypassed.
- Do not expose passwords, session tokens, secrets, or sensitive internal errors. Reason: prevent information leakage.
- When the project owner's separate authentication prompt is supplied, review and use it for authentication implementation details unless it conflicts with the approved PRD or essential security requirements. Reason: preserve the owner's intended workflow.
- Do not invent missing authentication requirements. Ask when a consequential decision is not covered. Reason: avoid unsupported design choices.
- Do not claim authentication is secure or complete without appropriate verification. Reason: distinguish implementation from evidence.
