---
name: privacy-ownership-verification
description: Use when implementing, modifying, or reviewing server-side operations that access, create, update, delete, or aggregate a user's expenses, budgets, or financial summaries. Verify authentication, record ownership, and cross-user data isolation.
---

# Privacy Ownership Verification

## Purpose

Verify that every protected financial data operation enforces authentication and record ownership, preventing one user from accessing or modifying another user's private financial records.

## When to Use

Use this skill when implementing, modifying, or reviewing:
- Expense creation, reading, editing, or deletion.
- Monthly budget creation, reading, or modification.
- Dashboard totals, monthly summaries, or category breakdowns.
- Server-side queries, route handlers, or other operations involving user financial data.

## Workflow

### 1. Inspect the Operation

- Identify the server-side operation being implemented or changed.
- Identify the financial records it accesses.
- Identify the authentication and ownership checks protecting those records.
- Read `rules/authentication.md`, `rules/privacy-ownership.md`, and `rules/testing.md`.

### 2. Verify Authentication

- Confirm that protected operations require a valid authenticated session.
- Confirm that the current user's identity comes from trusted server-side authentication state.
- Never treat a user ID supplied by the client as proof of identity.
- Verify that unauthenticated requests are rejected without exposing private information.

### 3. Verify Record Ownership

- Confirm that reads return only records belonging to the authenticated user.
- Confirm that new records are associated with the authenticated user.
- Confirm that updates and deletions verify ownership before changing records.
- Confirm that monthly summaries, category breakdowns, and budget calculations exclude other users' records.
- Check that changing a record ID or submitting another user's ID cannot bypass ownership enforcement.

### 4. Test Cross-User Access

Where the test environment supports it, use two separate test accounts with independent records.

Verify that:
- User A cannot read User B's records.
- User A cannot update or delete User B's records.
- User A cannot create records under User B's identity by manipulating client input.
- User A's totals and summaries exclude User B's records.
- Unauthenticated requests cannot access protected financial data.

Check the database or other reliable test evidence when necessary to confirm that rejected mutations did not change records.

### 5. Review Error Handling

- Ensure unauthorized operations do not return private records.
- Return appropriate error responses without exposing stack traces, secrets, or internal implementation details.
- Do not report success when an operation has failed.
- Follow `rules/error-handling.md`.

### 6. Report Verification Results

- Run relevant available tests.
- Record which checks passed, failed, or could not be performed.
- Report unresolved security gaps.
- Never claim cross-user isolation is verified unless supporting tests or other reliable evidence demonstrate it.

## Completion Criteria

The operation is ready for review only when:
- Authentication is enforced where required.
- Ownership is enforced for every affected data operation.
- Cross-user read and mutation attempts are rejected.
- Financial summaries are scoped to the authenticated user.
- Relevant test results and unresolved limitations are documented.

## Related Rules

- `rules/authentication.md`
- `rules/privacy-ownership.md`
- `rules/testing.md`
- `rules/error-handling.md`
