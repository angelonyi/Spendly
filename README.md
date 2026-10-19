# Spendly — Personal Expense Tracker

## 1. Project Overview

Spendly is a personal expense tracker designed to help people record their expenses, monitor monthly spending, and manage budgets across multiple currencies.

The project focuses on making personal expense tracking clear and practical, with spending in Nigerian naira, US dollars, British pounds, and euros tracked separately.

## 2. The Problem

Managing personal expenses can become difficult when spending records are scattered or when expenses in different currencies need to be tracked independently.

Without a clear overview of spending, it can be harder to understand where money goes and whether spending is within a planned monthly budget.

Spendly explores a simple, centralized way to record expenses and review monthly spending.

## 3. Who Is It For?

Spendly is designed for individuals who want to:

- Keep track of daily expenses.
- Understand their monthly spending.
- Set and monitor monthly budgets.
- Manage expenses in multiple currencies without combining them into a single total.

## 4. The Solution

Spendly provides a personal expense-tracking interface for recording expenses, organizing them by category, reviewing monthly spending, and managing budgets.

The application supports four currencies: NGN, USD, GBP, and EUR. Each currency is tracked independently, avoiding misleading totals caused by combining different currencies without conversion.

## 5. Key Product Decisions

### Separate currency tracking

Each supported currency has its own spending summary and budget. Spendly does not automatically convert currencies or combine them into a single total.

### Monthly reporting

Expenses are organized by their recorded dates and reviewed within a calendar month.

### Defined expense categories

Expenses use a predefined set of categories, including Food, Transport, Housing, Bills and utilities, Shopping, Health, Education, Entertainment, and Other.

### Focused MVP

The initial version focuses on essential expense tracking and budgeting. Features such as bank integrations, recurring expenses, receipt scanning, custom categories, and exports are outside the current MVP scope.

## 6. Technology and Implementation

The project includes a web application interface, styling, design tokens, and project documentation.

Technologies and tools currently represented in the repository include:

- Next.js and TypeScript
- JavaScript and CSS
- npm for dependency management
- Design tokens for consistent interface styling

The implementation and technology choices will continue to be refined as development progresses.

## 7. Current Progress

Spendly has an initial expense-tracking interface, currency summaries, budget-related UI, and expense-entry functionality.

The project also includes a Product Requirements Document, development rules, agent instructions, verification skills, and logic tests.

## 8. Testing and Verification

The project includes a logic test script covering areas such as decimal precision, currency separation, monthly filtering, budget limits, category constraints, and validation boundaries.

## 9. Future Development

Future work will follow the product requirements, with attention to reliable expense calculations, currency separation, data ownership, validation, responsive design, and testing.


