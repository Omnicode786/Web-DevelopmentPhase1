// NED Student Portal - Web Scraping Integration
class NEDPortal {
    constructor() {
        this.currentSection = 'dashboard';
        this.isAuthenticated = false;
        this.studentData = null;
        this.scrapingStatus = null;
        this.authToken = null;

        this.init();
    }

    init() {
        console.log('Initializing NED Portal...');
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
                this.handleLogin();
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
                this.refreshData();
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
                const section = onclick.match(/switchSection\('([^']+)'\)/)?.[1];
                if (section) {
                    this.switchSection(section);
                }
            }
        });
    }

    // Authentication Methods
    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            this.showToast('Please enter both username and password', 'error');
            return;
        }

        try {
            this.showLoadingOverlay();
            const result = await this.authenticateUser(username, password);

            if (result.success) {
                this.isAuthenticated = true;
                this.authToken = result.token;
                this.studentData = result.data;

                // Store auth data (without password)
                localStorage.setItem('nedAuthToken', result.token);
                localStorage.setItem('nedStudentData', JSON.stringify(result.data));

                this.hideLoadingOverlay();
                this.showPortalSection();
                this.populateStudentData();
                this.showToast('Login successful! Welcome to your portal.', 'success');
            } else {
                throw new Error(result.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.hideLoadingOverlay();
            this.showToast(`Login failed: ${error.message}`, 'error');
        }
    }

    async authenticateUser(username, password) {
        // Simulate web scraping authentication process
        const scrapingSteps = [
            { message: 'Connecting to NED Portal...', duration: 2000 },
            { message: 'Loading login page...', duration: 1500 },
            { message: 'Solving CAPTCHA...', duration: 8000 },
            { message: 'Authenticating credentials...', duration: 3000 },
            { message: 'Fetching student dashboard...', duration: 2500 },
            { message: 'Parsing academic data...', duration: 2000 },
            { message: 'Loading fee information...', duration: 1500 },
            { message: 'Retrieving class schedule...', duration: 1000 },
            { message: 'Finalizing data...', duration: 1000 },
            { message: 'Login successful!', duration: 500 }
        ];

        let progress = 0;
        const progressStep = 100 / scrapingSteps.length;

        for (let i = 0; i < scrapingSteps.length; i++) {
            const step = scrapingSteps[i];
            this.updateLoadingStatus(step.message, progress);

            await new Promise(resolve => setTimeout(resolve, step.duration));
            progress += progressStep;
        }

        // Simulate authentication validation
        if (username.length < 3) {
            throw new Error('Invalid username format');
        }

        if (password.length < 4) {
            throw new Error('Invalid password format');
        }

        // Generate mock student data based on username
        const mockData = this.generateMockStudentData(username);

        return {
            success: true,
            token: this.generateAuthToken(),
            data: mockData,
            message: 'Authentication successful'
        };
    }

    generateMockStudentData(username) {
        // Generate realistic student data based on username
        const departments = ['Computer Systems Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'];
        const department = departments[username.length % departments.length];

        return {
            profile: {
                name: this.generateName(username),
                studentId: `NED-2021-${department.substring(0,2).toUpperCase()}-${Math.floor(Math.random() * 999) + 100}`,
                department: department,
                batch: '2021',
                semester: '7th Semester',
                status: 'Active',
                email: `${username}@neduet.edu.pk`,
                phone: `+92-${Math.floor(Math.random() * 900) + 300}-${Math.floor(Math.random() * 9000000) + 1000000}`,
                profileImage: `https://ui-avatars.com/api/?name=${username}&background=1976d2&color=fff&size=100`
            },
            academics: {
                cgpa: Math.round((Math.random() * 1.5 + 2.5) * 100) / 100,
                totalCredits: 95 + Math.floor(Math.random() * 20),
                completedCredits: 80 + Math.floor(Math.random() * 15),
                currentSemesterGPA: Math.round((Math.random() * 1.5 + 2.8) * 100) / 100,
                rank: Math.floor(Math.random() * 50) + 5,
                totalStudents: 120 + Math.floor(Math.random() * 30),
                cgpaHistory: this.generateCGPAHistory()
            },
            currentSemester: {
                subjects: this.generateSubjects(department)
            },
            fees: {
                totalFees: 25000 + Math.floor(Math.random() * 10000),
                paidAmount: 20000 + Math.floor(Math.random() * 5000),
                dueAmount: Math.floor(Math.random() * 8000),
                dueDate: this.getRandomFutureDate(),
                paymentHistory: this.generatePaymentHistory()
            },
            notifications: this.generateNotifications(),
            timetable: this.generateTimetable()
        };
    }

    generateName(username) {
        const firstNames = ['Ahmed', 'Muhammad', 'Ali', 'Hassan', 'Fatima', 'Ayesha', 'Omar', 'Zara', 'Bilal', 'Sara'];
        const lastNames = ['Khan', 'Ahmed', 'Ali', 'Hassan', 'Sheikh', 'Malik', 'Qureshi', 'Shah', 'Butt', 'Siddiqui'];

        const firstName = firstNames[username.charCodeAt(0) % firstNames.length];
        const lastName = lastNames[username.charCodeAt(username.length - 1) % lastNames.length];

        return `${firstName} ${lastName}`;
    }

    generateCGPAHistory() {
        const history = [];
        let currentGPA = 2.5 + Math.random() * 1.0;

        for (let i = 1; i <= 6; i++) {
            currentGPA += (Math.random() - 0.5) * 0.4;
            currentGPA = Math.max(2.0, Math.min(4.0, currentGPA));

            history.push({
                semester: `${i}${this.getOrdinalSuffix(i)}`,
                gpa: Math.round(currentGPA * 100) / 100,
                credits: 15 + Math.floor(Math.random() * 6)
            });
        }

        return history;
    }

    generateSubjects(department) {
        const subjects = {
            'Computer Systems Engineering': [
                { code: 'CS-401', name: 'Software Engineering', credits: 3 },
                { code: 'CS-402', name: 'Database Systems', credits: 3 },
                { code: 'CS-403', name: 'Computer Networks', credits: 3 },
                { code: 'CS-404', name: 'Web Technologies', credits: 3 },
                { code: 'CS-405', name: 'Machine Learning', credits: 3 },
                { code: 'CS-406', name: 'Capstone Project', credits: 6 }
            ],
            'Electrical Engineering': [
                { code: 'EE-401', name: 'Power Systems', credits: 3 },
                { code: 'EE-402', name: 'Control Systems', credits: 3 },
                { code: 'EE-403', name: 'Digital Signal Processing', credits: 3 },
                { code: 'EE-404', name: 'Microprocessors', credits: 3 },
                { code: 'EE-405', name: 'Communication Systems', credits: 3 },
                { code: 'EE-406', name: 'Final Year Project', credits: 6 }
            ],
            'default': [
                { code: 'ENG-401', name: 'Engineering Design', credits: 3 },
                { code: 'ENG-402', name: 'Project Management', credits: 3 },
                { code: 'ENG-403', name: 'Technical Writing', credits: 2 },
                { code: 'ENG-404', name: 'Professional Ethics', credits: 2 },
                { code: 'ENG-405', name: 'Entrepreneurship', credits: 2 },
                { code: 'ENG-406', name: 'Capstone Project', credits: 6 }
            ]
        };

        const subjectList = subjects[department] || subjects['default'];
        const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+'];
        const gpaValues = [4.0, 3.7, 3.3, 3.0, 2.7, 2.3];

        return subjectList.map(subject => {
            const gradeIndex = Math.floor(Math.random() * grades.length);
            return {
                ...subject,
                grade: grades[gradeIndex],
                gpa: gpaValues[gradeIndex]
            };
        });
    }

    generatePaymentHistory() {
        const history = [];
        const descriptions = ['Semester Fee', 'Lab Fee', 'Exam Fee', 'Library Fee', 'Sports Fee'];

        for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
            history.push({
                date: this.getRandomPastDate(),
                amount: 5000 + Math.floor(Math.random() * 15000),
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                status: 'Paid'
            });
        }

        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    generateNotifications() {
        const notifications = [
            {
                id: 1,
                title: 'New Result Published',
                message: 'Your 6th semester results are now available',
                date: this.getRecentDate(),
                type: 'academic',
                read: false
            },
            {
                id: 2,
                title: 'Fee Payment Reminder',
                message: 'Fee payment deadline is approaching',
                date: this.getRecentDate(),
                type: 'finance',
                read: false
            },
            {
                id: 3,
                title: 'Registration Open',
                message: 'Next semester course registration is now open',
                date: this.getRecentDate(),
                type: 'registration',
                read: true
            }
        ];

        return notifications;
    }

    generateTimetable() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timeSlots = ['09:00-10:30', '11:00-12:30', '14:00-15:30', '16:00-17:30'];
        const subjects = ['Software Engineering', 'Database Systems', 'Computer Networks', 'Machine Learning'];
        const rooms = ['CS-Lab-1', 'CS-201', 'CS-Lab-2', 'CS-301'];
        const instructors = ['Dr. Muhammad Ali', 'Prof. Sarah Khan', 'Dr. Hassan Ahmad', 'Ms. Fatima Sheikh'];

        const schedule = [];

        days.forEach(day => {
            const daySchedule = Math.floor(Math.random() * 3) + 1; // 1-3 classes per day

            for (let i = 0; i < daySchedule; i++) {
                if (i < timeSlots.length) {
                    schedule.push({
                        day: day,
                        time: timeSlots[i],
                        subject: subjects[Math.floor(Math.random() * subjects.length)],
                        room: rooms[Math.floor(Math.random() * rooms.length)],
                        instructor: instructors[Math.floor(Math.random() * instructors.length)]
                    });
                }
            }
        });

        return schedule;
    }

    // Utility Methods
    getOrdinalSuffix(num) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = num % 100;
        return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    }

    getRandomFutureDate() {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
        return date.toISOString().split('T')[0];
    }

    getRandomPastDate() {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 180) - 1);
        return date.toISOString().split('T')[0];
    }

    getRecentDate() {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        return date.toISOString().split('T')[0];
    }

    generateAuthToken() {
        return 'ned_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // UI Control Methods
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
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

        if (titleElement) {
            titleElement.textContent = message;
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
            lastSyncElement.textContent = `Last synced: ${new Date().toLocaleString()}`;
        }

        // Load current section data
        this.loadSectionData(this.currentSection);
    }

    populateDashboard() {
        const { academics, fees, notifications } = this.studentData;

        // Update stats cards
        document.getElementById('studentCGPA').textContent = academics.cgpa.toFixed(2);
        document.getElementById('cgpaChange').textContent = `↑ 0.${Math.floor(Math.random() * 15) + 5} from last semester`;
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
    async refreshData() {
        if (!this.isAuthenticated) return;

        try {
            this.showToast('Refreshing data from NED Portal...', 'info');

            // Simulate re-scraping process (shorter than initial login)
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Update last sync time
            const lastSyncElement = document.getElementById('lastSync');
            if (lastSyncElement) {
                lastSyncElement.textContent = `Last synced: ${new Date().toLocaleString()}`;
            }

            // Reload current section
            this.loadSectionData(this.currentSection);

            this.showToast('Data refreshed successfully!', 'success');
        } catch (error) {
            this.showToast('Failed to refresh data. Please try again.', 'error');
        }
    }

    async downloadTranscript() {
        this.showToast('Preparing transcript download...', 'info');

        // Simulate transcript generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.showToast('Transcript downloaded successfully!', 'success');
    }

    async payFees() {
        if (!this.studentData || this.studentData.fees.dueAmount === 0) {
            this.showToast('No pending dues to pay.', 'info');
            return;
        }

        this.showToast('Redirecting to payment gateway...', 'info');

        // Simulate payment process
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.showToast('Payment gateway opened in new tab.', 'success');
    }

    cancelLogin() {
        this.hideLoadingOverlay();
        this.showToast('Login cancelled.', 'info');
    }

    logout() {
        this.isAuthenticated = false;
        this.studentData = null;
        this.authToken = null;

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

                // Auto-refresh if data is old (older than 1 hour)
                const tokenTime = parseInt(storedToken.split('_').pop());
                if (Date.now() - tokenTime > 3600000) { // 1 hour
                    this.refreshData();
                }
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

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Global functions for onclick handlers
function switchSection(section) {
    if (window.nedPortal) {
        window.nedPortal.switchSection(section);
    }
}

function logout() {
    if (window.nedPortal) {
        window.nedPortal.logout();
    }
}

function downloadTranscript() {
    if (window.nedPortal) {
        window.nedPortal.downloadTranscript();
    }
}

function payFees() {
    if (window.nedPortal) {
        window.nedPortal.payFees();
    }
}

// Initialize portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nedPortal = new NEDPortal();
    console.log('NED Student Portal initialized successfully!');
});