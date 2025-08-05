// Decentralized File Sharing Application
class DecentralizedFileSharing {
    constructor() {
        this.helia = null;
        this.unixfs = null;
        this.blockchain = new SimpleBlockchain();
        this.p2pConnections = new Map();
        this.currentRoom = null;
        this.isIpfsReady = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        await this.initIPFS();
        this.renderBlockchain();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Upload functionality
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const selectFiles = document.getElementById('selectFiles');

        selectFiles.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files);
        });

        // Download functionality
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadFile());
        document.getElementById('cidInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.downloadFile();
        });

        // P2P functionality
        document.getElementById('createRoom').addEventListener('click', () => this.createP2PRoom());
        document.getElementById('joinRoom').addEventListener('click', () => this.joinP2PRoom());
        document.getElementById('sendFiles').addEventListener('click', () => this.sendP2PFiles());
        document.getElementById('p2pFileInput').addEventListener('change', () => {
            const btn = document.getElementById('sendFiles');
            btn.disabled = false;
            btn.textContent = `Send ${document.getElementById('p2pFileInput').files.length} File(s)`;
        });

        // Blockchain functionality
        document.getElementById('validateChain').addEventListener('click', () => this.validateBlockchain());
        document.getElementById('exportChain').addEventListener('click', () => this.exportBlockchain());

        // Modal functionality
        document.getElementById('closeQrModal').addEventListener('click', () => this.closeModal());
        document.getElementById('copyCid').addEventListener('click', () => this.copyCid());
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-color-scheme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
        });
    }

    async initIPFS() {
        const statusElement = document.getElementById('ipfsStatus');
        try {
            statusElement.innerHTML = '<span class="status-dot"></span><span>IPFS: Initializing...</span>';
            
            // Initialize Helia (modern IPFS)
            this.helia = await window.Helia.createHelia();
            this.unixfs = window.HeliaUnixfs.unixfs(this.helia);
            
            this.isIpfsReady = true;
            statusElement.innerHTML = '<span class="status-dot"></span><span>IPFS: Connected</span>';
            statusElement.classList.add('connected');
            
            console.log('IPFS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize IPFS:', error);
            statusElement.innerHTML = '<span class="status-dot"></span><span>IPFS: Failed</span>';
            statusElement.classList.add('error');
            
            // Fallback to mock mode for demo
            this.initMockIPFS();
        }
    }

    initMockIPFS() {
        // Mock IPFS for demo purposes when real IPFS fails
        this.helia = {
            mock: true
        };
        this.unixfs = {
            addFile: async (file) => {
                // Generate a mock CID
                const content = await file.arrayBuffer();
                const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(content)).toString();
                return { cid: `bafkrei${hash.substring(0, 46)}` };
            },
            cat: async (cid) => {
                // Return mock data
                return new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]); // "Hello World"
            }
        };
        this.isIpfsReady = true;
        
        const statusElement = document.getElementById('ipfsStatus');
        statusElement.innerHTML = '<span class="status-dot"></span><span>IPFS: Mock Mode</span>';
        statusElement.classList.add('connecting');
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    async handleFileUpload(files) {
        if (!this.isIpfsReady) {
            this.showError('IPFS not ready. Please wait...');
            return;
        }

        const resultsDiv = document.getElementById('uploadResults');
        const fileResultDiv = document.getElementById('fileResult');
        const encrypt = document.getElementById('encryptFile').checked;

        resultsDiv.style.display = 'block';
        fileResultDiv.innerHTML = '';

        for (let file of files) {
            await this.uploadSingleFile(file, encrypt, fileResultDiv);
        }
    }

    async uploadSingleFile(file, encrypt, container) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `
            <div class="file-name"><span class="file-icon ${this.getFileType(file.type)}"></span>${file.name}</div>
            <div class="file-meta">${this.formatFileSize(file.size)} • ${file.type || 'Unknown'}</div>
        `;

        const fileActions = document.createElement('div');
        fileActions.className = 'file-actions';
        fileActions.innerHTML = '<div class="loading"></div>';

        fileItem.appendChild(fileInfo);
        fileItem.appendChild(fileActions);
        container.appendChild(fileItem);

        try {
            let fileToUpload = file;
            
            if (encrypt) {
                fileToUpload = await this.encryptFile(file);
                fileInfo.querySelector('.file-meta').innerHTML += ' • 🔒 Encrypted';
            }

            const result = await this.unixfs.addFile(fileToUpload);
            const cid = result.cid.toString();

            // Add to blockchain
            this.blockchain.addBlock({
                type: 'file_upload',
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                cid: cid,
                encrypted: encrypt,
                timestamp: new Date().toISOString()
            });

            // Update UI
            fileActions.innerHTML = `
                <button class="btn btn--primary btn--sm" onclick="app.showQR('${cid}')">Share</button>
                <button class="btn btn--outline btn--sm" onclick="app.copyCidToClipboard('${cid}')">Copy CID</button>
            `;

            this.updateBlockchainStats();
            this.renderBlockchain();

        } catch (error) {
            console.error('Upload failed:', error);
            fileActions.innerHTML = '<span class="error-message">Upload failed</span>';
        }
    }

    async downloadFile() {
        const cidInput = document.getElementById('cidInput');
        const cid = cidInput.value.trim();
        
        if (!cid) {
            this.showError('Please enter a CID');
            return;
        }

        if (!this.isIpfsReady) {
            this.showError('IPFS not ready');
            return;
        }

        const progressDiv = document.getElementById('downloadProgress');
        const previewDiv = document.getElementById('filePreview');
        const statusSpan = document.getElementById('downloadStatus');
        const progressBar = document.getElementById('downloadProgressBar');

        progressDiv.style.display = 'block';
        previewDiv.style.display = 'none';
        statusSpan.textContent = 'Fetching file...';
        progressBar.style.width = '0%';

        try {
            // Animate progress for better UX
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 90) progress = 90;
                progressBar.style.width = progress + '%';
            }, 200);

            const chunks = [];
            for await (const chunk of this.unixfs.cat(cid)) {
                chunks.push(chunk);
            }

            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            statusSpan.textContent = 'Download complete!';

            const data = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
            let offset = 0;
            for (const chunk of chunks) {
                data.set(chunk, offset);
                offset += chunk.length;
            }

            // Try to determine file type and create preview
            this.createFilePreview(data, cid);
            
            progressDiv.style.display = 'none';

        } catch (error) {
            console.error('Download failed:', error);
            statusSpan.textContent = 'Download failed. Please check the CID.';
            clearInterval(progressInterval);
        }
    }

    createFilePreview(data, cid) {
        const previewDiv = document.getElementById('filePreview');
        
        // Try to detect file type
        const isText = this.isTextData(data);
        const isImage = this.isImageData(data);
        
        let previewContent = '';
        
        if (isImage) {
            const blob = new Blob([data]);
            const url = URL.createObjectURL(blob);
            previewContent = `<img src="${url}" alt="Preview" class="preview-image">`;
        } else if (isText) {
            const text = new TextDecoder().decode(data);
            previewContent = `<pre class="preview-text">${this.escapeHtml(text.substring(0, 1000))}${text.length > 1000 ? '\n...(truncated)' : ''}</pre>`;
        } else {
            previewContent = `<p>Binary file (${this.formatFileSize(data.length)})</p>`;
        }

        previewDiv.innerHTML = `
            <div class="preview-header">
                <h4>File Preview</h4>
                <button class="btn btn--primary btn--sm" onclick="app.downloadFileData('${cid}', '${data.length}')">Download</button>
            </div>
            <div class="preview-content">${previewContent}</div>
        `;
        
        previewDiv.style.display = 'block';
        
        // Store data for download
        this.previewData = { cid, data };
    }

    downloadFileData(cid, size) {
        if (!this.previewData || this.previewData.cid !== cid) return;
        
        const blob = new Blob([this.previewData.data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const fileName = `file_${cid.substring(0, 8)}.bin`;
        
        a.href = url;
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // P2P WebRTC Implementation
    createP2PRoom() {
        const roomId = this.generateRoomId();
        this.currentRoom = roomId;
        this.showP2PRoom(roomId);
        this.initWebRTC(true);
    }

    joinP2PRoom() {
        const roomInput = document.getElementById('roomIdInput');
        const roomId = roomInput.value.trim();
        
        if (!roomId) {
            this.showError('Please enter a room ID');
            return;
        }
        
        this.currentRoom = roomId;
        this.showP2PRoom(roomId);
        this.initWebRTC(false);
    }

    showP2PRoom(roomId) {
        document.getElementById('p2pRoom').style.display = 'block';
        document.getElementById('currentRoomId').textContent = roomId;
        this.updateConnectionStatus('Connecting...');
    }

    async initWebRTC(isInitiator) {
        // Mock WebRTC implementation for demo
        // In a real implementation, you'd use a signaling server
        setTimeout(() => {
            this.updateConnectionStatus('Connected', true);
            document.getElementById('p2pActions').style.display = 'block';
        }, 2000);
    }

    updateConnectionStatus(status, connected = false) {
        const statusElement = document.getElementById('connectionStatus');
        statusElement.innerHTML = `<span class="status-dot"></span><span>${status}</span>`;
        
        if (connected) {
            statusElement.classList.add('connected');
        }
    }

    sendP2PFiles() {
        const fileInput = document.getElementById('p2pFileInput');
        const files = fileInput.files;
        
        if (!files.length) return;
        
        const transfersDiv = document.getElementById('p2pTransfers');
        
        Array.from(files).forEach((file, index) => {
            const transferItem = document.createElement('div');
            transferItem.className = 'transfer-item';
            transferItem.innerHTML = `
                <div class="transfer-info">
                    <div class="file-name">${file.name}</div>
                    <div class="transfer-status">Sending...</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            `;
            
            transfersDiv.appendChild(transferItem);
            
            // Mock file transfer progress
            this.mockFileTransfer(transferItem, file);
        });
        
        fileInput.value = '';
        document.getElementById('sendFiles').disabled = true;
        document.getElementById('sendFiles').textContent = 'Send Files';
    }

    mockFileTransfer(element, file) {
        const progressBar = element.querySelector('.progress-fill');
        const status = element.querySelector('.transfer-status');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                status.textContent = 'Complete';
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 300);
    }

    // Blockchain Implementation
    validateBlockchain() {
        const isValid = this.blockchain.isChainValid();
        const statusElement = document.getElementById('chainValid');
        
        if (isValid) {
            statusElement.innerHTML = '✅ Valid';
            statusElement.className = 'stat-value status--success';
        } else {
            statusElement.innerHTML = '❌ Invalid';
            statusElement.className = 'stat-value status--error';
        }
    }

    exportBlockchain() {
        const data = JSON.stringify(this.blockchain.chain, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `blockchain_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    updateBlockchainStats() {
        document.getElementById('totalBlocks').textContent = this.blockchain.chain.length;
        document.getElementById('totalFiles').textContent = this.blockchain.chain.length - 1; // Exclude genesis
    }

    renderBlockchain() {
        const container = document.getElementById('blockchainList');
        container.innerHTML = '';
        
        this.blockchain.chain.slice().reverse().forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.className = 'block-item';
            blockElement.innerHTML = `
                <div class="block-header">
                    <div class="block-index">Block #${block.index}</div>
                    <div class="block-timestamp">${new Date(block.timestamp).toLocaleString()}</div>
                </div>
                <div class="block-content">${this.formatBlockData(block.data)}</div>
                <div class="block-hash">Hash: ${block.hash}</div>
            `;
            container.appendChild(blockElement);
        });
    }

    formatBlockData(data) {
        if (typeof data === 'string') return data;
        if (data.type === 'file_upload') {
            return `📁 ${data.fileName} (${this.formatFileSize(data.fileSize)}) - CID: ${data.cid.substring(0, 20)}...`;
        }
        return JSON.stringify(data);
    }

    // QR Code and sharing
    showQR(cid) {
        const modal = document.getElementById('qrModal');
        const qrContainer = document.getElementById('qrContainer');
        const cidInput = document.getElementById('shareCid');
        
        cidInput.value = cid;
        
        // Generate QR code
        QRCode.toCanvas(qrContainer, cid, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, (error, canvas) => {
            if (error) {
                console.error('QR generation failed:', error);
            } else {
                // Clear previous canvas
                qrContainer.innerHTML = '';
                qrContainer.appendChild(canvas);
            }
        });
        
        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('qrModal').classList.add('hidden');
    }

    copyCid() {
        const cidInput = document.getElementById('shareCid');
        const button = document.getElementById('copyCid');
        
        cidInput.select();
        document.execCommand('copy');
        
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copy-success');
        }, 2000);
    }

    copyCidToClipboard(cid) {
        navigator.clipboard.writeText(cid).then(() => {
            this.showSuccess('CID copied to clipboard!');
        });
    }

    // Utility functions
    async encryptFile(file) {
        // Simple encryption using Web Crypto API
        const key = await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const fileData = await file.arrayBuffer();
        
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            fileData
        );
        
        // In a real app, you'd need to securely share the key
        const encryptedFile = new File([encrypted], file.name + '.encrypted', {
            type: 'application/encrypted'
        });
        
        return encryptedFile;
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    getFileType(mimeType) {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
        if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return 'code';
        return '';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    isTextData(data) {
        // Simple heuristic to detect text data
        const sample = data.slice(0, 512);
        for (let i = 0; i < sample.length; i++) {
            const byte = sample[i];
            if (byte === 0 || (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) {
                return false;
            }
        }
        return true;
    }

    isImageData(data) {
        // Check for common image file signatures
        const signatures = [
            [0xFF, 0xD8, 0xFF], // JPEG
            [0x89, 0x50, 0x4E, 0x47], // PNG
            [0x47, 0x49, 0x46], // GIF
            [0x52, 0x49, 0x46, 0x46] // WebP
        ];
        
        return signatures.some(sig => 
            sig.every((byte, i) => data[i] === byte)
        );
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        // Simple error display - in a real app you'd want a proper notification system
        alert('Error: ' + message);
    }

    showSuccess(message) {
        // Simple success display
        const toast = document.createElement('div');
        toast.className = 'success-message';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Simple Blockchain Implementation
class SimpleBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return {
            index: 0,
            timestamp: "2024-01-01T00:00:00.000Z",
            data: "Genesis Block - Decentralized File Storage System",
            previousHash: "0",
            hash: this.calculateHash(0, "2024-01-01T00:00:00.000Z", "Genesis Block - Decentralized File Storage System", "0")
        };
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const previousBlock = this.getLatestBlock();
        const newBlock = {
            index: previousBlock.index + 1,
            timestamp: new Date().toISOString(),
            data: data,
            previousHash: previousBlock.hash
        };
        
        newBlock.hash = this.calculateHash(
            newBlock.index,
            newBlock.timestamp,
            JSON.stringify(newBlock.data),
            newBlock.previousHash
        );
        
        this.chain.push(newBlock);
    }

    calculateHash(index, timestamp, data, previousHash) {
        return CryptoJS.SHA256(index + timestamp + data + previousHash).toString();
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== this.calculateHash(
                currentBlock.index,
                currentBlock.timestamp,
                JSON.stringify(currentBlock.data),
                currentBlock.previousHash
            )) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// Initialize the application
const app = new DecentralizedFileSharing();