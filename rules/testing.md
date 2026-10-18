# Testing Rules

- Identify relevant tests before changing application behaviour. Reason: understand what must remain correct.
- Run the relevant available tests after changes. Reason: detect regressions.
- Test invalid input and expected failure cases for important operations. Reason: verify defensive behaviour.
- Verify that one user cannot read or modify another user's expenses, budgets, or summaries. Reason: protect private data.
- Test monetary calculations separately for each supported currency. Reason: prevent incorrect totals.
- Report which tests were run and their actual results. Reason: provide verifiable evidence.
- Never claim a test passed unless it actually passed.
- If tests cannot run, state why and what remains unverified. Reason: make limitations explicit.
