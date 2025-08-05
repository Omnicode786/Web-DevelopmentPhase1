// Dashboard Application JavaScript

class Dashboard {
    constructor() {
        this.widgets = [];
        this.settings = {
            theme: 'light',
            apiKeys: {
                weather: 'YOUR_OPENWEATHER_API_KEY_HERE',
                news: 'YOUR_NEWS_API_KEY_HERE',
                gemini: 'AIzaSyCA97EwdSOQkSlps5A7o3MtqTcx-b3rUrU'
            }
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
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeModal('settingsModal'));
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettingsFromModal());
        
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

        // Config import/export
        document.getElementById('exportConfig').addEventListener('click', () => this.exportConfig());
        document.getElementById('importConfig').addEventListener('click', () => this.importConfig());
        document.getElementById('resetDashboard').addEventListener('click', () => this.resetDashboard());
        document.getElementById('configFileInput').addEventListener('change', (e) => this.handleConfigImport(e));
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

    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        
        // Populate form fields
        document.getElementById('weatherApiKey').value = this.settings.apiKeys.weather;
        document.getElementById('newsApiKey').value = this.settings.apiKeys.news;
        document.getElementById('geminiApiKey').value = this.settings.apiKeys.gemini;
        
        modal.classList.remove('hidden');
    }

    saveSettingsFromModal() {
        this.settings.apiKeys.weather = document.getElementById('weatherApiKey').value || 'YOUR_OPENWEATHER_API_KEY_HERE';
        this.settings.apiKeys.news = document.getElementById('newsApiKey').value || 'YOUR_NEWS_API_KEY_HERE';
        this.settings.apiKeys.gemini = document.getElementById('geminiApiKey').value || 'YOUR_GEMINI_API_KEY_HERE';
        
        this.saveSettings();
        this.closeModal('settingsModal');
        
        // Refresh widgets that use APIs
        this.refreshApiWidgets();
    }

    refreshApiWidgets() {
        this.widgets.forEach(widget => {
            if (widget.type === 'weather' || widget.type === 'news') {
                this.updateWidget(widget);
            }
        });
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

    async renderWeatherWidget(container) {
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
        const apiKey = this.settings.apiKeys.weather;
        
        if (apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
            this.showWeatherPlaceholder();
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            
            if (!response.ok) throw new Error('Weather API error');
            
            const data = await response.json();
            this.displayWeatherData(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showWeatherPlaceholder();
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

    showWeatherPlaceholder() {
        document.getElementById('weather-temp').textContent = '22°C';
        document.getElementById('weather-feels').textContent = '25°C';
        document.getElementById('weather-humidity').textContent = '65%';
        document.getElementById('weather-description').textContent = 'Partly Cloudy';
        document.getElementById('weather-location').textContent = 'New York';
        document.getElementById('weather-icon').textContent = '🌤️';
    }

    async renderNewsWidget(container) {
        container.innerHTML = '<div class="news-widget__articles" id="news-articles"><div class="loading">Loading news...</div></div>';
        
        const apiKey = this.settings.apiKeys.news;
        
        if (apiKey === 'YOUR_NEWS_API_KEY_HERE') {
            this.showNewsPlaceholder();
            return;
        }

        try {
            const response = await fetch(
                `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`
            );
            
            if (!response.ok) throw new Error('News API error');
            
            const data = await response.json();
            this.displayNewsData(data.articles);
        } catch (error) {
            console.error('News fetch error:', error);
            this.showNewsPlaceholder();
        }
    }

    displayNewsData(articles) {
        const container = document.getElementById('news-articles');
        container.innerHTML = '';
        
        articles.slice(0, 4).forEach(article => {
            const articleElement = document.createElement('a');
            articleElement.className = 'news-widget__article';
            articleElement.href = article.url;
            articleElement.target = '_blank';
            articleElement.innerHTML = `
                <div class="news-widget__article-title">${article.title}</div>
                <div class="news-widget__article-source">${article.source.name}</div>
            `;
            container.appendChild(articleElement);
        });
    }

    showNewsPlaceholder() {
        const container = document.getElementById('news-articles');
        const placeholderNews = [
            { title: 'Technology Advances Continue to Shape the Future', source: 'Tech News' },
            { title: 'Global Markets Show Positive Trends', source: 'Financial Times' },
            { title: 'Climate Change Solutions Gain Momentum', source: 'Environmental Report' },
            { title: 'Space Exploration Reaches New Milestones', source: 'Science Daily' }
        ];
        
        container.innerHTML = '';
        placeholderNews.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'news-widget__article';
            articleElement.innerHTML = `
                <div class="news-widget__article-title">${article.title}</div>
                <div class="news-widget__article-source">${article.source}</div>
            `;
            container.appendChild(articleElement);
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
        
        const apiKey = this.settings.apiKeys.gemini;
        
        if (apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            response.innerHTML = `
                <div class="ai-widget__loading">
                    Please add your Gemini API key in settings to use this feature.
                    <br><br>
                    Here's a sample response for "${question}":
                    <br><br>
                    Here are some great productivity tips:
                    <br>• Use the Pomodoro Technique (25min work, 5min break)
                    <br>• Plan your day the night before
                    <br>• Eliminate distractions during focus time
                </div>
            `;
            return;
        }

        response.innerHTML = '<div class="ai-widget__loading">Thinking...</div>';

        try {
            const apiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

            if (!apiResponse.ok) throw new Error('Gemini API error');

            const data = await apiResponse.json();
            const answer = data.candidates[0].content.parts[0].text;
            response.textContent = answer;
            
        } catch (error) {
            console.error('AI API error:', error);
            response.innerHTML = `
                <div style="color: var(--color-error);">
                    Sorry, I couldn't process your request. Please check your API key and try again.
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

    // Configuration management
    exportConfig() {
        const config = {
            widgets: this.widgets,
            settings: this.settings,
            todos: {},
            notes: {}
        };
        
        // Export todos and notes
        this.widgets.forEach(widget => {
            if (widget.type === 'todo') {
                config.todos[widget.id] = JSON.parse(localStorage.getItem(`todos-${widget.id}`) || '[]');
            }
            if (widget.type === 'notes') {
                config.notes[widget.id] = localStorage.getItem(`notes-${widget.id}`) || '';
            }
        });
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-config.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importConfig() {
        document.getElementById('configFileInput').click();
    }

    handleConfigImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                // Import widgets and settings
                this.widgets = config.widgets || [];
                this.settings = { ...this.settings, ...config.settings };
                
                // Import todos and notes
                if (config.todos) {
                    Object.keys(config.todos).forEach(widgetId => {
                        localStorage.setItem(`todos-${widgetId}`, JSON.stringify(config.todos[widgetId]));
                    });
                }
                
                if (config.notes) {
                    Object.keys(config.notes).forEach(widgetId => {
                        localStorage.setItem(`notes-${widgetId}`, config.notes[widgetId]);
                    });
                }
                
                this.saveSettings();
                this.saveWidgets();
                this.renderWidgets();
                this.applyTheme();
                
                alert('Configuration imported successfully!');
                
            } catch (error) {
                alert('Error importing configuration. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    resetDashboard() {
        if (confirm('Are you sure you want to reset the dashboard? This will remove all widgets and data.')) {
            localStorage.clear();
            this.widgets = [...this.defaultWidgets];
            this.settings.apiKeys = {
                weather: 'YOUR_OPENWEATHER_API_KEY_HERE',
                news: 'YOUR_NEWS_API_KEY_HERE',
                gemini: 'YOUR_GEMINI_API_KEY_HERE'
            };
            this.saveSettings();
            this.saveWidgets();
            this.renderWidgets();
            this.closeModal('settingsModal');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});