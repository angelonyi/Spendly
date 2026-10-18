# Validation Rules

- Validate untrusted input on the server. Reason: browser validation can be bypassed.
- Require an amount, supported currency, description, predefined category, and valid expense date when creating an expense. Reason: ensure complete records.
- Reject amounts that are not positive, exceed 999999999.99, or contain more than two decimal places. Reason: enforce approved expense limits.
- Limit expense descriptions to 200 characters. Reason: follow the PRD.
- Accept only NGN, USD, GBP, and EUR. Reason: reject unsupported currencies.
- Accept only categories defined in `PRD.md`. Reason: prevent unapproved categories.
- Require positive budget amounts with no more than two decimal places. Reason: preserve monetary consistency.
- Do not invent a maximum budget amount that the PRD does not specify. Reason: avoid adding unsupported restrictions.
- Reject invalid dates and malformed input. Reason: protect data integrity.
- Provide clear validation messages where practical. Reason: help users correct mistakes.
- Prevent accidental duplicate submissions where practical. Reason: avoid duplicate records.
