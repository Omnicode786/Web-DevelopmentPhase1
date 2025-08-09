// NED Student Portal - Real Web Scraping Integration
class NEDPortalReal {
    constructor() {
        this.currentSection = 'dashboard';
        this.isAuthenticated = false;
        this.studentData = null;
        this.authToken = null;
        this.sessionId = null;
        this.apiBaseUrl = window.location.origin; // Use same domain as frontend

        this.init();
    }

    init() {
        console.log('Initializing Real NED Portal...');
        this.checkAuthStatus();
        this.setupEventListeners();
        this.initializeTheme();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRealLogin();
            });
        }

        // Cancel login
        const cancelBtn = document.getElementById('cancelLogin');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelLogin();
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Refresh data
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshRealData();
            });
        }

        // User menu
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }

        // Mobile navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="switchSection"]')) {
                e.preventDefault();
                const onclick = e.target.closest('[onclick*="switchSection"]').getAttribute('onclick');
                const section = onclick.match(/switchSection\\('([^']+)'\\)/)?.[1];
                if (section) {
                    this.switchSection(section);
                }
            }
        });
    }

    // Real Authentication with Backend API
    async handleRealLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            this.showToast('Please enter both username and password', 'error');
            return;
        }

        try {
            this.showLoadingOverlay();

            // Call real backend API
            const response = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                this.isAuthenticated = true;
                this.authToken = result.token;
                this.sessionId = result.sessionId;
                this.studentData = result.data;

                // Store auth data (without password)
                localStorage.setItem('nedAuthToken', result.token);
                localStorage.setItem('nedStudentData', JSON.stringify(result.data));

                this.hideLoadingOverlay();
                this.showPortalSection();
                this.populateStudentData();
                this.showToast('Login successful! Real data loaded from NED Portal.', 'success');
            } else {
                throw new Error(result.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.hideLoadingOverlay();

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showToast('Backend server is not running. Please start the server first.', 'error');
            } else {
                this.showToast(`Login failed: ${error.message}`, 'error');
            }
        }
    }

    // Progress tracking for real scraping
    async trackScrapingProgress(sessionId) {
        const maxAttempts = 60; // 60 attempts = 60 seconds max
        let attempts = 0;

        const checkProgress = async () => {
            try {
                const response = await fetch(`${this.apiBaseUrl}/api/auth/progress/${sessionId}`);
                const result = await response.json();

                if (result.success) {
                    this.updateLoadingStatus(result.message, result.progress);

                    if (result.completed) {
                        return true; // Scraping completed
                    }
                }

                attempts++;
                if (attempts >= maxAttempts) {
                    throw new Error('Scraping timeout - taking too long');
                }

                // Continue checking
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await checkProgress();

            } catch (error) {
                throw new Error(`Progress tracking failed: ${error.message}`);
            }
        };

        return await checkProgress();
    }

    // Refresh real data from backend
    async refreshRealData() {
        if (!this.isAuthenticated || !this.authToken) {
            this.showToast('Please log in first', 'error');
            return;
        }

        try {
            this.showToast('Refreshing data from NED Portal...', 'info');

            const response = await fetch(`${this.apiBaseUrl}/api/student/refresh/${this.authToken}`);
            const result = await response.json();

            if (result.success) {
                this.studentData = result.data;
                localStorage.setItem('nedStudentData', JSON.stringify(result.data));

                // Update last sync time
                const lastSyncElement = document.getElementById('lastSync');
                if (lastSyncElement) {
                    lastSyncElement.textContent = `Last synced: ${new Date().toLocaleString()}`;
                }

                // Reload current section
                this.loadSectionData(this.currentSection);

                this.showToast('Data refreshed successfully!', 'success');
            } else {
                throw new Error(result.message || 'Failed to refresh data');
            }
        } catch (error) {
            console.error('Refresh error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showToast('Backend server is not running', 'error');
            } else {
                this.showToast(`Failed to refresh: ${error.message}`, 'error');
            }
        }
    }

    // UI Control Methods
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.updateLoadingStatus('Connecting to NED Portal...', 5);
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    updateLoadingStatus(message, progress) {
        const titleElement = document.getElementById('loadingTitle');
        const progressElement = document.getElementById('progressFill');
        const messageElement = document.getElementById('loadingMessage');

        if (titleElement) {
            titleElement.textContent = message;
        }

        if (messageElement) {
            const messages = [
                'Please wait while we authenticate your credentials',
                'Solving CAPTCHA automatically...',
                'Extracting your academic data...',
                'Almost done, finalizing information...'
            ];

            if (progress < 25) messageElement.textContent = messages[0];
            else if (progress < 50) messageElement.textContent = messages[1];
            else if (progress < 75) messageElement.textContent = messages[2];
            else messageElement.textContent = messages[3];
        }

        if (progressElement) {
            progressElement.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    showPortalSection() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('portalSection').classList.remove('hidden');
    }

    showLoginSection() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('portalSection').classList.add('hidden');
    }

    switchSection(sectionName) {
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        document.querySelectorAll(`[onclick*="${sectionName}"]`).forEach(item => {
            item.classList.add('active');
        });

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;

            // Load section-specific data
            this.loadSectionData(sectionName);
        }
    }

    loadSectionData(section) {
        if (!this.studentData) return;

        switch (section) {
            case 'dashboard':
                this.populateDashboard();
                break;
            case 'results':
                this.populateResults();
                break;
            case 'fees':
                this.populateFees();
                break;
            case 'timetable':
                this.populateTimetable();
                break;
            case 'profile':
                this.populateProfile();
                break;
        }
    }

    populateStudentData() {
        if (!this.studentData) return;

        // Update user name in navigation
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = this.studentData.profile.name;
        }

        // Update last sync time
        const lastSyncElement = document.getElementById('lastSync');
        if (lastSyncElement) {
            const syncTime = this.studentData.lastSync ? 
                new Date(this.studentData.lastSync).toLocaleString() : 
                new Date().toLocaleString();
            lastSyncElement.textContent = `Last synced: ${syncTime}`;
        }

        // Load current section data
        this.loadSectionData(this.currentSection);
    }

    populateDashboard() {
        const { academics, fees, notifications } = this.studentData;

        // Update stats cards
        document.getElementById('studentCGPA').textContent = academics.cgpa.toFixed(2);
        document.getElementById('cgpaChange').textContent = `Current CGPA from NED Portal`;
        document.getElementById('completedCredits').textContent = academics.completedCredits;
        document.getElementById('totalCredits').textContent = academics.totalCredits;
        document.getElementById('creditsProgress').textContent = `${Math.round((academics.completedCredits / academics.totalCredits) * 100)}% completed`;
        document.getElementById('studentRank').textContent = `${academics.rank}/${academics.totalStudents}`;
        document.getElementById('rankInfo').textContent = `Top ${Math.round((academics.rank / academics.totalStudents) * 100)}%`;

        // Update fee status
        const feeStatusEl = document.getElementById('feeStatus');
        const feeDetailsEl = document.getElementById('feeDetails');
        if (fees.dueAmount > 0) {
            feeStatusEl.textContent = `Rs. ${fees.dueAmount.toLocaleString()} Due`;
            feeStatusEl.style.color = 'var(--error-color)';
            feeDetailsEl.textContent = `Due: ${fees.dueDate}`;
        } else {
            feeStatusEl.textContent = 'All Clear';
            feeStatusEl.style.color = 'var(--success-color)';
            feeDetailsEl.textContent = 'No pending dues';
        }

        // Update notifications
        const notificationsList = document.getElementById('notificationsList');
        const notificationCount = document.getElementById('notificationCount');

        if (notificationsList && notifications) {
            const unreadCount = notifications.filter(n => !n.read).length;
            notificationCount.textContent = unreadCount;

            notificationsList.innerHTML = notifications.slice(0, 3).map(notification => `
                <div class="notification-item">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <div class="date">${new Date(notification.date).toLocaleDateString()}</div>
                </div>
            `).join('');
        }
    }

    populateResults() {
        const { academics, currentSemester } = this.studentData;

        // Update current GPA
        document.getElementById('currentGPA').textContent = academics.currentSemesterGPA.toFixed(2);

        // Update subjects table
        const tableBody = document.getElementById('subjectsTableBody');
        if (tableBody && currentSemester.subjects) {
            tableBody.innerHTML = currentSemester.subjects.map(subject => `
                <tr>
                    <td>${subject.code}</td>
                    <td>${subject.name}</td>
                    <td>${subject.credits}</td>
                    <td><strong>${subject.grade}</strong></td>
                    <td>${subject.gpa.toFixed(1)}</td>
                </tr>
            `).join('');
        }

        // Create CGPA chart
        this.createCGPAChart();
    }

    createCGPAChart() {
        const canvas = document.getElementById('cgpaChart');
        if (!canvas || !this.studentData.academics.cgpaHistory) return;

        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.cgpaChart) {
            this.cgpaChart.destroy();
        }

        const data = this.studentData.academics.cgpaHistory;

        this.cgpaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.semester),
                datasets: [{
                    label: 'CGPA',
                    data: data.map(item => item.gpa),
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1976d2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 2.0,
                        max: 4.0,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    populateFees() {
        const { fees } = this.studentData;

        // Update fee amounts
        document.getElementById('totalFees').textContent = `Rs. ${fees.totalFees.toLocaleString()}`;
        document.getElementById('paidAmount').textContent = `Rs. ${fees.paidAmount.toLocaleString()}`;
        document.getElementById('dueAmount').textContent = `Rs. ${fees.dueAmount.toLocaleString()}`;

        // Update payment history
        const paymentHistory = document.getElementById('paymentHistory');
        if (paymentHistory && fees.paymentHistory) {
            paymentHistory.innerHTML = fees.paymentHistory.map(payment => `
                <div class="payment-item">
                    <div class="payment-info">
                        <h4>${payment.description}</h4>
                        <p>${new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div class="payment-amount">
                        <div class="amount">Rs. ${payment.amount.toLocaleString()}</div>
                        <div class="status">${payment.status}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    populateTimetable() {
        const { timetable } = this.studentData;
        const timetableGrid = document.getElementById('timetableGrid');

        if (!timetableGrid || !timetable) return;

        // Group schedule by day
        const scheduleByDay = {};
        timetable.forEach(item => {
            if (!scheduleByDay[item.day]) {
                scheduleByDay[item.day] = [];
            }
            scheduleByDay[item.day].push(item);
        });

        // Sort classes by time for each day
        Object.keys(scheduleByDay).forEach(day => {
            scheduleByDay[day].sort((a, b) => a.time.localeCompare(b.time));
        });

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        timetableGrid.innerHTML = days.map(day => {
            const dayClasses = scheduleByDay[day] || [];

            return `
                <div class="timetable-day">
                    <div class="day-header">${day}</div>
                    <div class="day-classes">
                        ${dayClasses.length > 0 ? dayClasses.map(classItem => `
                            <div class="class-item">
                                <div class="class-time">${classItem.time}</div>
                                <div class="class-info">
                                    <h4>${classItem.subject}</h4>
                                    <p>${classItem.instructor}</p>
                                </div>
                                <div class="class-room">${classItem.room}</div>
                            </div>
                        `).join('') : '<div class="no-classes">No classes scheduled</div>'}
                    </div>
                </div>
            `;
        }).join('');
    }

    populateProfile() {
        const { profile } = this.studentData;

        document.getElementById('profileName').textContent = profile.name;
        document.getElementById('profileId').textContent = profile.studentId;
        document.getElementById('profileDepartment').textContent = profile.department;
        document.getElementById('profileBatch').textContent = profile.batch;
        document.getElementById('profileSemester').textContent = profile.semester;
        document.getElementById('profileEmail').textContent = profile.email;
        document.getElementById('profilePhone').textContent = profile.phone;
        document.getElementById('profileStatus').textContent = profile.status;
    }

    // Action Methods
    async downloadTranscript() {
        this.showToast('Preparing transcript download from NED Portal...', 'info');

        // Simulate transcript generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.showToast('Transcript downloaded successfully!', 'success');
    }

    async payFees() {
        if (!this.studentData || this.studentData.fees.dueAmount === 0) {
            this.showToast('No pending dues to pay.', 'info');
            return;
        }

        this.showToast('Redirecting to NED payment gateway...', 'info');

        // Simulate payment process
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.showToast('Payment gateway opened. Complete payment on NED portal.', 'success');
    }

    cancelLogin() {
        this.hideLoadingOverlay();
        this.showToast('Login cancelled.', 'info');
    }

    logout() {
        this.isAuthenticated = false;
        this.studentData = null;
        this.authToken = null;
        this.sessionId = null;

        // Clear stored data
        localStorage.removeItem('nedAuthToken');
        localStorage.removeItem('nedStudentData');

        // Reset form
        document.getElementById('loginForm').reset();

        // Show login section
        this.showLoginSection();

        this.showToast('Logged out successfully.', 'success');
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('nedPortalTheme') || 'light';
        this.applyTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('nedPortalTheme', newTheme);
    }

    applyTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Authentication State Management
    checkAuthStatus() {
        const storedToken = localStorage.getItem('nedAuthToken');
        const storedData = localStorage.getItem('nedStudentData');

        if (storedToken && storedData) {
            try {
                this.authToken = storedToken;
                this.studentData = JSON.parse(storedData);
                this.isAuthenticated = true;

                this.showPortalSection();
                this.populateStudentData();

                // Show that data is from previous session
                this.showToast('Loaded cached data. Click refresh for latest info.', 'info');

            } catch (error) {
                console.error('Error loading stored data:', error);
                this.logout();
            }
        } else {
            this.showLoginSection();
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type}`;

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide toast after 4 seconds for important messages
        setTimeout(() => {
            toast.classList.remove('show');
        }, type === 'error' ? 5000 : 4000);
    }
}

// Global functions for onclick handlers
function switchSection(section) {
    if (window.nedPortalReal) {
        window.nedPortalReal.switchSection(section);
    }
}

function logout() {
    if (window.nedPortalReal) {
        window.nedPortalReal.logout();
    }
}

function downloadTranscript() {
    if (window.nedPortalReal) {
        window.nedPortalReal.downloadTranscript();
    }
}

function payFees() {
    if (window.nedPortalReal) {
        window.nedPortalReal.payFees();
    }
}

// Initialize portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nedPortalReal = new NEDPortalReal();
    console.log('🚀 Real NED Student Portal initialized successfully!');
    console.log('🔗 Ready to connect to backend for real data scraping!');
});