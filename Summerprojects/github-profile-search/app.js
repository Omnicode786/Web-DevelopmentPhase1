class GitHubProfileSearch {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeTheme();
        this.searchTimeout = null;
        this.currentUser = null;
        
        // API endpoints
        this.API_BASE = 'https://api.github.com/users';
    }

    initializeElements() {
        // Input elements
        this.usernameInput = document.getElementById('usernameInput');
        this.searchButton = document.getElementById('searchButton');
        this.clearButton = document.getElementById('clearButton');
        this.themeToggle = document.getElementById('themeToggle');
        this.retryButton = document.getElementById('retryButton');

        // State elements
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.resultsSection = document.getElementById('resultsSection');

        // Error elements
        this.errorTitle = document.getElementById('errorTitle');
        this.errorMessage = document.getElementById('errorMessage');

        // User profile elements
        this.userProfile = document.getElementById('userProfile');
        this.userAvatar = document.getElementById('userAvatar');
        this.userName = document.getElementById('userName');
        this.userLogin = document.getElementById('userLogin');
        this.userBio = document.getElementById('userBio');
        this.userLocation = document.getElementById('userLocation');
        this.userLocationText = document.getElementById('userLocationText');
        this.userJoined = document.getElementById('userJoined');
        this.userJoinedText = document.getElementById('userJoinedText');
        this.userRepos = document.getElementById('userRepos');
        this.userFollowers = document.getElementById('userFollowers');
        this.userFollowing = document.getElementById('userFollowing');
        this.userProfileLink = document.getElementById('userProfileLink');

        // Repository elements
        this.repositoriesCard = document.getElementById('repositoriesCard');
        this.repositoriesList = document.getElementById('repositoriesList');
        this.noRepositories = document.getElementById('noRepositories');
    }

    initializeEventListeners() {
        // Search functionality
        this.usernameInput.addEventListener('input', this.handleInputChange.bind(this));
        this.usernameInput.addEventListener('keypress', this.handleKeyPress.bind(this));
        this.searchButton.addEventListener('click', this.handleSearch.bind(this));
        this.clearButton.addEventListener('click', this.handleClear.bind(this));
        this.retryButton.addEventListener('click', this.handleRetry.bind(this));

        // Theme toggle
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }

    initializeTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('github-search-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        // Only save to localStorage if it's available in the environment
        try {
            localStorage.setItem('github-search-theme', newTheme);
        } catch (e) {
            // localStorage not available in sandbox, continue without saving
        }
    }

    handleInputChange(event) {
        const value = event.target.value.trim();
        
        // Show/hide clear button
        if (value) {
            this.clearButton.classList.remove('hidden');
        } else {
            this.clearButton.classList.add('hidden');
        }

        // Debounced search
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (value) {
            this.searchTimeout = setTimeout(() => {
                this.searchUser(value);
            }, 300);
        } else {
            this.hideAllStates();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSearch();
        }
    }

    handleSearch() {
        const username = this.usernameInput.value.trim();
        if (username) {
            this.searchUser(username);
        }
    }

    handleClear() {
        this.usernameInput.value = '';
        this.clearButton.classList.add('hidden');
        this.hideAllStates();
        this.usernameInput.focus();
    }

    handleRetry() {
        const username = this.usernameInput.value.trim();
        if (username) {
            this.searchUser(username);
        }
    }

    async searchUser(username) {
        this.showLoadingState();
        
        try {
            const userData = await this.fetchUserData(username);
            const reposData = await this.fetchUserRepositories(username);
            
            this.currentUser = { ...userData, repositories: reposData };
            this.displayUserProfile(userData);
            this.displayRepositories(reposData);
            this.showResultsState();
            
        } catch (error) {
            this.handleError(error);
        }
    }

    async fetchUserData(username) {
        const response = await fetch(`${this.API_BASE}/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitHub-Profile-Search'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    }

    async fetchUserRepositories(username) {
        try {
            const response = await fetch(`${this.API_BASE}/${username}/repos?sort=updated&per_page=5`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Profile-Search'
                }
            });
            
            if (!response.ok) {
                // If repos fetch fails, return empty array but don't fail the whole search
                return [];
            }
            
            return await response.json();
        } catch (error) {
            // Return empty array if repositories can't be fetched
            return [];
        }
    }

    displayUserProfile(userData) {
        // Avatar - Set proper attributes and handle loading
        this.userAvatar.src = userData.avatar_url;
        this.userAvatar.alt = `${userData.login}'s avatar`;
        this.userAvatar.crossOrigin = 'anonymous';
        
        // Handle avatar loading errors
        this.userAvatar.onerror = () => {
            // Fallback to a default avatar or show initials
            this.userAvatar.style.background = 'var(--color-primary)';
            this.userAvatar.style.color = 'white';
            this.userAvatar.style.display = 'flex';
            this.userAvatar.style.alignItems = 'center';
            this.userAvatar.style.justifyContent = 'center';
            this.userAvatar.style.fontSize = '32px';
            this.userAvatar.style.fontWeight = 'bold';
            this.userAvatar.alt = userData.login.charAt(0).toUpperCase();
            this.userAvatar.title = 'Avatar could not be loaded';
        };

        // Basic info
        this.userName.textContent = userData.name || userData.login;
        this.userLogin.textContent = `@${userData.login}`;
        
        // Bio
        if (userData.bio) {
            this.userBio.textContent = userData.bio;
            this.userBio.style.display = 'block';
        } else {
            this.userBio.style.display = 'none';
        }

        // Location
        if (userData.location) {
            this.userLocationText.textContent = userData.location;
            this.userLocation.style.display = 'flex';
        } else {
            this.userLocation.style.display = 'none';
        }

        // Joined date
        const joinedDate = new Date(userData.created_at);
        this.userJoinedText.textContent = `Joined ${this.formatDate(joinedDate)}`;

        // Stats
        this.userRepos.textContent = this.formatNumber(userData.public_repos);
        this.userFollowers.textContent = this.formatNumber(userData.followers);
        this.userFollowing.textContent = this.formatNumber(userData.following);

        // Profile link - Handle properly in sandbox environment
        this.userProfileLink.href = userData.html_url;
        this.userProfileLink.onclick = (e) => {
            e.preventDefault();
            this.openExternalLink(userData.html_url);
        };
    }

    displayRepositories(repositories) {
        this.repositoriesList.innerHTML = '';

        if (!repositories || repositories.length === 0) {
            this.noRepositories.classList.remove('hidden');
            return;
        }

        this.noRepositories.classList.add('hidden');

        repositories.forEach(repo => {
            const repoElement = this.createRepositoryElement(repo);
            this.repositoriesList.appendChild(repoElement);
        });
    }

    createRepositoryElement(repo) {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'repository-item';

        const updatedDate = new Date(repo.updated_at);
        const timeAgo = this.getTimeAgo(updatedDate);

        repoDiv.innerHTML = `
            <div class="repository-header">
                <a href="${repo.html_url}" class="repository-name" data-repo-url="${repo.html_url}">
                    ${repo.name}
                </a>
                ${repo.language ? `<span class="repository-language" data-language="${repo.language.toLowerCase()}">${repo.language}</span>` : ''}
            </div>
            ${repo.description ? `<p class="repository-description">${this.escapeHtml(repo.description)}</p>` : ''}
            <div class="repository-stats">
                <div class="repository-stat">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    <span>${this.formatNumber(repo.stargazers_count)}</span>
                </div>
                <div class="repository-stat">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                    </svg>
                    <span>${this.formatNumber(repo.forks_count)}</span>
                </div>
                <div class="repository-updated">Updated ${timeAgo}</div>
            </div>
        `;

        // Add click handler for repository links
        const repoLink = repoDiv.querySelector('.repository-name');
        if (repoLink) {
            repoLink.onclick = (e) => {
                e.preventDefault();
                this.openExternalLink(repo.html_url);
            };
        }

        return repoDiv;
    }

    openExternalLink(url) {
        // Try different methods to open external links in sandbox environment
        try {
            // Method 1: Try window.open
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow) {
                newWindow.focus();
                return;
            }
        } catch (e) {
            // Continue to next method
        }

        try {
            // Method 2: Create temporary link and click it
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.target = '_blank';
            tempLink.rel = 'noopener noreferrer';
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        } catch (e) {
            // Method 3: Fallback - show URL to user
            this.showLinkFallback(url);
        }
    }

    showLinkFallback(url) {
        // Create a temporary modal to show the URL
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--color-surface);
            padding: var(--space-24);
            border-radius: var(--radius-lg);
            max-width: 500px;
            text-align: center;
        `;

        content.innerHTML = `
            <h3 style="margin-bottom: var(--space-16);">Open External Link</h3>
            <p style="margin-bottom: var(--space-16); word-break: break-all;">
                <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary);">${url}</a>
            </p>
            <button class="btn btn--primary" onclick="this.closest('[style*=fixed]').remove()">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 5000);
    }

    handleError(error) {
        let title = 'Something went wrong';
        let message = 'Please try again later.';

        if (error.message.includes('404')) {
            title = 'User not found';
            message = 'The GitHub user you searched for does not exist. Please check the username and try again.';
        } else if (error.message.includes('403')) {
            title = 'Rate limit exceeded';
            message = 'Too many requests have been made. Please wait a moment and try again.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            title = 'Network error';
            message = 'Please check your internet connection and try again.';
        }

        this.errorTitle.textContent = title;
        this.errorMessage.textContent = message;
        this.showErrorState();
    }

    showLoadingState() {
        this.hideAllStates();
        this.loadingState.classList.remove('hidden');
        this.loadingState.classList.add('fade-in');
    }

    showErrorState() {
        this.hideAllStates();
        this.errorState.classList.remove('hidden');
        this.errorState.classList.add('fade-in');
    }

    showResultsState() {
        this.hideAllStates();
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.classList.add('fade-in');
    }

    hideAllStates() {
        this.loadingState.classList.add('hidden');
        this.errorState.classList.add('hidden');
        this.resultsSection.classList.add('hidden');
        
        // Remove animation classes
        this.loadingState.classList.remove('fade-in');
        this.errorState.classList.remove('fade-in');
        this.resultsSection.classList.remove('fade-in');
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        } else if (diffMonths > 0) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return 'Today';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubProfileSearch();
});

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if no manual theme preference is set
    try {
        if (!localStorage.getItem('github-search-theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-color-scheme', theme);
        }
    } catch (e) {
        // localStorage not available, continue without checking
    }
});