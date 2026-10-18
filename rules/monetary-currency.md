# Monetary and Currency Rules

- Support only NGN, USD, GBP, and EUR in the MVP. Reason: follow the approved currency list.
- Preserve the original currency of every expense and budget. Reason: retain the recorded monetary value.
- Never automatically convert currencies or combine different currencies into one total. Reason: prevent misleading calculations.
- Store monetary values using an exact decimal database type. Reason: preserve stored precision.
- Support two decimal places for expenses and budgets. Reason: follow the approved MVP specification.
- Reject expense amounts less than or equal to zero or greater than 999999999.99. Reason: enforce approved limits.
- Keep calculations accurate when working with decimal values in application code. Reason: prevent rounding errors.
- Format amounts consistently with the correct currency. Show currency codes when symbols could be ambiguous. Reason: avoid confusion.
- Calculate spending and remaining budgets only for the same user, calendar month, and currency. Reason: produce correct budget results.
- Group monthly summaries by the recorded expense date and calendar month. Reason: follow the approved reporting policy.
