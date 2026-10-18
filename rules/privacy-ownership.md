# Privacy and Ownership Rules

- Every expense and budget must belong to a specific user. Reason: maintain private account boundaries.
- Derive the current user's identity from trusted server-side authentication state. Reason: prevent identity spoofing.
- Never trust a client-supplied user ID as proof of ownership. Reason: prevent cross-user access.
- Enforce ownership checks when reading, creating, editing, or deleting expenses and budgets. Reason: protect every data operation.
- Scope monthly summaries and category breakdowns to the authenticated user. Reason: prevent indirect data leakage.
- Reject unauthorised requests without returning private records. Reason: enforce access control.
- Test access attempts using another user's record identifiers. Reason: verify that ownership checks cannot be bypassed.
- Do not create administrative access to private financial records. Reason: keep the approved account model private.
