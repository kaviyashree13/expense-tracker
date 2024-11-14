const expenseForm = document.getElementById('expense-form');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const expenseDate = document.getElementById('expense-date');
const expenseList = document.getElementById('expense-list');
const totalExpenses = document.getElementById('total-expenses');
const filterCategory = document.getElementById('filter-category');
const categorySummaryList = document.getElementById('category-summary-list');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let total = 0;

// Load expenses and category summary
function loadExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        addExpenseToList(expense);
    });
    updateTotal();
    updateCategorySummary();
}

// Add expense to the list with delete and edit options
function addExpenseToList(expense) {
    const li = document.createElement('li');
    li.innerHTML = `${expense.name} - $${expense.amount.toFixed(2)} (${expense.category}) - ${expense.date} 
                    <span class="edit-btn">Edit</span> | 
                    <span class="delete-btn">Delete</span>`;
    expenseList.appendChild(li);

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        removeExpense(expense);
    });

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        editExpense(expense, li);
    });
}

// Update total expenses
function updateTotal() {
    total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpenses.textContent = total.toFixed(2);
}

// Update category-wise summary
function updateCategorySummary() {
    const categories = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    categorySummaryList.innerHTML = '';
    Object.keys(categories).forEach(category => {
        const li = document.createElement('li');
        li.textContent = `${category}: $${categories[category].toFixed(2)}`;
        categorySummaryList.appendChild(li);
    });
}

// Remove expense from list and localStorage
function removeExpense(expense) {
    expenses = expenses.filter(e => e !== expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
}

// Edit an existing expense
function editExpense(expense, li) {
    expenseName.value = expense.name;
    expenseAmount.value = expense.amount;
    expenseCategory.value = expense.category;
    expenseDate.value = expense.date;

    removeExpense(expense);
    li.remove();
}

// Add new expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if (name && amount >= 0 && category && date) {
        const newExpense = { name, amount, category, date };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        addExpenseToList(newExpense);
        updateTotal();
        updateCategorySummary();

        expenseName.value = '';
        expenseAmount.value = '';
        expenseCategory.value = '';
        expenseDate.value = '';
    } else {
        alert('Please fill in all fields correctly.');
    }
});

// Sort expenses by ascending or descending amount
document.getElementById('sort-asc').addEventListener('click', () => {
    expenses.sort((a, b) => a.amount - b.amount);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
});

document.getElementById('sort-desc').addEventListener('click', () => {
    expenses.sort((a, b) => b.amount - a.amount);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
});

// Filter expenses by category
filterCategory.addEventListener('change', () => {
    const selectedCategory = filterCategory.value;
    const filteredExpenses = selectedCategory ? expenses.filter(expense => expense.category === selectedCategory) : expenses;

    expenseList.innerHTML = '';
    filteredExpenses.forEach(expense => {
        addExpenseToList(expense);
    });
});

// Initial load of expenses
window.addEventListener('DOMContentLoaded', loadExpenses);
