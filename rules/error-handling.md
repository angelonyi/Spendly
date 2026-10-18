# Error Handling Rules

- Handle expected authentication, validation, database, and authorisation failures. Reason: keep application behaviour predictable.
- Show understandable messages for errors users can correct. Reason: help users recover.
- Never expose stack traces, credentials, password hashes, session tokens, or secrets in user-facing errors. Reason: protect sensitive information.
- Do not silently ignore failed operations. Reason: prevent false success.
- Report success only after the operation succeeds. Reason: keep feedback accurate.
- Avoid logging sensitive personal or authentication data. Reason: protect user privacy.
- Preserve form input after recoverable errors where practical. Reason: reduce unnecessary re-entry.
- Report unresolved errors and unverified behaviour honestly. Reason: make limitations visible.

