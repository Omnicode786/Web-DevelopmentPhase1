// Dashboard Application JavaScript

class Dashboard {
    constructor() {
        this.widgets = [];
        this.settings = {
            theme: 'light'
        };
        
        // Predefined API keys - replace these with actual keys
        this.apiKeys = {
            weather: 'd9a458fde9354448b37212528250508',
            news: '7ccf332b70184fa3bedf3dac69058304',
            gemini: 'AIzaSyCA97EwdSOQkSlps5A7o3MtqTcx-b3rUrU'
        };
        
        this.apiStatus = {
            weather: false,
            news: false,
            gemini: false
        };
        
        this.availableWidgets = [
            { type: 'weather', name: 'Weather', icon: '🌤️' },
            { type: 'news', name: 'News', icon: '📰' },
            { type: 'todo', name: 'To-Do List', icon: '✅' },
            { type: 'notes', name: 'Notes', icon: '🗒️' },
            { type: 'ai-suggestions', name: 'AI Suggestions', icon: '🤖' }
        ];

        this.defaultWidgets = [
            { id: 'weather-1', type: 'weather', title: 'Weather' },
            { id: 'news-1', type: 'news', title: 'News Headlines' },
            { id: 'todo-1', type: 'todo', title: 'To-Do List' },
            { id: 'notes-1', type: 'notes', title: 'Notes' }
        ];

        this.init();
    }

    init() {
        this.loadSettings();
        this.loadWidgets();
        this.setupEventListeners();
        this.renderWidgets();
        this.applyTheme();
        this.testApiConnections();
    }

    async testApiConnections() {
        // Test Weather API
        if (this.apiKeys.weather !== 'YOUR_OPENWEATHER_API_KEY_HERE') {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=${this.apiKeys.weather}&units=metric`
                );
                if (response.ok) {
                    this.apiStatus.weather = true;
                    this.showToast('Weather API loaded successfully', 'success');
                }
            } catch (error) {
                console.log('Weather API not available');
            }
        }

        // Test News API
        if (this.apiKeys.news !== 'YOUR_NEWS_API_KEY_HERE') {
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${this.apiKeys.news}`
                );
                if (response.ok) {
                    this.apiStatus.news = true;
                    this.showToast('News API loaded successfully', 'success');
                }
            } catch (error) {
                console.log('News API not available');
            }
        }

        // Test Gemini API
        if (this.apiKeys.gemini !== 'YOUR_GEMINI_API_KEY_HERE') {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: 'test' }] }]
                        })
                    }
                );
                if (response.ok) {
                    this.apiStatus.gemini = true;
                    this.showToast('Gemini AI API loaded successfully', 'success');
                }
            } catch (error) {
                console.log('Gemini API not available');
            }
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 4000);
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('dashboard-settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveSettings() {
        localStorage.setItem('dashboard-settings', JSON.stringify(this.settings));
    }

    loadWidgets() {
        const savedWidgets = localStorage.getItem('dashboard-widgets');
        if (savedWidgets) {
            this.widgets = JSON.parse(savedWidgets);
        } else {
            this.widgets = [...this.defaultWidgets];
            this.saveWidgets();
        }
    }

    saveWidgets() {
        localStorage.setItem('dashboard-widgets', JSON.stringify(this.widgets));
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Add widget
        document.getElementById('addWidgetBtn').addEventListener('click', () => this.openAddWidgetModal());
        document.getElementById('closeAddModal').addEventListener('click', () => this.closeModal('addWidgetModal'));
        
        // Modal backdrop clicks
        document.querySelectorAll('.modal__backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveSettings();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.settings.theme);
        const themeIcon = document.getElementById('themeIcon');
        themeIcon.textContent = this.settings.theme === 'light' ? '🌙' : '☀️';
    }

    openAddWidgetModal() {
        const modal = document.getElementById('addWidgetModal');
        const optionsContainer = document.getElementById('widgetOptions');
        
        optionsContainer.innerHTML = '';
        
        this.availableWidgets.forEach(widgetType => {
            const option = document.createElement('div');
            option.className = 'widget-option';
            option.innerHTML = `
                <div class="widget-option__icon">${widgetType.icon}</div>
                <div class="widget-option__name">${widgetType.name}</div>
            `;
            option.addEventListener('click', () => {
                this.addWidget(widgetType.type);
            });
            optionsContainer.appendChild(option);
        });
        
        modal.classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    addWidget(type) {
        const id = `${type}-${Date.now()}`;
        const widget = {
            id,
            type,
            title: this.availableWidgets.find(w => w.type === type).name
        };
        
        this.widgets.push(widget);
        this.saveWidgets();
        this.renderWidget(widget);
        this.updateWidget(widget);
        this.closeModal('addWidgetModal');
    }

    removeWidget(id) {
        this.widgets = this.widgets.filter(w => w.id !== id);
        this.saveWidgets();
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
        
        // Clean up localStorage for removed widgets
        localStorage.removeItem(`todos-${id}`);
        localStorage.removeItem(`notes-${id}`);
    }

    renderWidgets() {
        const grid = document.getElementById('dashboardGrid');
        grid.innerHTML = '';
        
        this.widgets.forEach(widget => {
            this.renderWidget(widget);
            this.updateWidget(widget);
        });
    }

    renderWidget(widget) {
        const grid = document.getElementById('dashboardGrid');
        const widgetElement = document.createElement('div');
        widgetElement.className = 'widget';
        widgetElement.id = widget.id;
        widgetElement.draggable = true;
        
        const icon = this.availableWidgets.find(w => w.type === widget.type)?.icon || '📦';
        
        widgetElement.innerHTML = `
            <div class="widget__header">
                <h3 class="widget__title">
                    <span>${icon}</span>
                    ${widget.title}
                </h3>
                <div class="widget__controls">
                    <button class="widget__control-btn widget__control-btn--remove" data-widget-id="${widget.id}">&times;</button>
                </div>
            </div>
            <div class="widget__content" id="${widget.id}-content">
                <div class="loading">Loading...</div>
            </div>
        `;
        
        // Add remove button event listener
        const removeBtn = widgetElement.querySelector('.widget__control-btn--remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const widgetId = e.target.getAttribute('data-widget-id');
            this.removeWidget(widgetId);
        });
        
        // Add drag event listeners
        widgetElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
        widgetElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
        widgetElement.addEventListener('dragover', (e) => this.handleDragOver(e));
        widgetElement.addEventListener('drop', (e) => this.handleDrop(e));
        
        grid.appendChild(widgetElement);
    }

    updateWidget(widget) {
        const contentElement = document.getElementById(`${widget.id}-content`);
        if (!contentElement) return;

        switch (widget.type) {
            case 'weather':
                this.renderWeatherWidget(contentElement);
                break;
            case 'news':
                this.renderNewsWidget(contentElement);
                break;
            case 'todo':
                this.renderTodoWidget(contentElement, widget.id);
                break;
            case 'notes':
                this.renderNotesWidget(contentElement, widget.id);
                break;
            case 'ai-suggestions':
                this.renderAiWidget(contentElement, widget.id);
                break;
        }
    }

    showApiError(container, apiName, message) {
        container.innerHTML = `
            <div class="api-error">
                <div class="api-error__icon">🔑</div>
                <div class="api-error__title">Configure API Key</div>
                <div class="api-error__message">
                    Please add a valid ${apiName} API key to enable this widget.
                    ${message ? `<br><br>${message}` : ''}
                </div>
            </div>
        `;
    }

    async renderWeatherWidget(container) {
        if (!this.apiStatus.weather) {
            this.showApiError(container, 'OpenWeather', 'Get your free API key at openweathermap.org');
            return;
        }

        container.innerHTML = `
            <div class="weather-widget__main">
                <div>
                    <div class="weather-widget__temp" id="weather-temp">--°</div>
                    <div id="weather-description">Loading...</div>
                    <div id="weather-location">--</div>
                </div>
                <div class="weather-widget__icon" id="weather-icon">🌤️</div>
            </div>
            <div class="weather-widget__details">
                <div class="weather-widget__detail">
                    <div class="weather-widget__detail-label">Humidity</div>
                    <div class="weather-widget__detail-value" id="weather-humidity">--%</div>
                </div>
                <div class="weather-widget__detail">
                    <div class="weather-widget__detail-label">Feels Like</div>
                    <div class="weather-widget__detail-value" id="weather-feels">--°</div>
                </div>
            </div>
        `;

        try {
            // Try to get user's location
            const position = await this.getCurrentPosition();
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            await this.fetchWeatherData(lat, lon);
        } catch (error) {
            // Fallback to New York coordinates
            await this.fetchWeatherData(40.7128, -74.0060);
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 300000 // 5 minutes
            });
        });
    }

    async fetchWeatherData(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKeys.weather}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.main || !data.weather || !data.weather[0]) {
                throw new Error('Invalid weather data received');
            }
            
            this.displayWeatherData(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showNetworkError('weather');
        }
    }

    displayWeatherData(data) {
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const description = data.weather[0].description;
        const location = data.name;
        
        document.getElementById('weather-temp').textContent = `${temp}°C`;
        document.getElementById('weather-feels').textContent = `${feelsLike}°C`;
        document.getElementById('weather-humidity').textContent = `${humidity}%`;
        document.getElementById('weather-description').textContent = description;
        document.getElementById('weather-location').textContent = location;
        
        // Set weather icon based on condition
        const iconMap = {
            'clear sky': '☀️',
            'few clouds': '🌤️',
            'scattered clouds': '⛅',
            'broken clouds': '☁️',
            'overcast clouds': '☁️',
            'light rain': '🌦️',
            'moderate rain': '🌧️',
            'heavy rain': '⛈️',
            'snow': '❄️',
            'mist': '🌫️'
        };
        
        const icon = iconMap[description] || '🌤️';
        document.getElementById('weather-icon').textContent = icon;
    }

    showNetworkError(widgetType) {
        const errorMessages = {
            weather: 'Unable to load weather data. Please check your connection.',
            news: 'Unable to load news articles. Please check your connection.',
            ai: 'Unable to connect to AI service. Please check your connection.'
        };
        
        const container = document.querySelector(`#${widgetType}-1-content`) || 
                         document.querySelector(`[id*="${widgetType}"] .widget__content`);
        
        if (container) {
            container.innerHTML = `
                <div class="api-error">
                    <div class="api-error__icon">⚠️</div>
                    <div class="api-error__title">Connection Error</div>
                    <div class="api-error__message">${errorMessages[widgetType]}</div>
                </div>
            `;
        }
    }

    async renderNewsWidget(container) {
        if (!this.apiStatus.news) {
            this.showApiError(container, 'News', 'Get your free API key at newsapi.org');
            return;
        }

        container.innerHTML = '<div class="news-widget__articles" id="news-articles"><div class="loading">Loading news...</div></div>';
        
        try {
            const response = await fetch(
                `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${this.apiKeys.news}`
            );
            
            if (!response.ok) {
                throw new Error(`News API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.articles || !Array.isArray(data.articles)) {
                throw new Error('Invalid news data received');
            }
            
            this.displayNewsData(data.articles);
        } catch (error) {
            console.error('News fetch error:', error);
            this.showNetworkError('news');
        }
    }

    displayNewsData(articles) {
        const container = document.getElementById('news-articles');
        container.innerHTML = '';
        
        if (articles.length === 0) {
            container.innerHTML = '<div class="api-error__message">No news articles available</div>';
            return;
        }
        
        articles.slice(0, 4).forEach(article => {
            if (article.title && article.url) {
                const articleElement = document.createElement('a');
                articleElement.className = 'news-widget__article';
                articleElement.href = article.url;
                articleElement.target = '_blank';
                articleElement.innerHTML = `
                    <div class="news-widget__article-title">${article.title}</div>
                    <div class="news-widget__article-source">${article.source?.name || 'Unknown Source'}</div>
                `;
                container.appendChild(articleElement);
            }
        });
    }

    renderTodoWidget(container, widgetId) {
        container.innerHTML = `
            <div class="todo-widget__input">
                <input type="text" placeholder="Add a new task..." id="${widgetId}-input">
                <button class="btn btn--primary btn--sm" data-widget-id="${widgetId}">Add</button>
            </div>
            <div class="todo-widget__list" id="${widgetId}-list"></div>
        `;
        
        // Add event listeners
        const addBtn = container.querySelector('.btn');
        const input = document.getElementById(`${widgetId}-input`);
        
        addBtn.addEventListener('click', () => this.addTodoItem(widgetId));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodoItem(widgetId);
            }
        });
        
        this.loadTodoItems(widgetId);
    }

    loadTodoItems(widgetId) {
        const todos = JSON.parse(localStorage.getItem(`todos-${widgetId}`) || '[]');
        const listContainer = document.getElementById(`${widgetId}-list`);
        listContainer.innerHTML = '';
        
        todos.forEach((todo, index) => {
            this.renderTodoItem(widgetId, todo, index);
        });
    }

    addTodoItem(widgetId) {
        const input = document.getElementById(`${widgetId}-input`);
        const text = input.value.trim();
        
        if (!text) return;
        
        const todos = JSON.parse(localStorage.getItem(`todos-${widgetId}`) || '[]');
        todos.push({ text, completed: false, id: Date.now() });
        
        localStorage.setItem(`todos-${widgetId}`, JSON.stringify(todos));
        input.value = '';
        
        this.loadTodoItems(widgetId);
    }

    renderTodoItem(widgetId, todo, index) {
        const listContainer = document.getElementById(`${widgetId}-list`);
        const todoElement = document.createElement('div');
        todoElement.className = `todo-widget__item ${todo.completed ? 'completed' : ''}`;
        todoElement.innerHTML = `
            <input type="checkbox" class="todo-widget__checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-widget__text">${todo.text}</span>
            <button class="todo-widget__delete">&times;</button>
        `;
        
        // Add event listeners
        const checkbox = todoElement.querySelector('.todo-widget__checkbox');
        const deleteBtn = todoElement.querySelector('.todo-widget__delete');
        
        checkbox.addEventListener('change', () => this.toggleTodoItem(widgetId, index));
        deleteBtn.addEventListener('click', () => this.deleteTodoItem(widgetId, index));
        
        listContainer.appendChild(todoElement);
    }

    toggleTodoItem(widgetId, index) {
        const todos = JSON.parse(localStorage.getItem(`todos-${widgetId}`) || '[]');
        todos[index].completed = !todos[index].completed;
        localStorage.setItem(`todos-${widgetId}`, JSON.stringify(todos));
        this.loadTodoItems(widgetId);
    }

    deleteTodoItem(widgetId, index) {
        const todos = JSON.parse(localStorage.getItem(`todos-${widgetId}`) || '[]');
        todos.splice(index, 1);
        localStorage.setItem(`todos-${widgetId}`, JSON.stringify(todos));
        this.loadTodoItems(widgetId);
    }

    renderNotesWidget(container, widgetId) {
        const savedNotes = localStorage.getItem(`notes-${widgetId}`) || '';
        
        container.innerHTML = `
            <textarea class="notes-widget__textarea" id="${widgetId}-textarea" 
                      placeholder="Write your notes here...">${savedNotes}</textarea>
            <div class="notes-widget__controls">
                <div class="notes-widget__save-status" id="${widgetId}-save-status">Saved</div>
                <button class="btn btn--outline btn--sm" data-widget-id="${widgetId}">Clear</button>
            </div>
        `;
        
        const textarea = document.getElementById(`${widgetId}-textarea`);
        const clearBtn = container.querySelector('.btn');
        let saveTimeout;
        
        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem(`notes-${widgetId}`, textarea.value);
                this.showSaveStatus(widgetId);
            }, 500);
        });
        
        clearBtn.addEventListener('click', () => this.clearNotes(widgetId));
    }

    showSaveStatus(widgetId) {
        const status = document.getElementById(`${widgetId}-save-status`);
        status.classList.add('visible');
        setTimeout(() => {
            status.classList.remove('visible');
        }, 2000);
    }

    clearNotes(widgetId) {
        document.getElementById(`${widgetId}-textarea`).value = '';
        localStorage.removeItem(`notes-${widgetId}`);
    }

    renderAiWidget(container, widgetId) {
        if (!this.apiStatus.gemini) {
            this.showApiError(container, 'Gemini AI', 'Get your API key at aistudio.google.com');
            return;
        }

        container.innerHTML = `
            <div class="ai-widget__input">
                <input type="text" placeholder="Ask for productivity tips..." id="${widgetId}-input">
                <button class="btn btn--primary btn--sm" data-widget-id="${widgetId}">Ask</button>
            </div>
            <div class="ai-widget__response" id="${widgetId}-response">
                Ask me anything about productivity, habits, or getting things done! 
                For example: "What are 3 productivity tips for remote work?"
            </div>
        `;
        
        const input = document.getElementById(`${widgetId}-input`);
        const askBtn = container.querySelector('.btn');
        
        askBtn.addEventListener('click', () => this.askAiQuestion(widgetId));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.askAiQuestion(widgetId);
            }
        });
    }

    async askAiQuestion(widgetId) {
        const input = document.getElementById(`${widgetId}-input`);
        const response = document.getElementById(`${widgetId}-response`);
        const question = input.value.trim();
        
        if (!question) return;

        response.innerHTML = '<div class="ai-widget__loading">Thinking...</div>';

        try {
            const apiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: question }]
                        }]
                    })
                }
            );

            if (!apiResponse.ok) {
                throw new Error(`Gemini API error: ${apiResponse.status}`);
            }

            const data = await apiResponse.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid AI response received');
            }
            
            const answer = data.candidates[0].content.parts[0].text;
            response.textContent = answer;
            
        } catch (error) {
            console.error('AI API error:', error);
            response.innerHTML = `
                <div class="api-error">
                    <div class="api-error__icon">⚠️</div>
                    <div class="api-error__title">Connection Error</div>
                    <div class="api-error__message">Unable to connect to AI service. Please check your connection and try again.</div>
                </div>
            `;
        }
        
        input.value = '';
    }

    // Drag and Drop functionality
    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedId);
        const dropTarget = e.target.closest('.widget');
        
        if (dropTarget && draggedElement && draggedId !== dropTarget.id) {
            const grid = document.getElementById('dashboardGrid');
            const allWidgets = Array.from(grid.children);
            const draggedIndex = allWidgets.indexOf(draggedElement);
            const dropIndex = allWidgets.indexOf(dropTarget);
            
            if (draggedIndex < dropIndex) {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
            } else {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
            }
            
            // Update widget order in storage
            this.updateWidgetOrder();
        }
    }

    updateWidgetOrder() {
        const grid = document.getElementById('dashboardGrid');
        const orderedIds = Array.from(grid.children).map(child => child.id);
        
        // Reorder widgets array to match DOM order
        const orderedWidgets = [];
        orderedIds.forEach(id => {
            const widget = this.widgets.find(w => w.id === id);
            if (widget) orderedWidgets.push(widget);
        });
        
        this.widgets = orderedWidgets;
        this.saveWidgets();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});