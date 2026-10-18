/**
 * Personal Expense Tracker - Application Logic
 * Adheres strictly to PRD.md, AGENTS.md, and design tokens
 */

(function () {
  'use strict';

  // Supported Currencies (PRD 6.7)
  const SUPPORTED_CURRENCIES = {
    NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro' }
  };

  // Predefined Categories (PRD 6.6)
  const PREDEFINED_CATEGORIES = [
    { name: 'Food', icon: '🍲' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Housing', icon: '🏠' },
    { name: 'Bills and utilities', icon: '💡' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Health', icon: '💊' },
    { name: 'Education', icon: '📚' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Other', icon: '📦' }
  ];

  // Storage Keys
  const STORAGE_KEY_EXPENSES = 'expense_tracker_expenses_v1';
  const STORAGE_KEY_BUDGETS = 'expense_tracker_budgets_v1';

  // Current State
  let currentMonth = getCurrentYearMonth();
  let selectedCategoryCurrency = 'NGN';
  let listCurrencyFilter = 'ALL';
  let pendingDeleteExpenseId = null;

  // Exact Decimal Helper: calculates in integer cents to eliminate floating-point errors
  function toCents(amount) {
    if (typeof amount === 'number') amount = amount.toString();
    const parts = amount.split('.');
    const integerPart = BigInt(parts[0] || '0');
    let decimalPart = parts[1] || '00';
    if (decimalPart.length === 1) decimalPart += '0';
    if (decimalPart.length > 2) decimalPart = decimalPart.slice(0, 2);
    return integerPart * 100n + BigInt(decimalPart);
  }

  function fromCents(cents) {
    const isNegative = cents < 0n;
    const absCents = isNegative ? -cents : cents;
    const integerPart = (absCents / 100n).toString();
    const decimalPart = (absCents % 100n).toString().padStart(2, '0');
    return `${isNegative ? '-' : ''}${integerPart}.${decimalPart}`;
  }

  function formatCurrency(amountNumberOrString, currencyCode) {
    const curr = SUPPORTED_CURRENCIES[currencyCode] || { symbol: currencyCode };
    const num = parseFloat(amountNumberOrString);
    if (isNaN(num)) return `${curr.symbol}0.00`;
    return `${curr.symbol}${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function getCurrentYearMonth() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  function formatMonthTitle(yearMonth) {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Initial Seed Data for immediate interactive verification
  function getInitialExpenses() {
    const nowMonth = getCurrentYearMonth();
    return [
      {
        id: 'exp-1',
        amount: '18500.00',
        currency: 'NGN',
        description: 'Monthly grocery refill',
        category: 'Food',
        date: `${nowMonth}-05`
      },
      {
        id: 'exp-2',
        amount: '12000.00',
        currency: 'NGN',
        description: 'Electricity & Internet token',
        category: 'Bills and utilities',
        date: `${nowMonth}-08`
      },
      {
        id: 'exp-3',
        amount: '85.50',
        currency: 'USD',
        description: 'Software development subscription',
        category: 'Bills and utilities',
        date: `${nowMonth}-10`
      },
      {
        id: 'exp-4',
        amount: '45.00',
        currency: 'USD',
        description: 'Team dinner meeting',
        category: 'Food',
        date: `${nowMonth}-12`
      },
      {
        id: 'exp-5',
        amount: '32.00',
        currency: 'GBP',
        description: 'Train transit pass',
        category: 'Transport',
        date: `${nowMonth}-04`
      },
      {
        id: 'exp-6',
        amount: '120.00',
        currency: 'EUR',
        description: 'Annual domain registration',
        category: 'Other',
        date: `${nowMonth}-07`
      }
    ];
  }

  function getInitialBudgets() {
    const nowMonth = getCurrentYearMonth();
    return [
      { id: 'bgt-1', month: nowMonth, currency: 'NGN', amount: '60000.00' },
      { id: 'bgt-2', month: nowMonth, currency: 'USD', amount: '200.00' },
      { id: 'bgt-3', month: nowMonth, currency: 'GBP', amount: '150.00' },
      { id: 'bgt-4', month: nowMonth, currency: 'EUR', amount: '100.00' } // Will demonstrate overspend
    ];
  }

  // Repository Methods
  function loadExpenses() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory state.');
    }
    const initial = getInitialExpenses();
    saveExpenses(initial);
    return initial;
  }

  function saveExpenses(expenses) {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {}
  }

  function loadBudgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BUDGETS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const initial = getInitialBudgets();
    saveBudgets(initial);
    return initial;
  }

  function saveBudgets(budgets) {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
    } catch (e) {}
  }

  // UI DOM Elements
  const monthSelect = document.getElementById('monthSelect');
  const summaryCardsGrid = document.getElementById('summaryCardsGrid');
  const budgetCardsGrid = document.getElementById('budgetCardsGrid');
  const categoryBreakdownContainer = document.getElementById('categoryBreakdownContainer');
  const categoryCurrencyFilter = document.getElementById('categoryCurrencyFilter');
  const currencyFilterSelect = document.getElementById('currencyFilterSelect');
  const expenseTableBody = document.getElementById('expenseTableBody');
  const emptyExpensesState = document.getElementById('emptyExpensesState');

  // Modals
  const expenseModalBackdrop = document.getElementById('expenseModalBackdrop');
  const expenseForm = document.getElementById('expenseForm');
  const modalTitle = document.getElementById('modalTitle');
  const expenseIdInput = document.getElementById('expenseIdInput');
  const expenseCurrency = document.getElementById('expenseCurrency');
  const expenseAmount = document.getElementById('expenseAmount');
  const expenseDescription = document.getElementById('expenseDescription');
  const descCharCount = document.getElementById('descCharCount');
  const expenseCategory = document.getElementById('expenseCategory');
  const expenseDate = document.getElementById('expenseDate');
  const expenseFormError = document.getElementById('expenseFormError');

  const budgetModalBackdrop = document.getElementById('budgetModalBackdrop');
  const budgetForm = document.getElementById('budgetForm');
  const budgetCurrency = document.getElementById('budgetCurrency');
  const budgetAmount = document.getElementById('budgetAmount');
  const budgetFormError = document.getElementById('budgetFormError');

  const deleteModalBackdrop = document.getElementById('deleteModalBackdrop');
  const deleteExpensePreview = document.getElementById('deleteExpensePreview');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  // Calculations: Spending per currency for current calendar month
  function calculateMonthlyTotals(expenses, month) {
    const totalsInCents = { NGN: 0n, USD: 0n, GBP: 0n, EUR: 0n };
    const counts = { NGN: 0, USD: 0, GBP: 0, EUR: 0 };

    for (const exp of expenses) {
      if (exp.date && exp.date.startsWith(month)) {
        if (totalsInCents[exp.currency] !== undefined) {
          totalsInCents[exp.currency] += toCents(exp.amount);
          counts[exp.currency]++;
        }
      }
    }

    const result = {};
    for (const code of Object.keys(SUPPORTED_CURRENCIES)) {
      result[code] = {
        amountStr: fromCents(totalsInCents[code]),
        cents: totalsInCents[code],
        count: counts[code]
      };
    }
    return result;
  }

  // Calculations: Category breakdown for specified currency and month
  function calculateCategoryTotals(expenses, month, currency) {
    const categoryCents = {};
    for (const cat of PREDEFINED_CATEGORIES) {
      categoryCents[cat.name] = 0n;
    }

    let totalCents = 0n;
    for (const exp of expenses) {
      if (exp.date && exp.date.startsWith(month) && exp.currency === currency) {
        const c = toCents(exp.amount);
        if (categoryCents[exp.category] !== undefined) {
          categoryCents[exp.category] += c;
        } else {
          categoryCents['Other'] += c;
        }
        totalCents += c;
      }
    }

    return {
      totals: categoryCents,
      totalCents
    };
  }

  // Render Section 1: Monthly Spending Summary Cards
  function renderSummaries(expenses) {
    const summaryData = calculateMonthlyTotals(expenses, currentMonth);
    summaryCardsGrid.innerHTML = '';

    for (const [code, info] of Object.entries(SUPPORTED_CURRENCIES)) {
      const summary = summaryData[code];
      const card = document.createElement('div');
      card.className = `summary-card ${code}`;
      card.innerHTML = `
        <div class="summary-card-header">
          <span class="currency-badge ${code}">${code} (${info.symbol})</span>
          <span class="summary-card-count">${summary.count} ${summary.count === 1 ? 'expense' : 'expenses'}</span>
        </div>
        <div class="summary-amount">${formatCurrency(summary.amountStr, code)}</div>
      `;
      summaryCardsGrid.appendChild(card);
    }
  }

  // Render Section 2: Budgets
  function renderBudgets(expenses, budgets) {
    const summaryData = calculateMonthlyTotals(expenses, currentMonth);
    budgetCardsGrid.innerHTML = '';

    for (const code of Object.keys(SUPPORTED_CURRENCIES)) {
      const budgetObj = budgets.find(b => b.month === currentMonth && b.currency === code);
      const spentCents = summaryData[code].cents;
      const spentStr = summaryData[code].amountStr;

      const card = document.createElement('div');

      if (!budgetObj) {
        // No budget configured yet for this currency
        card.className = 'budget-card';
        card.innerHTML = `
          <div class="budget-card-header">
            <span class="currency-badge ${code}">${code}</span>
            <button class="btn btn-secondary btn-sm set-budget-btn" data-currency="${code}">Set Budget</button>
          </div>
          <div class="budget-primary">
            <span class="budget-primary-label">Spent so far</span>
            <span class="budget-primary-amount">${formatCurrency(spentStr, code)}</span>
          </div>
          <div class="budget-empty-note">No budget limit set for ${code}</div>
        `;
      } else {
        const budgetCents = toCents(budgetObj.amount);
        const remainingCents = budgetCents - spentCents;
        const remainingStr = fromCents(remainingCents);
        const isOverspent = remainingCents < 0n;

        // Progress percentage calculation
        let percentage = 0;
        if (budgetCents > 0n) {
          percentage = Number((spentCents * 100n) / budgetCents);
        }

        const cappedPercentage = Math.min(percentage, 100);
        let progressClass = 'safe';
        let statusText = 'On track';
        if (percentage >= 100) {
          progressClass = 'danger';
          statusText = 'Exceeded';
        } else if (percentage >= 80) {
          progressClass = 'warning';
          statusText = 'Near limit';
        }

        card.className = `budget-card ${isOverspent ? 'overspent' : ''}`;
        card.innerHTML = `
          <div class="budget-card-header">
            <div class="budget-card-tags">
              <span class="currency-badge ${code}">${code}</span>
              <span class="budget-status ${progressClass}">${statusText}</span>
            </div>
            <button class="btn btn-secondary btn-sm edit-budget-btn" data-currency="${code}" data-amount="${budgetObj.amount}">Edit</button>
          </div>
          <div class="budget-primary">
            <span class="budget-primary-label">${isOverspent ? 'Exceeded by' : 'Remaining'}</span>
            <span class="budget-primary-amount ${isOverspent ? 'text-error' : ''}">${formatCurrency(remainingStr, code)}</span>
          </div>
          <div class="progress-row">
            <div class="progress-track ${progressClass}" role="progressbar" aria-valuenow="${cappedPercentage}" aria-valuemin="0" aria-valuemax="100" aria-valuetext="${percentage}% of budget used">
              <div class="progress-fill ${progressClass}" style="width: ${cappedPercentage}%"></div>
            </div>
            <span class="budget-percent ${progressClass}">${percentage}%</span>
          </div>
          <div class="budget-meta">
            <span class="budget-meta-item">Spent <strong>${formatCurrency(spentStr, code)}</strong></span>
            <span class="budget-meta-item">Limit <strong>${formatCurrency(budgetObj.amount, code)}</strong></span>
          </div>
        `;
      }

      budgetCardsGrid.appendChild(card);
    }

    // Attach budget modal triggers
    budgetCardsGrid.querySelectorAll('.set-budget-btn, .edit-budget-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = btn.dataset.currency;
        const amt = btn.dataset.amount || '';
        openBudgetModal(cur, amt);
      });
    });
  }

  // Render Section 3: Category Breakdown
  function renderCategoryBreakdown(expenses) {
    // Render currency filter pills
    categoryCurrencyFilter.innerHTML = '';
    for (const code of Object.keys(SUPPORTED_CURRENCIES)) {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `filter-pill ${selectedCategoryCurrency === code ? 'active' : ''}`;
      pill.textContent = `${code} (${SUPPORTED_CURRENCIES[code].symbol})`;
      pill.addEventListener('click', () => {
        selectedCategoryCurrency = code;
        renderCategoryBreakdown(expenses);
      });
      categoryCurrencyFilter.appendChild(pill);
    }

    const { totals, totalCents } = calculateCategoryTotals(expenses, currentMonth, selectedCategoryCurrency);
    categoryBreakdownContainer.innerHTML = '';

    const listContainer = document.createElement('div');
    listContainer.className = 'category-list';

    let hasEntries = false;
    for (const cat of PREDEFINED_CATEGORIES) {
      const cents = totals[cat.name];
      if (cents > 0n) {
        hasEntries = true;
        const row = document.createElement('div');
        row.className = 'category-row';

        const amountStr = fromCents(cents);
        const percent = totalCents > 0n ? Number((cents * 100n) / totalCents) : 0;

        row.innerHTML = `
          <div class="category-info">
            <div class="category-icon">${cat.icon}</div>
            <div>
              <div class="category-name">${cat.name}</div>
              <small class="form-hint">${percent}% of ${selectedCategoryCurrency} spending</small>
            </div>
          </div>
          <div class="category-row-amount">${formatCurrency(amountStr, selectedCategoryCurrency)}</div>
        `;
        listContainer.appendChild(row);
      }
    }

    if (!hasEntries) {
      categoryBreakdownContainer.innerHTML = `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <p class="empty-state-desc">No spending recorded in ${selectedCategoryCurrency} for ${formatMonthTitle(currentMonth)}.</p>
        </div>
      `;
    } else {
      categoryBreakdownContainer.appendChild(listContainer);
    }
  }

  // Render Section 4: Expense List
  function renderExpenses(expenses) {
    const filtered = expenses.filter(exp => {
      const inMonth = exp.date && exp.date.startsWith(currentMonth);
      const matchesCurrency = listCurrencyFilter === 'ALL' || exp.currency === listCurrencyFilter;
      return inMonth && matchesCurrency;
    });

    // Sort descending by date
    filtered.sort((a, b) => (b.date > a.date ? 1 : -1));

    expenseTableBody.innerHTML = '';

    if (filtered.length === 0) {
      emptyExpensesState.classList.remove('hidden');
      document.getElementById('expenseTable').classList.add('hidden');
    } else {
      emptyExpensesState.classList.add('hidden');
      document.getElementById('expenseTable').classList.remove('hidden');

      filtered.forEach(exp => {
        const catObj = PREDEFINED_CATEGORIES.find(c => c.name === exp.category) || { icon: '📦' };
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${exp.date}</td>
          <td class="expense-desc-cell">${escapeHtml(exp.description)}</td>
          <td>
            <span class="category-tag">
              <span>${catObj.icon}</span>
              <span>${escapeHtml(exp.category)}</span>
            </span>
          </td>
          <td><span class="currency-badge ${exp.currency}">${exp.currency}</span></td>
          <td class="amount-cell text-right">${formatCurrency(exp.amount, exp.currency)}</td>
          <td class="text-center">
            <button type="button" class="btn-icon edit-btn" data-id="${exp.id}" title="Edit Expense" aria-label="Edit Expense">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button type="button" class="btn-icon delete delete-btn" data-id="${exp.id}" title="Delete Expense" aria-label="Delete Expense">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        `;

        tr.querySelector('.edit-btn').addEventListener('click', () => openEditExpenseModal(exp));
        tr.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(exp));

        expenseTableBody.appendChild(tr);
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function refreshAll() {
    const expenses = loadExpenses();
    const budgets = loadBudgets();

    renderSummaries(expenses);
    renderBudgets(expenses, budgets);
    renderCategoryBreakdown(expenses);
    renderExpenses(expenses);
  }

  // Expense Modal Handlers
  function openAddExpenseModal() {
    expenseForm.reset();
    expenseIdInput.value = '';
    modalTitle.textContent = 'Add Expense';
    expenseFormError.classList.add('hidden');
    expenseDate.value = new Date().toISOString().split('T')[0];
    descCharCount.textContent = '0 / 200';
    expenseModalBackdrop.classList.remove('hidden');
    expenseAmount.focus();
  }

  function openEditExpenseModal(exp) {
    expenseIdInput.value = exp.id;
    modalTitle.textContent = 'Edit Expense';
    expenseFormError.classList.add('hidden');
    expenseCurrency.value = exp.currency;
    expenseAmount.value = exp.amount;
    expenseDescription.value = exp.description;
    expenseCategory.value = exp.category;
    expenseDate.value = exp.date;
    descCharCount.textContent = `${exp.description.length} / 200`;
    expenseModalBackdrop.classList.remove('hidden');
    expenseAmount.focus();
  }

  function closeExpenseModal() {
    expenseModalBackdrop.classList.add('hidden');
    expenseForm.reset();
  }

  // Budget Modal Handlers
  function openBudgetModal(currency, amount = '') {
    budgetForm.reset();
    budgetFormError.classList.add('hidden');
    budgetCurrency.value = currency;
    budgetAmount.value = amount;
    budgetModalBackdrop.classList.remove('hidden');
    budgetAmount.focus();
  }

  function closeBudgetModal() {
    budgetModalBackdrop.classList.add('hidden');
    budgetForm.reset();
  }

  // Delete Modal Handlers (PRD 6.5)
  function openDeleteModal(exp) {
    pendingDeleteExpenseId = exp.id;
    deleteExpensePreview.innerHTML = `
      <strong>${escapeHtml(exp.description)}</strong><br>
      ${formatCurrency(exp.amount, exp.currency)} • ${exp.category} • ${exp.date}
    `;
    deleteModalBackdrop.classList.remove('hidden');
  }

  function closeDeleteModal() {
    deleteModalBackdrop.classList.add('hidden');
    pendingDeleteExpenseId = null;
  }

  // Form Validation & Submission: Expense
  expenseDescription.addEventListener('input', () => {
    descCharCount.textContent = `${expenseDescription.value.length} / 200`;
  });

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    expenseFormError.classList.add('hidden');

    const id = expenseIdInput.value.trim();
    const currency = expenseCurrency.value;
    const amountVal = parseFloat(expenseAmount.value);
    const desc = expenseDescription.value.trim();
    const category = expenseCategory.value;
    const date = expenseDate.value;

    // Strict Validation rules from PRD 6.2 & rules/validation.md
    if (!amountVal || amountVal <= 0) {
      showExpenseError('Expense amount must be greater than zero.');
      return;
    }
    if (amountVal > 999999999.99) {
      showExpenseError('Expense amount cannot exceed 999,999,999.99.');
      return;
    }
    const decParts = expenseAmount.value.split('.');
    if (decParts[1] && decParts[1].length > 2) {
      showExpenseError('Amount cannot have more than two decimal places.');
      return;
    }
    if (!SUPPORTED_CURRENCIES[currency]) {
      showExpenseError('Invalid currency selected.');
      return;
    }
    if (!desc) {
      showExpenseError('Expense description is required.');
      return;
    }
    if (desc.length > 200) {
      showExpenseError('Description cannot exceed 200 characters.');
      return;
    }
    if (!PREDEFINED_CATEGORIES.some(c => c.name === category)) {
      showExpenseError('Invalid category selected.');
      return;
    }
    if (!date || isNaN(new Date(date).getTime())) {
      showExpenseError('A valid expense date is required.');
      return;
    }

    const expenses = loadExpenses();
    const formattedAmount = parseFloat(amountVal).toFixed(2);

    if (id) {
      // Edit existing
      const idx = expenses.findIndex(x => x.id === id);
      if (idx !== -1) {
        expenses[idx] = {
          ...expenses[idx],
          amount: formattedAmount,
          currency,
          description: desc,
          category,
          date
        };
      }
    } else {
      // Create new
      const newExp = {
        id: 'exp-' + Date.now(),
        amount: formattedAmount,
        currency,
        description: desc,
        category,
        date
      };
      expenses.push(newExp);
    }

    saveExpenses(expenses);
    closeExpenseModal();
    refreshAll();
  });

  function showExpenseError(msg) {
    expenseFormError.textContent = msg;
    expenseFormError.classList.remove('hidden');
  }

  // Form Validation & Submission: Budget
  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    budgetFormError.classList.add('hidden');

    const currency = budgetCurrency.value;
    const amountVal = parseFloat(budgetAmount.value);

    // Validation rules from PRD 6.9 & rules/validation.md
    if (!amountVal || amountVal <= 0) {
      budgetFormError.textContent = 'Budget amount must be greater than zero.';
      budgetFormError.classList.remove('hidden');
      return;
    }
    const decParts = budgetAmount.value.split('.');
    if (decParts[1] && decParts[1].length > 2) {
      budgetFormError.textContent = 'Budget amount cannot have more than two decimal places.';
      budgetFormError.classList.remove('hidden');
      return;
    }

    const budgets = loadBudgets();
    const formattedAmount = parseFloat(amountVal).toFixed(2);
    const existingIdx = budgets.findIndex(b => b.month === currentMonth && b.currency === currency);

    if (existingIdx !== -1) {
      budgets[existingIdx].amount = formattedAmount;
    } else {
      budgets.push({
        id: 'bgt-' + Date.now(),
        month: currentMonth,
        currency,
        amount: formattedAmount
      });
    }

    saveBudgets(budgets);
    closeBudgetModal();
    refreshAll();
  });

  // Confirm Delete
  confirmDeleteBtn.addEventListener('click', () => {
    if (!pendingDeleteExpenseId) return;
    const expenses = loadExpenses().filter(x => x.id !== pendingDeleteExpenseId);
    saveExpenses(expenses);
    closeDeleteModal();
    refreshAll();
  });

  // Global Event Listeners
  document.getElementById('openAddExpenseBtn').addEventListener('click', openAddExpenseModal);
  document.getElementById('openSetBudgetBtn').addEventListener('click', () => openBudgetModal('NGN'));
  document.getElementById('closeExpenseModalBtn').addEventListener('click', closeExpenseModal);
  document.getElementById('cancelExpenseModalBtn').addEventListener('click', closeExpenseModal);
  document.getElementById('closeBudgetModalBtn').addEventListener('click', closeBudgetModal);
  document.getElementById('cancelBudgetModalBtn').addEventListener('click', closeBudgetModal);
  document.getElementById('closeDeleteModalBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

  // Month change
  monthSelect.value = currentMonth;
  monthSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      currentMonth = e.target.value;
      refreshAll();
    }
  });

  // Currency Filter
  currencyFilterSelect.addEventListener('change', (e) => {
    listCurrencyFilter = e.target.value;
    renderExpenses(loadExpenses());
  });

  // Initialize
  refreshAll();
})();
