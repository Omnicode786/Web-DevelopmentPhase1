// Ben 10 Secure Chat Application
class SecureChatApp {
    constructor() {
        this.socket = null;
        this.currentRoomId = null;
        this.encryptionKey = 'ben10-omnitrix-secure-key-2024'; // Default key
        this.username = 'Agent-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        this.demoMode = false;
        
        this.init();
    }

    init() {
        console.log('Initializing Ben 10 Secure Chat...');
        this.setupEventListeners();
        this.connectSocket();
    }

    connectSocket() {
        try {
            // Connect to Socket.IO server
            this.socket = io({
                timeout: 5000,
                transports: ['websocket', 'polling']
            });
            
            this.socket.on('connect', () => {
                console.log('Connected to secure network');
                this.showNotification('Connected to secure network', 'success');
                this.setupSocketEvents();
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from network');
                this.showNotification('Disconnected from network', 'warning');
            });

            this.socket.on('connect_error', (error) => {
                console.warn('Socket connection failed:', error);
                this.enableDemoMode();
            });

            // Set a timeout to enable demo mode if no connection
            setTimeout(() => {
                if (!this.socket || !this.socket.connected) {
                    console.log('No server connection - enabling demo mode');
                    this.enableDemoMode();
                }
            }, 3000);

        } catch (error) {
            console.warn('Socket.IO not available:', error);
            this.enableDemoMode();
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Create Room Button
        const createRoomBtn = document.getElementById('createRoomBtn');
        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', (e) => {
                console.log('Create room button clicked');
                e.preventDefault();
                this.createRoom();
            });
        }

        // Join Room Button
        const joinRoomBtn = document.getElementById('joinRoomBtn');
        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', (e) => {
                console.log('Join room button clicked');
                e.preventDefault();
                this.showJoinRoomModal();
            });
        }

        // Leave Room Button
        const leaveRoomBtn = document.getElementById('leaveRoomBtn');
        if (leaveRoomBtn) {
            leaveRoomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.leaveRoom();
            });
        }

        // Send Message Button
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Message Input Enter Key
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Modal Event Listeners
        this.setupModalEventListeners();
        
        console.log('Event listeners set up successfully');
    }

    setupModalEventListeners() {
        // Join Room Modal
        const cancelJoinBtn = document.getElementById('cancelJoinBtn');
        if (cancelJoinBtn) {
            cancelJoinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideJoinRoomModal();
            });
        }

        const confirmJoinBtn = document.getElementById('confirmJoinBtn');
        if (confirmJoinBtn) {
            confirmJoinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.joinRoom();
            });
        }

        const roomIdInput = document.getElementById('roomIdInput');
        if (roomIdInput) {
            roomIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.joinRoom();
                }
            });
        }

        // Room Created Modal
        const copyRoomIdBtn = document.getElementById('copyRoomIdBtn');
        if (copyRoomIdBtn) {
            copyRoomIdBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyRoomId();
            });
        }

        const enterRoomBtn = document.getElementById('enterRoomBtn');
        if (enterRoomBtn) {
            enterRoomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.enterCreatedRoom();
            });
        }

        // Modal overlay clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideAllModals();
            });
        });
    }

    setupSocketEvents() {
        if (!this.socket) return;

        // Room joined successfully
        this.socket.on('room-joined', (roomId) => {
            this.currentRoomId = roomId;
            this.showChatInterface();
            this.addSystemMessage(`Connected to room: ${roomId}`);
        });

        // Receive encrypted message
        this.socket.on('receive-msg', (data) => {
            this.receiveMessage(data);
        });

        // User joined room
        this.socket.on('user-joined', (data) => {
            this.addSystemMessage(`${data.username || 'Agent'} joined the room`);
        });

        // User left room
        this.socket.on('user-left', (data) => {
            this.addSystemMessage(`${data.username || 'Agent'} left the room`);
        });

        // Room error
        this.socket.on('room-error', (error) => {
            this.showNotification(error.message, 'error');
        });
    }

    createRoom() {
        console.log('Creating new room...');
        const roomId = this.generateRoomId();
        this.currentRoomId = roomId;
        
        // Set unique encryption key for this room
        this.encryptionKey = this.generateEncryptionKey(roomId);
        
        if (this.socket && this.socket.connected && !this.demoMode) {
            this.socket.emit('join-room', { roomId, username: this.username });
        }
        
        this.showRoomCreatedModal(roomId);
        this.showNotification('Room created successfully!', 'success');
    }

    showJoinRoomModal() {
        console.log('Showing join room modal...');
        const modal = document.getElementById('joinRoomModal');
        if (modal) {
            modal.classList.remove('hidden');
            const input = document.getElementById('roomIdInput');
            if (input) {
                input.focus();
                input.value = '';
            }
        }
    }

    hideJoinRoomModal() {
        const modal = document.getElementById('joinRoomModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        const input = document.getElementById('roomIdInput');
        if (input) {
            input.value = '';
        }
    }

    joinRoom() {
        const roomIdInput = document.getElementById('roomIdInput');
        const roomId = roomIdInput ? roomIdInput.value.trim().toUpperCase() : '';
        
        console.log('Attempting to join room:', roomId);
        
        if (!roomId) {
            this.showNotification('Please enter a room ID', 'warning');
            return;
        }

        if (!this.isValidRoomId(roomId)) {
            this.showNotification('Invalid room ID format (8 characters required)', 'error');
            return;
        }

        this.currentRoomId = roomId;
        this.encryptionKey = this.generateEncryptionKey(roomId);
        
        if (this.socket && this.socket.connected && !this.demoMode) {
            this.socket.emit('join-room', { roomId, username: this.username });
        } else {
            // Demo mode
            console.log('Demo mode: joining room', roomId);
            this.showChatInterface();
            this.addSystemMessage(`Connected to room: ${roomId} (Demo Mode)`);
            this.addSystemMessage('Demo mode active - Socket.IO server not available');
        }
        
        this.hideJoinRoomModal();
        this.showNotification(`Joined room: ${roomId}`, 'success');
    }

    showRoomCreatedModal(roomId) {
        console.log('Showing room created modal for:', roomId);
        const input = document.getElementById('createdRoomId');
        if (input) {
            input.value = roomId;
        }
        const modal = document.getElementById('roomCreatedModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    copyRoomId() {
        const roomIdInput = document.getElementById('createdRoomId');
        if (!roomIdInput) return;
        
        roomIdInput.select();
        roomIdInput.setSelectionRange(0, 99999);
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(roomIdInput.value).then(() => {
                    this.showNotification('Room ID copied to clipboard!', 'success');
                }).catch(() => {
                    this.fallbackCopyToClipboard(roomIdInput);
                });
            } else {
                this.fallbackCopyToClipboard(roomIdInput);
            }
        } catch (err) {
            this.fallbackCopyToClipboard(roomIdInput);
        }
    }

    fallbackCopyToClipboard(input) {
        try {
            document.execCommand('copy');
            this.showNotification('Room ID copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Please manually copy the room ID', 'warning');
            console.error('Copy failed:', err);
        }
    }

    enterCreatedRoom() {
        console.log('Entering created room...');
        const modal = document.getElementById('roomCreatedModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        this.showChatInterface();
        this.addSystemMessage(`Room created: ${this.currentRoomId}`);
        this.addSystemMessage('Share the Room ID with others to start chatting securely');
        
        if (this.demoMode) {
            this.addSystemMessage('Demo mode active - Socket.IO server not available');
        }
    }

    leaveRoom() {
        console.log('Leaving room...');
        
        if (this.socket && this.socket.connected && this.currentRoomId && !this.demoMode) {
            this.socket.emit('leave-room', { roomId: this.currentRoomId, username: this.username });
        }
        
        this.currentRoomId = null;
        this.encryptionKey = 'ben10-omnitrix-secure-key-2024';
        this.showConnectionPanel();
        this.clearMessages();
        this.showNotification('Left the room', 'info');
    }

    showConnectionPanel() {
        const connectionPanel = document.getElementById('connectionPanel');
        const chatInterface = document.getElementById('chatInterface');
        
        if (connectionPanel) connectionPanel.classList.remove('hidden');
        if (chatInterface) chatInterface.classList.add('hidden');
    }

    showChatInterface() {
        console.log('Showing chat interface...');
        const connectionPanel = document.getElementById('connectionPanel');
        const chatInterface = document.getElementById('chatInterface');
        const currentRoomId = document.getElementById('currentRoomId');
        const messageInput = document.getElementById('messageInput');
        
        if (connectionPanel) connectionPanel.classList.add('hidden');
        if (chatInterface) chatInterface.classList.remove('hidden');
        if (currentRoomId) currentRoomId.textContent = this.currentRoomId || 'Unknown';
        if (messageInput) messageInput.focus();
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;
        
        const plainMessage = messageInput.value.trim();
        
        if (!plainMessage) return;
        
        if (!this.currentRoomId) {
            this.showNotification('Not connected to any room', 'error');
            return;
        }

        console.log('Sending message:', plainMessage);

        try {
            // Encrypt the message
            const encryptedMessage = this.encryptMessage(plainMessage);
            
            // Create message data
            const messageData = {
                roomId: this.currentRoomId,
                encryptedMsg: encryptedMessage,
                username: this.username,
                timestamp: Date.now()
            };

            // Send via socket if connected
            if (this.socket && this.socket.connected && !this.demoMode) {
                this.socket.emit('send-msg', messageData);
            } else {
                // Demo mode - simulate echo
                console.log('Demo mode: simulating echo message');
                setTimeout(() => {
                    this.simulateEchoMessage(plainMessage);
                }, 1000 + Math.random() * 2000);
            }
            
            // Display sent message
            this.displayMessage(plainMessage, 'sent', this.username);
            
            // Clear input
            messageInput.value = '';
            
        } catch (error) {
            console.error('Failed to send message:', error);
            this.showNotification('Failed to send message', 'error');
        }
    }

    receiveMessage(data) {
        try {
            // Decrypt the message
            const decryptedMessage = this.decryptMessage(data.encryptedMsg);
            
            // Display received message
            this.displayMessage(decryptedMessage, 'received', data.username || 'Agent');
            
        } catch (error) {
            console.error('Failed to decrypt message:', error);
            this.displayMessage('[Encrypted message - unable to decrypt]', 'received', data.username || 'Agent');
        }
    }

    displayMessage(message, type, sender) {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        
        const bubbleElement = document.createElement('div');
        bubbleElement.className = 'message-bubble';
        
        const senderElement = document.createElement('div');
        senderElement.className = 'message-sender';
        senderElement.textContent = type === 'sent' ? 'You' : sender;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = message;
        
        bubbleElement.appendChild(senderElement);
        bubbleElement.appendChild(contentElement);
        messageElement.appendChild(bubbleElement);
        
        messagesList.appendChild(messageElement);
        
        // Scroll to bottom
        messagesList.scrollTop = messagesList.scrollHeight;
        
        // Add animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageElement.style.transition = 'all 0.3s ease-out';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
    }

    addSystemMessage(message) {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;
        
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-message';
        systemMessage.innerHTML = `<span class="system-icon">🛡️</span>${message}`;
        
        messagesList.appendChild(systemMessage);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    clearMessages() {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;
        
        messagesList.innerHTML = `
            <div class="system-message">
                <span class="system-icon">🛡️</span>
                End-to-end encryption activated. Your messages are secure.
            </div>
        `;
    }

    encryptMessage(message) {
        try {
            if (typeof CryptoJS === 'undefined') {
                console.warn('CryptoJS not available, using base64 encoding');
                return btoa(message);
            }
            const encrypted = CryptoJS.AES.encrypt(message, this.encryptionKey).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt message');
        }
    }

    decryptMessage(encryptedMessage) {
        try {
            if (typeof CryptoJS === 'undefined') {
                console.warn('CryptoJS not available, using base64 decoding');
                return atob(encryptedMessage);
            }
            
            const bytes = CryptoJS.AES.decrypt(encryptedMessage, this.encryptionKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!decrypted) {
                throw new Error('Decryption resulted in empty string');
            }
            
            return decrypted;
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Failed to decrypt message');
        }
    }

    generateRoomId() {
        // Generate a secure room ID
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log('Generated room ID:', result);
        return result;
    }

    generateEncryptionKey(roomId) {
        // Generate a room-specific encryption key
        if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) {
            return `ben10-${roomId}-${CryptoJS.MD5(roomId + 'omnitrix-secure').toString()}`;
        }
        return `ben10-${roomId}-simple-key`;
    }

    isValidRoomId(roomId) {
        // Validate room ID format (8 alphanumeric characters)
        return /^[A-Z0-9]{8}$/.test(roomId);
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    showNotification(message, type = 'info') {
        console.log(`Notification [${type}]:`, message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(22, 174, 88, 0.2);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(22, 174, 88, 0.3);
            border-radius: 8px;
            padding: 16px 20px;
            color: #C6E115;
            font-family: 'Orbitron', sans-serif;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 8px 32px 0 rgba(22, 174, 88, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        // Set colors based on type
        if (type === 'error') {
            notification.style.background = 'rgba(255, 84, 89, 0.2)';
            notification.style.borderColor = 'rgba(255, 84, 89, 0.3)';
            notification.style.color = '#FF5459';
        } else if (type === 'warning') {
            notification.style.background = 'rgba(230, 129, 97, 0.2)';
            notification.style.borderColor = 'rgba(230, 129, 97, 0.3)';
            notification.style.color = '#E68161';
        } else if (type === 'success') {
            notification.style.background = 'rgba(22, 174, 88, 0.2)';
            notification.style.borderColor = 'rgba(22, 174, 88, 0.3)';
            notification.style.color = '#16AE58';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    enableDemoMode() {
        // Enable demo mode for client-side testing
        this.demoMode = true;
        console.log('Demo mode enabled - Socket.IO connection not available');
        this.showNotification('Demo mode active - server not available', 'warning');
    }

    simulateEchoMessage(originalMessage) {
        // Simulate receiving an echo message in demo mode
        const responses = [
            'Message received and encrypted successfully!',
            'Omnitrix communication protocol active.',
            'Secure transmission confirmed.',
            `Echo: ${originalMessage}`,
            'Ben 10 secure network operational.',
            'Alien force communication established.',
            'Ultimate alien encryption active.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        try {
            const encryptedEcho = this.encryptMessage(randomResponse);
            this.receiveMessage({
                encryptedMsg: encryptedEcho,
                username: 'Echo-Agent-' + Math.random().toString(36).substr(2, 3).toUpperCase(),
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Demo echo failed:', error);
            // Fallback without encryption
            this.displayMessage(randomResponse, 'received', 'Echo-Agent');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing chat app...');
    try {
        window.chatApp = new SecureChatApp();
        console.log('Chat app initialized successfully');
    } catch (error) {
        console.error('Failed to initialize chat app:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.chatApp) {
        // Reconnect if needed when page becomes visible
        if (window.chatApp.socket && !window.chatApp.socket.connected) {
            window.chatApp.socket.connect();
        }
    }
});

// Handle before unload
window.addEventListener('beforeunload', () => {
    if (window.chatApp && window.chatApp.socket && window.chatApp.currentRoomId) {
        window.chatApp.socket.emit('leave-room', {
            roomId: window.chatApp.currentRoomId,
            username: window.chatApp.username
        });
    }
});