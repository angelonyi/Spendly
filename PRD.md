# Personal Expense Tracker
## Product Requirements Document (PRD)

**Version:** 2.0  

**Product type:** Responsive web application

## 1. Product Summary

The Personal Expense Tracker is a web application that helps individuals record expenses, organise spending, and manage monthly budgets.

Users create private accounts and manage their own financial records.

The MVP focuses on essential expense tracking. Future improvements can be added after the first version works reliably.

## 2. Problem Statement

People need a simple way to record their daily expenses and understand how much they spend.

The application will provide a central place to record expenses, review monthly spending, organise expenses by category, and monitor budgets.

This problem statement is a product hypothesis. It has not yet been validated through user research.

## 3. Goals and Non-Goals

### Goals

- Allow users to register and log in.
- Allow users to add, view, edit, and delete expenses.
- Organise expenses using predefined categories.
- Support four currencies without automatic conversion.
- Display monthly spending summaries by currency.
- Allow one overall monthly budget per currency.
- Protect every user's private financial records.
- Provide a responsive, beginner-friendly interface.

### Non-Goals

The MVP will not include:

- Bank integrations or automatic transaction imports.
- AI-powered financial advice.
- Receipt scanning or image uploads.
- Recurring expenses.
- Custom expense categories.
- Shared accounts or family budgets.
- Investment tracking.
- Payment processing.
- Data export.
- Expense recovery after deletion.

## 4. Users and Personas

### Primary user

An individual who wants to record personal expenses and understand their spending.

### Account model

Each person has an independent account.

Users must not access another user's expenses, budgets, summaries, or private financial information.

There is no administrative interface for viewing users' private financial records in the MVP.

## 5. Scope

### Included in the MVP

1. Account registration and login.
2. Secure session management.
3. Private expense management.
4. Predefined expense categories.
5. Four supported currencies.
6. Monthly spending summaries.
7. Monthly budgets by currency.
8. Input validation and error handling.
9. Responsive layout.
10. Automated tests for important functionality and data privacy.

### Excluded from the MVP

All non-goal features listed in Section 3 remain outside the initial release.

Do not add features simply because they may be useful later.

## 6. Functional Requirements

### 6.1 Registration and login

- Users can create accounts with an email address and password.
- Email addresses must be validated and unique.
- Passwords must never be stored as plain text.
- Passwords must be hashed using a suitable, established password-hashing library.
- Users can log in and log out.
- Sessions must use secure cookie handling and appropriate expiry.
- Protected pages and server operations must require a valid session.
- Invalid login attempts must return safe error messages.
- Users must not be able to access another user's account by changing an identifier in a request.

Email verification and password-reset workflows are outside the MVP unless required by the chosen deployment environment.

### 6.2 Add an expense

Each expense must contain:

- Amount.
- Currency.
- Description.
- Category.
- Expense date.
- User ownership reference.

Validation rules:

- The amount must be greater than zero.
- The maximum amount is 999,999,999.99.
- Amounts support two decimal places.
- The description is required and may contain up to 200 characters.
- Currency must be one of the four supported currencies.
- Category must be one of the predefined categories.
- The expense date must be valid.
- The server must derive the owner from the authenticated session.
- Repeated form submissions must not accidentally create duplicate expenses.

### 6.3 View expenses

Users can view their own expenses in an organised list.

The list must show the amount, currency, description, category, and date.

Users must be able to distinguish expenses recorded in different currencies.

The MVP does not require advanced search, custom filters, pagination, or sorting controls beyond what is necessary for a usable expense list.

### 6.4 Edit expenses

Users can edit their own expenses.

All validation and ownership checks must run on the server.

Users cannot edit expenses belonging to another account.

### 6.5 Delete expenses

Users can permanently delete their own expenses.

The interface must request confirmation before deletion.

Deletion must remove the expense from subsequent lists, summaries, and budget calculations.

A recovery system is not required.

### 6.6 Expense categories

The application must provide these predefined categories:

1. Food
2. Transport
3. Housing
4. Bills and utilities
5. Shopping
6. Health
7. Education
8. Entertainment
9. Other

Users cannot create, rename, or delete categories in the MVP.

### 6.7 Supported currencies

The application supports:

- NGN: Nigerian Naira.
- USD: US Dollar.
- GBP: British Pound.
- EUR: Euro.

Each expense retains its original currency.

The application must not automatically convert currencies or retrieve exchange rates.

### 6.8 Monthly spending summary

Users can view a summary for a selected calendar month.

The summary must show:

- Total spending for each currency.
- Spending by category for each currency.
- The selected month.

Expenses must be grouped according to their recorded expense date, from the first day to the last day of the selected calendar month.

Different currencies must never be added together into one monetary total.

### 6.9 Monthly budget

Users can set one overall monthly budget per currency.

A user can have separate budgets for NGN, USD, GBP, and EUR in the same month.

Each budget is associated with the user, calendar month, and currency.

For each currency, display:

- Budget amount.
- Amount spent.
- Remaining budget.

The remaining budget equals the budget amount minus eligible spending for the same user, calendar month, and currency.

Spending may exceed the budget. The application must display the actual remaining amount, including a negative amount when the budget is exceeded.

Budget amounts must be positive and support two decimal places.

The database must prevent duplicate budgets for the same user, month, and currency.

## 7. User Flows

### First-time user

1. Open the application.
2. Register with an email address and password.
3. Sign in if registration does not automatically establish a session.
4. Arrive at a private dashboard.
5. See a clear action to add the first expense.

### Returning user

1. Open the application.
2. Sign in.
3. View the dashboard and monthly summary.
4. Add, edit, view, or delete expenses.
5. Set or update monthly budgets.

### Record an expense

1. Open the add-expense form.
2. Enter the amount, currency, description, category, and date.
3. Submit the form.
4. See a success message when the expense is saved.
5. See a useful error message if saving fails.

### Set a budget

1. Select a calendar month and currency.
2. Enter the budget amount.
3. Save the budget.
4. View spending and remaining budget for that currency.

## 8. UI/UX Requirements

- Use a clear, simple interface suitable for first-time users.
- Provide navigation to the dashboard, expenses, and budgets.
- Make the add-expense action easy to find.
- Display currency codes or unambiguous currency formatting.
- Keep summaries separated by currency.
- Show loading, empty, success, and error states.
- Confirm destructive actions.
- Provide readable forms, labels, and validation messages.
- Support desktop and mobile screen sizes.
- Prevent accidental loss of unsaved form input where practical.

Do not build elaborate animations or unnecessary dashboard features.

## 9. Technical Architecture

### Required stack

- Next.js for the web application.
- TypeScript for type safety.
- Prisma ORM for database access and schema management.
- PostgreSQL for persistent data storage.

### Architecture requirements

- Use server-side operations for protected data access.
- Keep database access separate from presentation components.
- Validate user input on the server.
- Use database constraints to protect data integrity.
- Never trust a user ID supplied by the browser as proof of ownership.
- Keep database credentials and session secrets out of source control.
- Use environment variables for secrets and connection details.

### Database environment

PostgreSQL must run on a real database server.

For the MVP, prefer a free hosted PostgreSQL service if its available limits meet the project's needs and setup is quick enough. A local PostgreSQL installation is an alternative.

Anti Gravity is the development environment. It does not replace the PostgreSQL server.

The hosting provider and production deployment configuration must be selected before deployment.

## 10. Database Design

The initial database must support three primary entities.

### User

Stores account information.

Required concepts:

- Unique identifier.
- Unique email address.
- Password hash.
- Creation timestamp.

### Expense

Stores an individual expense.

Required concepts:

- Unique identifier.
- User ownership reference.
- Amount using an exact decimal database type.
- Currency code.
- Description.
- Category.
- Expense date.
- Creation and update timestamps.

### MonthlyBudget

Stores one monthly budget for each user and currency.

Required concepts:

- Unique identifier.
- User ownership reference.
- Calendar month.
- Currency code.
- Budget amount using an exact decimal database type.
- Creation and update timestamps.

Required constraints:

- Every expense belongs to a valid user.
- Every budget belongs to a valid user.
- A user can have only one budget for a given month and currency.
- Deleting a user must not leave orphaned expense or budget records.
- All monetary values must use exact decimal storage rather than floating-point database types.

The detailed Prisma schema must implement these requirements without adding unnecessary entities.

## 11. Authentication, Authorisation, and Privacy

Custom authentication will be implemented without Clerk or another paid authentication provider.

The application must:

- Hash passwords using an established password-hashing library.
- Use secure session management.
- Protect authenticated routes and server operations.
- Enforce ownership checks for every expense and budget operation.
- Derive the current user from trusted server-side authentication state.
- Apply ownership checks to expense lists, individual expense reads, creation, editing, deletion, summaries, and budget operations.
- Reject unauthorised requests without revealing private data.
- Use secure cookie settings appropriate to the environment.
- Protect against common authentication and session-handling errors.

Authentication libraries may be considered if needed for secure implementation, but they must not introduce a paid authentication service or silently replace the agreed custom-authentication approach.

## 12. Monetary Precision and Validation

### Monetary storage

Use an exact decimal database type through Prisma.

Do not use JavaScript floating-point arithmetic for financial calculations when it could introduce precision errors.

### Currency precision

The MVP will use two decimal places for NGN, USD, GBP, and EUR.

Examples:

- NGN: ₦1,500.50
- USD: $1,500.50
- GBP: £1,500.50
- EUR: €1,500.50

Use locale-aware formatting where practical. Display currency codes when symbols could be ambiguous.

### Expense limits

- Maximum expense: 999,999,999.99.
- Maximum description length: 200 characters.
- Amount must be greater than zero.
- Amounts must not contain more than two decimal places.

### Budget validation

- Budget amounts must be greater than zero.
- Budget amounts must support two decimal places.
- Budget calculations must use only expenses matching the user, month, and currency.

## 13. Error Handling

The application must handle:

- Invalid registration details.
- Duplicate email addresses.
- Incorrect login credentials.
- Expired or invalid sessions.
- Invalid expense input.
- Invalid budget input.
- Failed database operations.
- Unauthorised access attempts.
- Failed updates and deletions.
- Empty expense lists and months without spending.

Messages shown to users must be understandable and must not expose passwords, session secrets, database credentials, or sensitive internal errors.

## 14. Testing Strategy

The MVP is not complete until its critical flows have been tested.

### Functional tests

- Registration and login work.
- Users can add, view, edit, and delete expenses.
- Expense validation rejects invalid values.
- Users can set and update monthly budgets.
- Monthly summaries calculate spending correctly.
- Spending and budgets remain separate by currency.
- Calendar-month boundaries are respected.

### Privacy tests

- User A cannot view User B's expenses.
- User A cannot edit or delete User B's expenses.
- User A cannot read or change User B's budgets.
- User A cannot access User B's summaries.
- Changing request identifiers does not bypass ownership checks.
- Unauthenticated requests cannot access protected data.

### Interface tests

- The application works at desktop and mobile widths.
- Empty, loading, success, and error states are usable.
- Deletion requires confirmation.

## 15. Success Criteria

The MVP is successful when:

- A user can register, log in, and log out.
- A user can manage their own expenses.
- A user can create a monthly budget for each supported currency.
- Monthly totals and category summaries are correct.
- Different currencies are never combined.
- Financial amounts are stored and calculated accurately.
- Cross-user access attempts are rejected.
- Critical tests pass.
- The application can be run in a documented development environment.

## 16. Risks, Assumptions, and Implementation Gate

### Risks

- Custom authentication can introduce security vulnerabilities if implemented carelessly.
- Database setup may consume time.
- Poor ownership checks could expose private financial information.
- Incorrect decimal handling could produce inaccurate totals.
- Hosted database free tiers may have usage limits or change their terms.

### Assumptions

- The MVP is intended for individual users.
- The four supported currencies are NGN, USD, GBP, and EUR.
- No automatic currency conversion is required.
- Calendar months are determined by the expense date.
- Expenses are permanently deleted after confirmation.
- The app will use Next.js, TypeScript, Prisma, and PostgreSQL.
- Authentication will be implemented without Clerk.
- The project prioritises essential functionality over optional features.

