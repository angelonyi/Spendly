---
name: currency-summary-verification
description: Use when implementing, modifying, or testing expense totals, monthly summaries, category breakdowns, or monthly budget calculations. Verify exact monetary arithmetic, currency separation, calendar-month reporting, and budget balances.
---

# Currency Summary Verification

## Purpose

Verify that expense totals, monthly summaries, category breakdowns, and budget balances are calculated accurately without mixing currencies or introducing monetary precision errors.

## When to Use

Use this skill whenever implementing, modifying, or reviewing:
- Monthly expense totals.
- Category spending breakdowns.
- Monthly budget balances and remaining amounts.
- Database queries or calculations involving monetary values.
- Currency formatting or monthly reporting logic.

## Workflow

### 1. Inspect the Requirements

- Read `PRD.md` and identify the relevant reporting and budget requirements.
- Read `rules/monetary-currency.md`, `rules/validation.md`, and `rules/testing.md`.
- Confirm the supported currencies: NGN, USD, GBP, and EUR.
- Use the project's documented date and timezone policy. Do not assume UTC or introduce a new timezone policy without approval.

### 2. Verify Monetary Precision

- Confirm monetary values are stored using an exact decimal database type.
- Inspect calculations to ensure they do not rely on imprecise floating-point arithmetic for financial totals.
- Verify that expenses and budgets support two decimal places.
- Check that expense amounts are greater than zero and do not exceed 999,999,999.99.
- Do not invent a maximum budget amount if the approved requirements do not specify one.

### 3. Verify Currency Separation

- Group and calculate amounts separately for NGN, USD, GBP, and EUR.
- Never add amounts from different currencies into one total.
- Never perform automatic currency conversion.
- Verify that each expense retains its recorded currency.
- Ensure each budget balance uses only expenses belonging to the same user, calendar month, and currency.

### 4. Verify Calendar-Month Reporting

- Confirm that monthly reports use the recorded expense date.
- Verify that the reporting period includes the first and last applicable dates of the selected calendar month.
- Check that expenses immediately before or after the month are excluded.
- Apply the documented date and timezone policy consistently.
- Test month transitions, including December to January, where applicable.

### 5. Verify Budget Calculations

For each authenticated user, calendar month, and currency, verify:

**Remaining budget = Budget amount − Eligible spending**

- Confirm that only eligible expenses for that user, month, and currency are included.
- Verify that spending below the budget produces the correct positive balance.
- Verify that spending equal to the budget produces zero remaining.
- Verify that spending above the budget produces a negative remaining balance if this matches the approved product requirements.
- Check budgets with no expenses and expenses with no configured budget.
- Never silently cap, convert, or combine amounts to make a result appear valid.

### 6. Verify Display Formatting

- Display amounts with the correct currency symbol or an unambiguous currency code.
- Use two decimal places consistently.
- Avoid formatting that could make different currencies appear to be the same.
- Confirm that displayed totals match the underlying calculations.

### 7. Run Verification Tests

Where the relevant application functionality and test environment exist, test:
- No expenses in a month.
- Expenses in one currency.
- Expenses in multiple currencies.
- A budget with no expenses.
- Expenses without a budget.
- Spending below, equal to, and above a budget.
- Expenses at calendar-month boundaries.
- Decimal amounts that can expose rounding errors.
- Attempts to include another user's expenses in a total.

Record the actual results. If a test cannot be run, explain why.

## Completion Criteria

The work is ready for review only when:
- Monetary storage and calculations preserve the required precision.
- Supported currencies remain separate.
- Monthly reporting follows the approved date and timezone policy.
- Budget calculations use the correct user, month, and currency.
- Displayed values agree with verified calculations.
- Test results and unresolved limitations are documented.

## Related Rules

- `rules/monetary-currency.md`
- `rules/validation.md`
- `rules/testing.md`
- `rules/database-prisma.md`
- `rules/privacy-ownership.md`