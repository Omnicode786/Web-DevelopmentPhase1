// Budget Tracker App - JavaScript

class BudgetTracker {
    constructor() {
        this.expenses = [];
        this.apiKey = '';
        this.charts = {};
        this.editingExpenseId = null;
        
        this.categories = ['Food', 'Travel', 'Entertainment', 'Shopping', 'Bills', 'Others'];
        this.chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateUI();
    }

    // Storage Management
    loadFromStorage() {
        try {
            const savedExpenses = localStorage.getItem('budgetTracker_expenses');
            const savedApiKey = localStorage.getItem('budgetTracker_apiKey');
            
            if (savedExpenses) {
                this.expenses = JSON.parse(savedExpenses);
            }
            
            if (savedApiKey) {
                this.apiKey = savedApiKey;
                const apiKeyInput = document.getElementById('apiKey');
                if (apiKeyInput) {
                    apiKeyInput.value = this.apiKey;
                    this.updateApiStatus('API Key loaded successfully', 'success');
                }
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('budgetTracker_expenses', JSON.stringify(this.expenses));
            if (this.apiKey) {
                localStorage.setItem('budgetTracker_apiKey', this.apiKey);
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Save API Key
        const saveApiKeyBtn = document.getElementById('saveApiKey');
        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => {
                this.saveApiKey();
            });
        }

        // Add Expense Form
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }

        // Edit Expense Form
        const editExpenseForm = document.getElementById('editExpenseForm');
        if (editExpenseForm) {
            editExpenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveExpenseEdit();
            });
        }

        // Reset Data
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetData();
            });
        }

        // Modal Controls
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const cancelEdit = document.getElementById('cancelEdit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on backdrop click
        const editModal = document.getElementById('editModal');
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target.id === 'editModal') {
                    this.closeModal();
                }
            });
        }

        // Add escape key listener for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // API Key Management
    saveApiKey() {
        const apiKeyInput = document.getElementById('apiKey');
        if (!apiKeyInput) return;
        
        const newApiKey = apiKeyInput.value.trim();
        
        if (newApiKey) {
            this.apiKey = newApiKey;
            this.saveToStorage();
            this.updateApiStatus('API Key saved successfully!', 'success');
            
            // Get AI suggestions if we have expenses
            if (this.expenses.length > 0) {
                this.getAISuggestions();
            }
        } else {
            this.apiKey = '';
            localStorage.removeItem('budgetTracker_apiKey');
            this.updateApiStatus('API Key removed', 'error');
        }
    }

    updateApiStatus(message, type) {
        const apiStatus = document.getElementById('apiStatus');
        if (!apiStatus) return;
        
        apiStatus.textContent = message;
        apiStatus.className = `api-status ${type}`;
        apiStatus.style.display = 'block';
        
        setTimeout(() => {
            apiStatus.style.display = 'none';
        }, 3000);
    }

    // Expense Management
    addExpense() {
        const amountInput = document.getElementById('amount');
        const categorySelect = document.getElementById('category');
        const noteInput = document.getElementById('note');
        
        if (!amountInput || !categorySelect || !noteInput) {
            console.error('Form elements not found');
            return;
        }

        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value;
        const note = noteInput.value.trim();
        
        // Validation
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount greater than 0.');
            amountInput.focus();
            return;
        }

        if (!category) {
            alert('Please select a category.');
            categorySelect.focus();
            return;
        }

        const expense = {
            id: Date.now(),
            amount: amount,
            category: category,
            note: note,
            date: new Date().toISOString().split('T')[0]
        };

        this.expenses.unshift(expense);
        this.saveToStorage();
        this.updateUI();
        this.resetForm();
        
        // Show success message
        this.showSuccessMessage('Expense added successfully!');
        
        // Get AI suggestions after adding expense
        if (this.apiKey) {
            setTimeout(() => {
                this.getAISuggestions();
            }, 500);
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'api-status success';
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '1001';
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) return;

        this.editingExpenseId = id;
        
        const editAmount = document.getElementById('editAmount');
        const editCategory = document.getElementById('editCategory');
        const editNote = document.getElementById('editNote');
        
        if (editAmount) editAmount.value = expense.amount;
        if (editCategory) editCategory.value = expense.category;
        if (editNote) editNote.value = expense.note;
        
        this.showModal();
    }

    saveExpenseEdit() {
        const editAmount = document.getElementById('editAmount');
        const editCategory = document.getElementById('editCategory');
        const editNote = document.getElementById('editNote');
        
        if (!editAmount || !editCategory || !editNote) return;

        const amount = parseFloat(editAmount.value);
        const category = editCategory.value;
        const note = editNote.value.trim();
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }

        if (!category) {
            alert('Please select a category.');
            return;
        }

        const expenseIndex = this.expenses.findIndex(exp => exp.id === this.editingExpenseId);
        if (expenseIndex !== -1) {
            this.expenses[expenseIndex] = {
                ...this.expenses[expenseIndex],
                amount: amount,
                category: category,
                note: note
            };
            
            this.saveToStorage();
            this.updateUI();
            this.closeModal();
            this.showSuccessMessage('Expense updated successfully!');
            
            if (this.apiKey) {
                setTimeout(() => {
                    this.getAISuggestions();
                }, 500);
            }
        }
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            this.saveToStorage();
            this.updateUI();
            this.showSuccessMessage('Expense deleted successfully!');
            
            if (this.apiKey && this.expenses.length > 0) {
                setTimeout(() => {
                    this.getAISuggestions();
                }, 500);
            }
        }
    }

    resetForm() {
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.reset();
        }
    }

    resetData() {
        if (confirm('Are you sure you want to delete all expenses? This action cannot be undone.')) {
            this.expenses = [];
            localStorage.removeItem('budgetTracker_expenses');
            this.updateUI();
            this.showSuccessMessage('All data has been reset!');
        }
    }

    // Modal Management
    showModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.editingExpenseId = null;
    }

    // UI Updates
    updateUI() {
        this.updateExpensesList();
        this.updateExpensesSummary();
        this.updateCharts();
    }

    updateExpensesList() {
        const expensesList = document.getElementById('expensesList');
        if (!expensesList) return;
        
        if (this.expenses.length === 0) {
            expensesList.innerHTML = '<div class="no-expenses">No expenses added yet. Start tracking your spending!</div>';
            return;
        }

        const expensesHTML = this.expenses.map(expense => `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                    <div class="expense-category">${this.getCategoryIcon(expense.category)} ${expense.category}</div>
                    ${expense.note ? `<div class="expense-note">${expense.note}</div>` : ''}
                    <div class="expense-date">${this.formatDate(expense.date)}</div>
                </div>
                <div class="expense-actions">
                    <button class="btn-icon btn-edit" onclick="budgetTracker.editExpense(${expense.id})" title="Edit">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="budgetTracker.deleteExpense(${expense.id})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        expensesList.innerHTML = expensesHTML;
    }

    updateExpensesSummary() {
        const expensesSummary = document.getElementById('expensesSummary');
        if (!expensesSummary) return;
        
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        expensesSummary.textContent = `Total: $${total.toFixed(2)} (${this.expenses.length} expenses)`;
    }

    getCategoryIcon(category) {
        const icons = {
            'Food': '🍔',
            'Travel': '✈️',
            'Entertainment': '🎬',
            'Shopping': '🛍️',
            'Bills': '📄',
            'Others': '📦'
        };
        return icons[category] || '📦';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Chart Management
    initializeCharts() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createCharts();
            });
        } else {
            this.createCharts();
        }
    }

    createCharts() {
        try {
            this.initializePieChart();
            this.initializeBarChart();
            this.initializeLineChart();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    initializePieChart() {
        const canvas = document.getElementById('pieChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.pie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: this.chartColors,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    initializeBarChart() {
        const canvas = document.getElementById('barChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.bar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Spending',
                    data: [],
                    backgroundColor: this.chartColors[0],
                    borderColor: this.chartColors[0],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    initializeLineChart() {
        const canvas = document.getElementById('lineChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.line = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Expenses',
                    data: [],
                    borderColor: this.chartColors[1],
                    backgroundColor: this.chartColors[1] + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        if (this.charts.pie) this.updatePieChart();
        if (this.charts.bar) this.updateBarChart();
        if (this.charts.line) this.updateLineChart();
    }

    updatePieChart() {
        if (!this.charts.pie) return;

        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        this.charts.pie.data.labels = labels;
        this.charts.pie.data.datasets[0].data = data;
        this.charts.pie.update();
    }

    updateBarChart() {
        if (!this.charts.bar) return;

        const monthlyTotals = {};
        this.expenses.forEach(expense => {
            const month = new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
        });

        const labels = Object.keys(monthlyTotals).sort();
        const data = labels.map(label => monthlyTotals[label]);

        this.charts.bar.data.labels = labels;
        this.charts.bar.data.datasets[0].data = data;
        this.charts.bar.update();
    }

    updateLineChart() {
        if (!this.charts.line) return;

        const dailyTotals = {};
        this.expenses.forEach(expense => {
            const date = expense.date;
            dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
        });

        const sortedDates = Object.keys(dailyTotals).sort();
        const labels = sortedDates.map(date => {
            return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const data = sortedDates.map(date => dailyTotals[date]);

        this.charts.line.data.labels = labels;
        this.charts.line.data.datasets[0].data = data;
        this.charts.line.update();
    }

    // AI Suggestions
    async getAISuggestions() {
        if (!this.apiKey || this.expenses.length === 0) {
            return;
        }

        const loadingEl = document.getElementById('aiLoading');
        const suggestionsEl = document.getElementById('aiSuggestions');
        
        if (!loadingEl || !suggestionsEl) return;

        loadingEl.classList.remove('hidden');
        suggestionsEl.innerHTML = '';

        try {
            const analysisData = this.prepareExpenseAnalysis();
            const suggestions = await this.callGeminiAPI(analysisData);
            this.displayAISuggestions(suggestions);
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
            this.displayAISuggestions([
                'Unable to get AI suggestions at this time. Please check your API key and internet connection.',
                'Make sure your Gemini API key is valid and has proper permissions.'
            ]);
        } finally {
            loadingEl.classList.add('hidden');
        }
    }

    prepareExpenseAnalysis() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        const totalThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const categoryBreakdown = {};
        
        thisMonthExpenses.forEach(expense => {
            categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
        });

        return {
            totalExpenses: totalThisMonth,
            expenseCount: thisMonthExpenses.length,
            categoryBreakdown: categoryBreakdown,
            averageExpense: thisMonthExpenses.length > 0 ? totalThisMonth / thisMonthExpenses.length : 0,
            topCategories: Object.entries(categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([cat, amount]) => ({ category: cat, amount }))
        };
    }

    async callGeminiAPI(analysisData) {
        const prompt = `
        Analyze the following spending data and provide 2-3 brief, actionable financial suggestions:
        
        Total monthly expenses: $${analysisData.totalExpenses.toFixed(2)}
        Number of expenses: ${analysisData.expenseCount}
        Average expense: $${analysisData.averageExpense.toFixed(2)}
        
        Category breakdown:
        ${Object.entries(analysisData.categoryBreakdown)
            .map(([cat, amount]) => `- ${cat}: $${amount.toFixed(2)}`)
            .join('\n')}
        
        Top spending categories:
        ${analysisData.topCategories
            .map(({category, amount}) => `- ${category}: $${amount.toFixed(2)}`)
            .join('\n')}
        
        Please provide specific, helpful suggestions for improving spending habits. Keep each suggestion to 1-2 sentences and focus on actionable advice.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const suggestions = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!suggestions) {
            throw new Error('No suggestions received from API');
        }

        return suggestions.split('\n').filter(line => line.trim().length > 0);
    }

    displayAISuggestions(suggestions) {
        const suggestionsEl = document.getElementById('aiSuggestions');
        if (!suggestionsEl) return;
        
        if (!suggestions || suggestions.length === 0) {
            suggestionsEl.innerHTML = '<div class="suggestion-placeholder">No suggestions available at this time.</div>';
            return;
        }

        const suggestionsHTML = suggestions
            .filter(suggestion => suggestion.trim().length > 0)
            .map(suggestion => `<div class="ai-suggestion">💡 ${suggestion.trim()}</div>`)
            .join('');

        suggestionsEl.innerHTML = suggestionsHTML;
    }
}

// Initialize the app when DOM is ready
let budgetTracker;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        budgetTracker = new BudgetTracker();
        initializeSampleData();
    });
} else {
    budgetTracker = new BudgetTracker();
    initializeSampleData();
}

// Add some sample data if no expenses exist (only on first visit)
function initializeSampleData() {
    if (budgetTracker && budgetTracker.expenses.length === 0 && !localStorage.getItem('budgetTracker_visited')) {
        const sampleExpenses = [
            { id: 1643723001, amount: 25.50, category: 'Food', note: 'Lunch at cafe', date: '2025-01-15' },
            { id: 1643723002, amount: 120.00, category: 'Shopping', note: 'New shirt', date: '2025-01-14' },
            { id: 1643723003, amount: 45.80, category: 'Entertainment', note: 'Movie tickets', date: '2025-01-13' }
        ];
        
        budgetTracker.expenses = sampleExpenses;
        budgetTracker.saveToStorage();
        budgetTracker.updateUI();
        localStorage.setItem('budgetTracker_visited', 'true');
    }
}