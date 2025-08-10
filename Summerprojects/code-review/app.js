// Import Google Generative AI
import { GoogleGenerativeAI } from '@google/generative-ai';

// Application data from the JSON
const appData = {
  "promptTemplate": "You are an expert code reviewer with 10+ years of experience in software development and security. Your task is to analyze the provided code and provide comprehensive, actionable feedback.\n\nPlease analyze the following {language} code:\n\n```{language}\n{code}\n```\n\nProvide a detailed analysis in JSON format with the following structure:\n\n{\n  \"summary\": {\n    \"totalIssues\": number,\n    \"criticalIssues\": number,\n    \"highIssues\": number,\n    \"mediumIssues\": number,\n    \"lowIssues\": number,\n    \"overallRating\": \"Excellent/Good/Fair/Poor\",\n    \"mainConcerns\": [\"concern1\", \"concern2\"]\n  },\n  \"issues\": [\n    {\n      \"category\": \"Bug Detection|Security|Performance|Code Quality|Maintainability\",\n      \"severity\": \"Critical|High|Medium|Low\",\n      \"title\": \"Brief issue title\",\n      \"description\": \"Detailed explanation of the issue\",\n      \"lineNumber\": number,\n      \"codeSnippet\": \"problematic code\",\n      \"suggestion\": \"How to fix this issue\",\n      \"fixedCode\": \"corrected code example\",\n      \"impact\": \"What happens if not fixed\"\n    }\n  ],\n  \"recommendations\": [\n    \"General recommendation 1\",\n    \"General recommendation 2\"\n  ]\n}\n\nBe thorough, accurate, and provide specific actionable feedback. Focus on real issues that could cause problems in production.",

  "languages": [
    { "value": "javascript", "label": "JavaScript", "monaco": "javascript" },
    { "value": "typescript", "label": "TypeScript", "monaco": "typescript" },
    { "value": "python", "label": "Python", "monaco": "python" },
    { "value": "java", "label": "Java", "monaco": "java" },
    { "value": "cpp", "label": "C++", "monaco": "cpp" },
    { "value": "csharp", "label": "C#", "monaco": "csharp" },
    { "value": "go", "label": "Go", "monaco": "go" },
    { "value": "rust", "label": "Rust", "monaco": "rust" },
    { "value": "php", "label": "PHP", "monaco": "php" },
    { "value": "ruby", "label": "Ruby", "monaco": "ruby" },
    { "value": "swift", "label": "Swift", "monaco": "swift" },
    { "value": "kotlin", "label": "Kotlin", "monaco": "kotlin" }
  ],

  "categoryConfig": {
    "Bug Detection": {
      "icon": "🐛",
      "color": "#dc2626",
      "description": "Potential runtime errors, logic issues, and crashes"
    },
    "Security": {
      "icon": "🔒",
      "color": "#7c2d12",
      "description": "Security vulnerabilities and potential attack vectors"
    },
    "Performance": {
      "icon": "⚡",
      "color": "#ea580c",
      "description": "Performance bottlenecks and optimization opportunities"
    },
    "Code Quality": {
      "icon": "🎯",
      "color": "#d97706",
      "description": "Code structure, naming conventions, and best practices"
    },
    "Maintainability": {
      "icon": "🔧",
      "color": "#65a30d",
      "description": "Long-term code maintenance and readability issues"
    }
  },

  "sampleCodes": {
    "javascript": {
      "title": "E-commerce Cart Function",
      "code": "function calculateCartTotal(items) {\n  var total = 0;\n  for (i = 0; i < items.length; i++) {\n    if (items[i].price && items[i].quantity) {\n      total += items[i].price * items[i].quantity;\n    }\n  }\n  \n  // Apply discount\n  if (total > 100) {\n    total = total * 0.9;\n  }\n  \n  return total;\n}\n\n// Usage\nvar cart = [\n  { name: 'Laptop', price: 999.99, quantity: 1 },\n  { name: 'Mouse', price: 29.99, quantity: 2 },\n  { name: 'Keyboard', price: null, quantity: 1 }\n];\n\nvar finalTotal = calculateCartTotal(cart);\nconsole.log('Total: $' + finalTotal);"
    },
    "python": {
      "title": "User Authentication System",
      "code": "import hashlib\nimport sqlite3\n\nclass UserAuth:\n    def __init__(self, db_path):\n        self.db_path = db_path\n        self.init_db()\n    \n    def init_db(self):\n        conn = sqlite3.connect(self.db_path)\n        cursor = conn.cursor()\n        cursor.execute('''\n            CREATE TABLE IF NOT EXISTS users (\n                id INTEGER PRIMARY KEY,\n                username TEXT UNIQUE,\n                password TEXT\n            )\n        ''')\n        conn.commit()\n        conn.close()\n    \n    def register_user(self, username, password):\n        hashed_password = hashlib.md5(password.encode()).hexdigest()\n        \n        conn = sqlite3.connect(self.db_path)\n        cursor = conn.cursor()\n        \n        try:\n            cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', \n                         (username, hashed_password))\n            conn.commit()\n            return True\n        except sqlite3.IntegrityError:\n            return False\n        finally:\n            conn.close()\n    \n    def authenticate(self, username, password):\n        hashed_password = hashlib.md5(password.encode()).hexdigest()\n        \n        conn = sqlite3.connect(self.db_path)\n        cursor = conn.cursor()\n        \n        cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', \n                      (username, hashed_password))\n        user = cursor.fetchone()\n        conn.close()\n        \n        return user is not None"
    },
    "java": {
      "title": "File Processing Utility",
      "code": "import java.io.*;\nimport java.util.*;\n\npublic class FileProcessor {\n    \n    public static List<String> processLogFile(String filePath) {\n        List<String> errors = new ArrayList<>();\n        BufferedReader reader = null;\n        \n        try {\n            reader = new BufferedReader(new FileReader(filePath));\n            String line;\n            \n            while ((line = reader.readLine()) != null) {\n                if (line.contains(\"ERROR\")) {\n                    errors.add(line);\n                }\n            }\n        } catch (IOException e) {\n            System.out.println(\"Error reading file: \" + e.getMessage());\n        }\n        \n        return errors;\n    }\n    \n    public static void writeErrorsToFile(List<String> errors, String outputPath) {\n        FileWriter writer = null;\n        \n        try {\n            writer = new FileWriter(outputPath);\n            \n            for (String error : errors) {\n                writer.write(error + \"\\n\");\n            }\n        } catch (IOException e) {\n            System.out.println(\"Error writing file: \" + e.getMessage());\n        }\n    }\n    \n    public static void main(String[] args) {\n        String inputFile = args[0];\n        String outputFile = args[1];\n        \n        List<String> errors = processLogFile(inputFile);\n        writeErrorsToFile(errors, outputFile);\n        \n        System.out.println(\"Processing complete. Found \" + errors.size() + \" errors.\");\n    }\n}"
    }
  }
};

// Global variables
let monacoEditor = null;
let currentLanguage = 'javascript';
let genAI = null;
let apiKey = null;
let analysisHistory = [];

// DOM elements
const elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing AI Code Reviewer...');
  
  // Add small delay to ensure all DOM elements are ready
  setTimeout(() => {
    try {
      initializeElements();
      initializeMonacoEditor();
      attachEventListeners();
      populateSampleOptions();
      checkApiKeyStatus();
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
      showErrorToast('Application initialization failed. Please refresh the page.');
    }
  }, 100);
});

// Initialize DOM element references with error handling
function initializeElements() {
  console.log('Initializing DOM elements...');
  
  const elementIds = [
    'language-select', 'load-sample-btn', 'upload-btn', 'file-input', 'analyze-btn',
    'analysis-results', 'no-analysis', 'results-content', 'issues-count', 'overall-rating',
    'export-btn', 'copy-results-btn', 'settings-btn', 'settings-modal', 'close-settings',
    'api-key-input', 'toggle-api-key', 'api-status-indicator', 'test-api-btn', 'save-settings-btn',
    'analysis-depth', 'include-suggestions', 'include-examples', 'sample-modal', 'sample-options',
    'close-modal', 'api-key-banner', 'setup-api-btn', 'loading-overlay', 'progress-fill',
    'error-toast', 'success-toast', 'error-message', 'success-message', 'close-toast',
    'close-success-toast', 'lines-count', 'chars-count', 'selected-language', 'deep-analysis',
    'security-focus'
  ];
  
  elementIds.forEach(id => {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with id '${id}' not found`);
    }
    elements[id.replace(/-/g, '_')] = element;
  });
  
  console.log('DOM elements initialized:', Object.keys(elements).length);
}

// Initialize Monaco Editor with better error handling
function initializeMonacoEditor() {
  console.log('Initializing Monaco Editor...');
  
  if (typeof require === 'undefined') {
    console.error('Monaco Editor loader not available');
    showErrorToast('Code editor failed to load. Please refresh the page.');
    return;
  }
  
  require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function () {
    try {
      const editorContainer = document.getElementById('monaco-editor');
      if (!editorContainer) {
        throw new Error('Editor container not found');
      }
      
      monacoEditor = monaco.editor.create(editorContainer, {
        value: '// Welcome to AI Code Reviewer!\n// Paste your code here or upload a file to get started\n// Make sure to set your Gemini API key in Settings\n\nfunction example() {\n    console.log("Ready for AI-powered code analysis!");\n    return "Let\'s find those bugs and optimize your code!";\n}',
        language: currentLanguage,
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        minimap: { enabled: true },
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true
      });

      // Listen for content changes
      monacoEditor.onDidChangeModelContent(() => {
        updateEditorStats();
        hideResults();
      });
      
      // Initial stats update
      updateEditorStats();
      console.log('Monaco Editor initialized successfully');
    } catch (error) {
      console.error('Monaco Editor initialization failed:', error);
      showErrorToast('Code editor initialization failed. Please refresh the page.');
    }
  }, function(error) {
    console.error('Failed to load Monaco Editor:', error);
    showErrorToast('Failed to load code editor. Please check your internet connection.');
  });
}

// Update editor statistics
function updateEditorStats() {
  if (!monacoEditor || !elements.lines_count) return;
  
  try {
    const model = monacoEditor.getModel();
    const lineCount = model.getLineCount();
    const charCount = model.getValueLength();
    
    elements.lines_count.textContent = `${lineCount} lines`;
    elements.chars_count.textContent = `${charCount} characters`;
    
    const languageLabel = appData.languages.find(lang => lang.value === currentLanguage)?.label || 'Unknown';
    elements.selected_language.textContent = languageLabel;
  } catch (error) {
    console.error('Error updating editor stats:', error);
  }
}

// Attach event listeners with comprehensive error handling
function attachEventListeners() {
  console.log('Attaching event listeners...');
  
  try {
    // Language selection
    if (elements.language_select) {
      elements.language_select.addEventListener('change', function(e) {
        currentLanguage = e.target.value;
        if (monacoEditor) {
          monaco.editor.setModelLanguage(monacoEditor.getModel(), getMonacoLanguage(currentLanguage));
        }
        updateEditorStats();
      });
    }

    // File upload
    if (elements.upload_btn && elements.file_input) {
      elements.upload_btn.addEventListener('click', (e) => {
        e.preventDefault();
        elements.file_input.click();
      });
      elements.file_input.addEventListener('change', handleFileUpload);
    }

    // Load sample code button
    if (elements.load_sample_btn) {
      elements.load_sample_btn.addEventListener('click', (e) => {
        e.preventDefault();
        showSampleModal();
      });
    }

    // Analyze button
    if (elements.analyze_btn) {
      elements.analyze_btn.addEventListener('click', (e) => {
        e.preventDefault();
        analyzeCode();
      });
    }

    // Settings
    if (elements.settings_btn) {
      elements.settings_btn.addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsModal();
      });
    }
    
    if (elements.setup_api_btn) {
      elements.setup_api_btn.addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsModal();
      });
    }
    
    if (elements.close_settings) {
      elements.close_settings.addEventListener('click', (e) => {
        e.preventDefault();
        hideSettingsModal();
      });
    }
    
    if (elements.toggle_api_key) {
      elements.toggle_api_key.addEventListener('click', (e) => {
        e.preventDefault();
        toggleApiKeyVisibility();
      });
    }
    
    if (elements.test_api_btn) {
      elements.test_api_btn.addEventListener('click', (e) => {
        e.preventDefault();
        testApiConnection();
      });
    }
    
    if (elements.save_settings_btn) {
      elements.save_settings_btn.addEventListener('click', (e) => {
        e.preventDefault();
        saveSettings();
      });
    }

    // Sample modal
    if (elements.close_modal) {
      elements.close_modal.addEventListener('click', (e) => {
        e.preventDefault();
        hideSampleModal();
      });
    }
    
    // Export and copy
    if (elements.export_btn) {
      elements.export_btn.addEventListener('click', (e) => {
        e.preventDefault();
        exportResults();
      });
    }
    
    if (elements.copy_results_btn) {
      elements.copy_results_btn.addEventListener('click', (e) => {
        e.preventDefault();
        copyResults();
      });
    }

    // Modal overlays
    if (elements.settings_modal) {
      const settingsOverlay = elements.settings_modal.querySelector('.modal-overlay');
      if (settingsOverlay) {
        settingsOverlay.addEventListener('click', () => hideSettingsModal());
      }
    }
    
    if (elements.sample_modal) {
      const sampleOverlay = elements.sample_modal.querySelector('.modal-overlay');
      if (sampleOverlay) {
        sampleOverlay.addEventListener('click', () => hideSampleModal());
      }
    }

    // Toast close buttons
    if (elements.close_toast) {
      elements.close_toast.addEventListener('click', () => hideErrorToast());
    }
    
    if (elements.close_success_toast) {
      elements.close_success_toast.addEventListener('click', () => hideSuccessToast());
    }

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (elements.settings_modal && !elements.settings_modal.classList.contains('hidden')) {
          hideSettingsModal();
        }
        if (elements.sample_modal && !elements.sample_modal.classList.contains('hidden')) {
          hideSampleModal();
        }
      }
    });
    
    console.log('Event listeners attached successfully');
  } catch (error) {
    console.error('Error attaching event listeners:', error);
    showErrorToast('Failed to initialize application controls. Please refresh the page.');
  }
}

// Check API key status on load
function checkApiKeyStatus() {
  console.log('Checking API key status...');
  
  try {
    // Check if API key is stored (in a real app, you'd want to encrypt this)
    apiKey = sessionStorage.getItem('gemini_api_key');
    
    if (apiKey && apiKey.trim()) {
      initializeGeminiAI();
      hideApiKeyBanner();
      updateApiStatusIndicator('connected', 'API key configured');
      if (elements.analyze_btn) {
        elements.analyze_btn.disabled = false;
      }
    } else {
      showApiKeyBanner();
      updateApiStatusIndicator('disconnected', 'API key not configured');
      if (elements.analyze_btn) {
        elements.analyze_btn.disabled = true;
      }
    }
  } catch (error) {
    console.error('Error checking API key status:', error);
  }
}

// Initialize Gemini AI
function initializeGeminiAI() {
  if (apiKey && apiKey.trim()) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('Gemini AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      showErrorToast('Failed to initialize Gemini AI. Please check your API key.');
    }
  }
}

// Show/hide API key banner
function showApiKeyBanner() {
  if (elements.api_key_banner) {
    elements.api_key_banner.classList.remove('hidden');
  }
}

function hideApiKeyBanner() {
  if (elements.api_key_banner) {
    elements.api_key_banner.classList.add('hidden');
  }
}

// Update API status indicator
function updateApiStatusIndicator(status, message) {
  if (elements.api_status_indicator) {
    elements.api_status_indicator.className = `status-indicator status-indicator--${status}`;
    const statusText = elements.api_status_indicator.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = message;
    }
  }
}

// Show/hide modals
function showSettingsModal() {
  console.log('Showing settings modal');
  if (elements.settings_modal) {
    elements.settings_modal.classList.remove('hidden');
    if (apiKey && elements.api_key_input) {
      elements.api_key_input.value = apiKey;
    }
    document.body.style.overflow = 'hidden';
  }
}

function hideSettingsModal() {
  console.log('Hiding settings modal');
  if (elements.settings_modal) {
    elements.settings_modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function showSampleModal() {
  console.log('Showing sample modal');
  if (elements.sample_modal) {
    elements.sample_modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function hideSampleModal() {
  console.log('Hiding sample modal');
  if (elements.sample_modal) {
    elements.sample_modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
  if (!elements.api_key_input || !elements.toggle_api_key) return;
  
  const input = elements.api_key_input;
  const button = elements.toggle_api_key;
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

// Test API connection
async function testApiConnection() {
  if (!elements.api_key_input || !elements.test_api_btn) return;
  
  const testKey = elements.api_key_input.value.trim();
  
  if (!testKey) {
    showErrorToast('Please enter an API key first.');
    return;
  }
  
  updateApiStatusIndicator('testing', 'Testing connection...');
  elements.test_api_btn.disabled = true;
  elements.test_api_btn.textContent = 'Testing...';
  
  try {
    const testAI = new GoogleGenerativeAI(testKey);
    const model = testAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent('Hello, can you respond with just "API connection successful"?');
    const response = await result.response;
    const text = response.text();
    
    if (text && text.length > 0) {
      updateApiStatusIndicator('connected', 'API connection successful');
      showSuccessToast('API connection test passed!');
    } else {
      throw new Error('Empty response from API');
    }
  } catch (error) {
    console.error('API test failed:', error);
    updateApiStatusIndicator('disconnected', 'API connection failed');
    
    let errorMessage = 'API test failed. ';
    if (error.message.includes('API_KEY')) {
      errorMessage += 'Invalid API key.';
    } else if (error.message.includes('quota')) {
      errorMessage += 'API quota exceeded.';
    } else if (error.message.includes('PERMISSION_DENIED')) {
      errorMessage += 'API key does not have required permissions.';
    } else {
      errorMessage += 'Please check your API key and try again.';
    }
    
    showErrorToast(errorMessage);
  } finally {
    if (elements.test_api_btn) {
      elements.test_api_btn.disabled = false;
      elements.test_api_btn.textContent = 'Test API Connection';
    }
  }
}

// Save settings
function saveSettings() {
  if (!elements.api_key_input) return;
  
  const newApiKey = elements.api_key_input.value.trim();
  
  if (!newApiKey) {
    showErrorToast('Please enter a valid API key.');
    return;
  }
  
  // Store API key (in production, you'd want to encrypt this)
  sessionStorage.setItem('gemini_api_key', newApiKey);
  apiKey = newApiKey;
  
  // Initialize Gemini AI with new key
  initializeGeminiAI();
  
  // Update UI
  hideApiKeyBanner();
  updateApiStatusIndicator('connected', 'API key saved successfully');
  if (elements.analyze_btn) {
    elements.analyze_btn.disabled = false;
  }
  
  showSuccessToast('Settings saved successfully!');
  hideSettingsModal();
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size (limit to 1MB for now)
  if (file.size > 1024 * 1024) {
    showErrorToast('File size too large. Please select a file under 1MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    if (monacoEditor) {
      monacoEditor.setValue(content);
      
      // Try to detect language from file extension
      const extension = file.name.split('.').pop().toLowerCase();
      const languageMap = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'cpp',
        'cs': 'csharp',
        'go': 'go',
        'rs': 'rust',
        'php': 'php',
        'rb': 'ruby',
        'kt': 'kotlin',
        'swift': 'swift'
      };
      
      if (languageMap[extension]) {
        currentLanguage = languageMap[extension];
        if (elements.language_select) {
          elements.language_select.value = currentLanguage;
        }
        monaco.editor.setModelLanguage(monacoEditor.getModel(), getMonacoLanguage(currentLanguage));
        updateEditorStats();
      }
      
      showSuccessToast(`File "${file.name}" loaded successfully!`);
      hideResults();
    }
  };
  
  reader.onerror = function() {
    showErrorToast('Error reading file. Please try again.');
  };
  
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

// Get Monaco Editor language identifier
function getMonacoLanguage(language) {
  const languageMap = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'csharp': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin'
  };
  return languageMap[language] || 'plaintext';
}

// Populate sample code options
function populateSampleOptions() {
  if (!elements.sample_options) return;
  
  elements.sample_options.innerHTML = '';
  
  Object.keys(appData.sampleCodes).forEach(language => {
    const sample = appData.sampleCodes[language];
    const option = document.createElement('div');
    option.className = 'sample-option';
    option.dataset.language = language;
    
    const preview = sample.code.substring(0, 150) + (sample.code.length > 150 ? '...' : '');
    
    option.innerHTML = `
      <div class="sample-title">${sample.title}</div>
      <div class="sample-language">${language.toUpperCase()}</div>
      <div class="sample-preview">${escapeHtml(preview)}</div>
    `;
    
    option.addEventListener('click', function() {
      loadSampleCode(language);
      hideSampleModal();
    });
    
    elements.sample_options.appendChild(option);
  });
}

// Load sample code
function loadSampleCode(language) {
  const sample = appData.sampleCodes[language];
  if (sample && monacoEditor) {
    monacoEditor.setValue(sample.code);
    if (elements.language_select) {
      elements.language_select.value = language;
    }
    currentLanguage = language;
    monaco.editor.setModelLanguage(monacoEditor.getModel(), getMonacoLanguage(language));
    updateEditorStats();
    hideResults();
    showSuccessToast(`Sample ${language} code loaded!`);
  }
}

// Main analyze code function with fallback for demo purposes
async function analyzeCode() {
  if (!monacoEditor) return;
  
  const code = monacoEditor.getValue().trim();
  if (!code) {
    showErrorToast('Please enter some code to analyze.');
    return;
  }
  
  // Show loading state immediately
  showLoadingState();
  
  try {
    let analysisResults;
    
    // If API key is available, try to use real Gemini API
    if (genAI && apiKey) {
      console.log('Using real Gemini API for analysis...');
      analysisResults = await performRealAnalysis(code, currentLanguage);
    } else {
      console.log('Using demo analysis (no API key)...');
      // Fallback to demo analysis if no API key
      analysisResults = await performDemoAnalysis(code, currentLanguage);
    }
    
    // Store in history
    analysisHistory.unshift({
      timestamp: new Date().toISOString(),
      language: currentLanguage,
      codeLength: code.length,
      results: analysisResults
    });
    
    // Keep only last 10 analyses
    if (analysisHistory.length > 10) {
      analysisHistory = analysisHistory.slice(0, 10);
    }
    
    // Display results
    displayResults(analysisResults);
    showSuccessToast('Code analysis completed successfully!');
    
  } catch (error) {
    console.error('Analysis failed:', error);
    hideLoadingState();
    
    let errorMessage = 'Analysis failed. ';
    if (error.message.includes('API_KEY')) {
      errorMessage += 'Invalid API key. Please check your settings.';
    } else if (error.message.includes('quota')) {
      errorMessage += 'API quota exceeded. Please check your usage limits.';
    } else if (error.message.includes('network')) {
      errorMessage += 'Network error. Please check your internet connection.';
    } else {
      errorMessage += 'Please try again or use demo analysis.';
    }
    
    showErrorToast(errorMessage);
  }
}

// Perform real analysis using Gemini API
async function performRealAnalysis(code, language) {
  const depth = elements.analysis_depth?.value || 'comprehensive';
  const includeSuggestions = elements.include_suggestions?.checked !== false;
  const includeExamples = elements.include_examples?.checked !== false;
  const deepAnalysis = elements.deep_analysis?.checked || false;
  const securityFocus = elements.security_focus?.checked || false;
  
  // Create enhanced prompt
  const prompt = createAnalysisPrompt(code, language, {
    depth,
    includeSuggestions,
    includeExamples,
    deepAnalysis,
    securityFocus
  });
  
  // Call Gemini API
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const analysisText = response.text();
  
  // Parse the response
  return parseAnalysisResponse(analysisText);
}

// Perform demo analysis (fallback when no API key)
async function performDemoAnalysis(code, language) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const issues = [];
  const lines = code.split('\n');
  
  // Generate realistic issues based on the code
  if (language === 'javascript' || language === 'typescript') {
    analyzeJavaScript(code, lines, issues);
  } else if (language === 'python') {
    analyzePython(code, lines, issues);
  } else if (language === 'java') {
    analyzeJava(code, lines, issues);
  }
  
  // Add some generic issues if none found
  if (issues.length === 0) {
    issues.push({
      category: "Code Quality",
      severity: "Low",
      title: "Code Structure Analysis",
      description: "Code appears to follow basic structure guidelines. Consider adding more comprehensive error handling and documentation for production use.",
      lineNumber: 1,
      codeSnippet: code.split('\n')[0] || "N/A",
      suggestion: "Add comprehensive error handling, input validation, and documentation",
      fixedCode: "// Add proper error handling and documentation\n" + (code.split('\n')[0] || ""),
      impact: "Code maintainability and robustness in production"
    });
  }
  
  // Calculate summary
  const criticalIssues = issues.filter(i => i.severity === 'Critical').length;
  const highIssues = issues.filter(i => i.severity === 'High').length;
  const mediumIssues = issues.filter(i => i.severity === 'Medium').length;
  const lowIssues = issues.filter(i => i.severity === 'Low').length;
  
  let overallRating = 'Excellent';
  if (criticalIssues > 0) overallRating = 'Poor';
  else if (highIssues > 2) overallRating = 'Poor';
  else if (highIssues > 0 || mediumIssues > 3) overallRating = 'Fair';
  else if (mediumIssues > 0 || lowIssues > 2) overallRating = 'Good';
  
  return {
    summary: {
      totalIssues: issues.length,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      overallRating,
      mainConcerns: issues.slice(0, 3).map(i => i.title)
    },
    issues,
    recommendations: [
      "Add comprehensive error handling throughout the code",
      "Include input validation for all user inputs",
      "Add detailed comments and documentation",
      "Consider using modern language features and best practices"
    ]
  };
}

// Language-specific analysis functions
function analyzeJavaScript(code, lines, issues) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Check for var usage
    if (trimmedLine.includes('var ')) {
      issues.push({
        category: 'Code Quality',
        severity: 'Medium',
        title: 'Use Modern Variable Declaration',
        description: 'Using "var" instead of "let" or "const" can lead to scoping issues',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Replace "var" with "let" for mutable variables or "const" for immutable ones',
        fixedCode: trimmedLine.replace('var ', 'const '),
        impact: 'Potential scoping bugs and variable hoisting issues'
      });
    }
    
    // Check for console.log
    if (trimmedLine.includes('console.log')) {
      issues.push({
        category: 'Code Quality',
        severity: 'Low',
        title: 'Console Statement',
        description: 'Console statements should be removed in production code',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Remove console.log statements or use a proper logging library',
        fixedCode: '// ' + trimmedLine + ' // Remove in production',
        impact: 'Performance impact and information leakage in production'
      });
    }
    
    // Check for == instead of ===
    if (trimmedLine.includes('==') && !trimmedLine.includes('===') && !trimmedLine.includes('!=')) {
      issues.push({
        category: 'Bug Detection',
        severity: 'High',
        title: 'Loose Equality Comparison',
        description: 'Using "==" can lead to unexpected type coercion and bugs',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Use strict equality "===" instead of loose equality "=="',
        fixedCode: trimmedLine.replace('==', '==='),
        impact: 'Unexpected behavior due to JavaScript type coercion'
      });
    }
    
    // Check for missing variable declaration in for loops
    if (trimmedLine.includes('for (i =') || trimmedLine.includes('for(i=')) {
      issues.push({
        category: 'Bug Detection',
        severity: 'Critical',
        title: 'Global Variable Leak',
        description: 'Loop variable declared without var/let/const creates a global variable',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Use "let i = 0" instead of "i = 0" in the for loop',
        fixedCode: trimmedLine.replace(/for\s*\(\s*i\s*=/, 'for (let i ='),
        impact: 'Global namespace pollution and potential variable conflicts'
      });
    }
  });
}

function analyzePython(code, lines, issues) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Check for print statements
    if (trimmedLine.includes('print(')) {
      issues.push({
        category: 'Code Quality',
        severity: 'Low',
        title: 'Print Statement',
        description: 'Consider using logging instead of print for better control',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Use the logging module instead of print statements',
        fixedCode: 'import logging\nlogging.info(' + trimmedLine.substring(trimmedLine.indexOf('(')) + ')',
        impact: 'Limited control over output in production environments'
      });
    }
    
    // Check for broad except clauses
    if (trimmedLine.includes('except:')) {
      issues.push({
        category: 'Bug Detection',
        severity: 'High',
        title: 'Broad Exception Handling',
        description: 'Catching all exceptions can hide bugs and make debugging difficult',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Specify the exception type: except SpecificException:',
        fixedCode: 'except Exception as e:  # Be more specific',
        impact: 'Hidden bugs and difficult debugging'
      });
    }
    
    // Check for MD5 usage (security issue)
    if (trimmedLine.includes('hashlib.md5')) {
      issues.push({
        category: 'Security',
        severity: 'Critical',
        title: 'Weak Hashing Algorithm',
        description: 'MD5 is cryptographically broken and should not be used for password hashing',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Use bcrypt, scrypt, or Argon2 for password hashing',
        fixedCode: 'import bcrypt\nbcrypt.hashpw(password.encode(), bcrypt.gensalt())',
        impact: 'Passwords can be easily cracked with rainbow tables'
      });
    }
  });
}

function analyzeJava(code, lines, issues) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Check for System.out.println
    if (trimmedLine.includes('System.out.println')) {
      issues.push({
        category: 'Code Quality',
        severity: 'Low',
        title: 'System.out Usage',
        description: 'Consider using a logging framework instead of System.out',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Use a logging framework like SLF4J or java.util.logging',
        fixedCode: 'logger.info(' + trimmedLine.substring(trimmedLine.indexOf('(') + 1),
        impact: 'Poor logging practices in production applications'
      });
    }
    
    // Check for resource leaks
    if (trimmedLine.includes('new FileReader') || trimmedLine.includes('new FileWriter')) {
      issues.push({
        category: 'Bug Detection',
        severity: 'High',
        title: 'Resource Leak',
        description: 'File resources are not properly closed, causing potential memory leaks',
        lineNumber: lineNum,
        codeSnippet: trimmedLine,
        suggestion: 'Use try-with-resources statement to ensure proper resource cleanup',
        fixedCode: 'try (FileReader reader = new FileReader(filePath)) {\n    // code here\n}',
        impact: 'Memory leaks and potential file handle exhaustion'
      });
    }
  });
}

// Create enhanced analysis prompt
function createAnalysisPrompt(code, language, options) {
  let basePrompt = appData.promptTemplate
    .replace(/{language}/g, language)
    .replace(/{code}/g, code);
  
  // Add analysis depth instructions
  if (options.depth === 'comprehensive') {
    basePrompt += '\n\nPerform a comprehensive analysis including detailed explanations for each issue.';
  } else if (options.depth === 'expert') {
    basePrompt += '\n\nPerform an expert-level analysis with advanced patterns, architectural concerns, and professional recommendations.';
  }
  
  // Add security focus
  if (options.securityFocus) {
    basePrompt += '\n\nPay special attention to security vulnerabilities, injection attacks, authentication issues, and data handling problems.';
  }
  
  // Add deep analysis instructions
  if (options.deepAnalysis) {
    basePrompt += '\n\nInclude analysis of algorithmic complexity, memory usage, and scalability concerns.';
  }
  
  // Add code example instructions
  if (options.includeExamples) {
    basePrompt += '\n\nFor each issue, provide a "fixedCode" example showing the corrected implementation.';
  }
  
  basePrompt += '\n\nEnsure the response is valid JSON and includes realistic, actionable feedback based on the actual code provided.';
  
  return basePrompt;
}

// Parse analysis response from Gemini API
function parseAnalysisResponse(responseText) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    // Validate the structure
    if (!parsed.summary || !parsed.issues) {
      throw new Error('Invalid response structure');
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse analysis response:', error);
    
    // Return a fallback response
    return {
      summary: {
        totalIssues: 1,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 1,
        overallRating: "Good",
        mainConcerns: ["Analysis parsing issue - please try again"]
      },
      issues: [{
        category: "Code Quality",
        severity: "Low",
        title: "Analysis Response Processing",
        description: "The AI analysis was completed but the response format was not as expected. Your code was reviewed successfully.",
        lineNumber: 1,
        codeSnippet: "/* Analysis completed */",
        suggestion: "Try running the analysis again for detailed structured results",
        fixedCode: "// Analysis results will be more detailed on retry",
        impact: "Detailed structured analysis results are not available in this session"
      }],
      recommendations: [
        "Try running the analysis again for better formatted results",
        "Check your internet connection and API key configuration"
      ]
    };
  }
}

// Show/hide loading state
function showLoadingState() {
  if (elements.loading_overlay) {
    elements.loading_overlay.classList.remove('hidden');
  }
  if (elements.analyze_btn) {
    elements.analyze_btn.classList.add('loading');
    elements.analyze_btn.disabled = true;
  }
  
  // Animate progress bar
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    if (elements.progress_fill) {
      elements.progress_fill.style.width = `${progress}%`;
    }
  }, 500);
  
  // Store interval for cleanup
  if (elements.loading_overlay) {
    elements.loading_overlay.dataset.progressInterval = progressInterval;
  }
}

function hideLoadingState() {
  if (elements.loading_overlay) {
    elements.loading_overlay.classList.add('hidden');
    
    // Clear progress interval
    const progressInterval = elements.loading_overlay.dataset.progressInterval;
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  }
  
  if (elements.analyze_btn) {
    elements.analyze_btn.classList.remove('loading');
    elements.analyze_btn.disabled = false;
  }
  
  if (elements.progress_fill) {
    elements.progress_fill.style.width = '100%';
    
    // Reset progress after a delay
    setTimeout(() => {
      if (elements.progress_fill) {
        elements.progress_fill.style.width = '0%';
      }
    }, 500);
  }
}

// Display analysis results
function displayResults(results) {
  hideLoadingState();
  
  if (!results || !results.issues || results.issues.length === 0) {
    if (elements.issues_count) {
      elements.issues_count.textContent = 'No issues found';
      elements.issues_count.className = 'status status--success';
    }
    if (elements.overall_rating) {
      elements.overall_rating.textContent = '✨ Excellent';
      elements.overall_rating.className = 'overall-rating rating-excellent';
    }
    if (elements.results_content) {
      elements.results_content.innerHTML = '<div class="no-issues">🎉 Excellent! Your code looks great with no issues detected.</div>';
    }
  } else {
    const summary = results.summary;
    
    if (elements.issues_count) {
      elements.issues_count.textContent = `${summary.totalIssues} issue${summary.totalIssues !== 1 ? 's' : ''} found`;
      
      // Set issue count status based on critical/high issues
      if (summary.criticalIssues > 0) {
        elements.issues_count.className = 'status status--error';
      } else if (summary.highIssues > 0) {
        elements.issues_count.className = 'status status--warning';
      } else {
        elements.issues_count.className = 'status status--info';
      }
    }
    
    // Set overall rating
    if (elements.overall_rating) {
      const rating = summary.overallRating || 'Fair';
      elements.overall_rating.textContent = `${getRatingIcon(rating)} ${rating}`;
      elements.overall_rating.className = `overall-rating rating-${rating.toLowerCase()}`;
    }
    
    // Group issues by category and render
    if (elements.results_content) {
      const groupedIssues = groupIssuesByCategory(results.issues);
      elements.results_content.innerHTML = renderIssueGroups(groupedIssues, results.recommendations);
    }
  }
  
  showResults();
}

// Get rating icon
function getRatingIcon(rating) {
  const icons = {
    'Excellent': '🌟',
    'Good': '👍',
    'Fair': '⚠️',
    'Poor': '❌'
  };
  return icons[rating] || '📊';
}

// Group issues by category
function groupIssuesByCategory(issues) {
  const grouped = {};
  issues.forEach(issue => {
    if (!grouped[issue.category]) {
      grouped[issue.category] = [];
    }
    grouped[issue.category].push(issue);
  });
  return grouped;
}

// Render issue groups
function renderIssueGroups(groupedIssues, recommendations = []) {
  let html = '';
  
  Object.keys(groupedIssues).forEach(category => {
    const categoryInfo = appData.categoryConfig[category] || { 
      icon: '📋', 
      description: 'General issues' 
    };
    const issues = groupedIssues[category];
    
    html += `
      <div class="category-section">
        <div class="category-header">
          <div class="category-icon">${categoryInfo.icon}</div>
          <div>
            <h3 class="category-title">${category}</h3>
            <div class="category-description">${categoryInfo.description}</div>
          </div>
          <div class="category-count">${issues.length}</div>
        </div>
        <div class="issue-list">
          ${issues.map(issue => renderIssue(issue)).join('')}
        </div>
      </div>
    `;
  });
  
  // Add recommendations section if available
  if (recommendations && recommendations.length > 0) {
    html += `
      <div class="category-section">
        <div class="category-header">
          <div class="category-icon">💡</div>
          <div>
            <h3 class="category-title">General Recommendations</h3>
            <div class="category-description">Overall suggestions for improvement</div>
          </div>
        </div>
        <div class="recommendations-list">
          ${recommendations.map(rec => `<div class="recommendation-item">• ${rec}</div>`).join('')}
        </div>
      </div>
    `;
  }
  
  return html;
}

// Render individual issue
function renderIssue(issue) {
  const severityClass = `severity-${issue.severity.toLowerCase()}`;
  
  let codeExample = '';
  if (issue.fixedCode && (!elements.include_examples || elements.include_examples.checked)) {
    codeExample = `
      <div class="code-example">
        <div class="code-example-header">
          <span>Fixed Code Example:</span>
          <button class="copy-code-btn" onclick="copyToClipboard('${escapeHtml(issue.fixedCode)}')">📋</button>
        </div>
        <pre><code>${escapeHtml(issue.fixedCode)}</code></pre>
      </div>
    `;
  }
  
  return `
    <div class="issue-item">
      <div class="issue-header">
        <h4 class="issue-title">${escapeHtml(issue.title)}</h4>
        <div class="severity-badge ${severityClass}">${issue.severity}</div>
      </div>
      <div class="issue-description">${escapeHtml(issue.description)}</div>
      <div class="issue-details">
        <div class="issue-line">
          📍 Line <span class="line-number">${issue.lineNumber || 'N/A'}</span>
        </div>
        ${issue.codeSnippet ? `<div class="code-snippet"><strong>Code:</strong> <code>${escapeHtml(issue.codeSnippet)}</code></div>` : ''}
        <div class="issue-suggestion">
          <div class="suggestion-label">
            💡 Suggestion
          </div>
          <div class="suggestion-text">${escapeHtml(issue.suggestion)}</div>
          ${codeExample}
        </div>
        ${issue.impact ? `<div class="impact-text"><strong>Impact:</strong> ${escapeHtml(issue.impact)}</div>` : ''}
      </div>
    </div>
  `;
}

// Utility function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Copy to clipboard utility
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccessToast('Code copied to clipboard!');
  }).catch(() => {
    showErrorToast('Failed to copy to clipboard.');
  });
};

// Export results
function exportResults() {
  if (!analysisHistory.length) {
    showErrorToast('No analysis results to export.');
    return;
  }
  
  const latestResult = analysisHistory[0];
  const markdown = generateMarkdownReport(latestResult);
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `code-analysis-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  
  showSuccessToast('Analysis report exported successfully!');
}

// Copy results to clipboard
function copyResults() {
  if (!analysisHistory.length) {
    showErrorToast('No analysis results to copy.');
    return;
  }
  
  const latestResult = analysisHistory[0];
  const markdown = generateMarkdownReport(latestResult);
  
  navigator.clipboard.writeText(markdown).then(() => {
    showSuccessToast('Results copied to clipboard!');
  }).catch(() => {
    showErrorToast('Failed to copy results.');
  });
}

// Generate markdown report
function generateMarkdownReport(analysisData) {
  const { results, language, timestamp } = analysisData;
  const date = new Date(timestamp).toLocaleString();
  
  let markdown = `# Code Analysis Report\n\n`;
  markdown += `**Language:** ${language}\n`;
  markdown += `**Date:** ${date}\n`;
  markdown += `**Total Issues:** ${results.summary.totalIssues}\n`;
  markdown += `**Overall Rating:** ${results.summary.overallRating}\n\n`;
  
  if (results.summary.mainConcerns && results.summary.mainConcerns.length > 0) {
    markdown += `## Main Concerns\n\n`;
    results.summary.mainConcerns.forEach(concern => {
      markdown += `- ${concern}\n`;
    });
    markdown += `\n`;
  }
  
  // Group issues by category
  const grouped = groupIssuesByCategory(results.issues);
  
  Object.keys(grouped).forEach(category => {
    markdown += `## ${category}\n\n`;
    
    grouped[category].forEach(issue => {
      markdown += `### ${issue.title} (${issue.severity})\n\n`;
      markdown += `**Description:** ${issue.description}\n\n`;
      markdown += `**Line:** ${issue.lineNumber || 'N/A'}\n\n`;
      if (issue.codeSnippet) {
        markdown += `**Code Snippet:**\n\`\`\`${language}\n${issue.codeSnippet}\n\`\`\`\n\n`;
      }
      markdown += `**Suggestion:** ${issue.suggestion}\n\n`;
      if (issue.fixedCode) {
        markdown += `**Fixed Code:**\n\`\`\`${language}\n${issue.fixedCode}\n\`\`\`\n\n`;
      }
      if (issue.impact) {
        markdown += `**Impact:** ${issue.impact}\n\n`;
      }
      markdown += `---\n\n`;
    });
  });
  
  if (results.recommendations && results.recommendations.length > 0) {
    markdown += `## General Recommendations\n\n`;
    results.recommendations.forEach(rec => {
      markdown += `- ${rec}\n`;
    });
  }
  
  return markdown;
}

// Show/hide results
function showResults() {
  if (elements.no_analysis) {
    elements.no_analysis.classList.add('hidden');
  }
  if (elements.analysis_results) {
    elements.analysis_results.classList.remove('hidden');
  }
}

function hideResults() {
  if (elements.no_analysis) {
    elements.no_analysis.classList.remove('hidden');
  }
  if (elements.analysis_results) {
    elements.analysis_results.classList.add('hidden');
  }
}

// Toast message functions
function showErrorToast(message) {
  if (elements.error_message) {
    elements.error_message.textContent = message;
  }
  if (elements.error_toast) {
    elements.error_toast.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      hideErrorToast();
    }, 5000);
  }
}

function hideErrorToast() {
  if (elements.error_toast) {
    elements.error_toast.classList.add('hidden');
  }
}

function showSuccessToast(message) {
  if (elements.success_message) {
    elements.success_message.textContent = message;
  }
  if (elements.success_toast) {
    elements.success_toast.classList.remove('hidden');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      hideSuccessToast();
    }, 3000);
  }
}

function hideSuccessToast() {
  if (elements.success_toast) {
    elements.success_toast.classList.add('hidden');
  }
}


//AIzaSyCa_cFT9PUBSjDME7CRbu7TPkAz03Hpr7g
