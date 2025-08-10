// Application data
const appData = {
  "sampleCodes": {
    "javascript": {
      "title": "JavaScript Function with Issues",
      "code": "function calculateTotal(items) {\n  var total = 0;\n  for (i = 0; i < items.length; i++) {\n    if (items[i].price) {\n      total += items[i].price;\n    }\n  }\n  if (total > 100) {\n    return total * 0.9;\n  } else {\n    return total;\n  }\n}",
      "issues": [
        {
          "category": "Bug Detection",
          "severity": "High",
          "title": "Global Variable Leak",
          "description": "Loop variable 'i' is declared without 'var', 'let', or 'const', creating a global variable",
          "line": 3,
          "suggestion": "Use 'let i = 0' instead of 'i = 0' in the for loop"
        },
        {
          "category": "Code Quality",
          "severity": "Medium",
          "title": "Use Modern Variable Declaration",
          "description": "Using 'var' instead of 'let' or 'const'",
          "line": 2,
          "suggestion": "Replace 'var total = 0' with 'let total = 0'"
        },
        {
          "category": "Best Practices",
          "severity": "Low",
          "title": "Magic Numbers",
          "description": "Hard-coded values should be constants",
          "line": 6,
          "suggestion": "Define discount threshold and rate as named constants"
        }
      ]
    },
    "python": {
      "title": "Python Class with Issues",
      "code": "class UserManager:\n    def __init__(self):\n        self.users = []\n    \n    def add_user(self, name, email):\n        user = {'name': name, 'email': email}\n        self.users.append(user)\n        print(f'User {name} added')\n        return user\n    \n    def find_user(self, email):\n        for user in self.users:\n            if user['email'] == email:\n                return user\n        return None\n    \n    def delete_all_users(self):\n        self.users = []",
      "issues": [
        {
          "category": "Security",
          "severity": "Medium",
          "title": "No Input Validation",
          "description": "Email parameter is not validated for proper format",
          "line": 5,
          "suggestion": "Add email format validation using regex or email validation library"
        },
        {
          "category": "Code Quality",
          "severity": "Medium",
          "title": "Side Effects in Method",
          "description": "add_user method has side effect (print statement)",
          "line": 8,
          "suggestion": "Consider using logging instead of print, or return status messages"
        },
        {
          "category": "Performance",
          "severity": "Low",
          "title": "Linear Search",
          "description": "find_user performs linear search which is O(n)",
          "line": 11,
          "suggestion": "Consider using a dictionary with email as key for O(1) lookup"
        }
      ]
    },
    "java": {
      "title": "Java Method with Issues",
      "code": "public class StringUtils {\n    public static String reverseString(String str) {\n        if (str == null) {\n            return null;\n        }\n        String result = \"\";\n        for (int i = str.length() - 1; i >= 0; i--) {\n            result += str.charAt(i);\n        }\n        return result;\n    }\n    \n    public static boolean isEmpty(String str) {\n        if (str == null || str.length() == 0) {\n            return true;\n        }\n        return false;\n    }\n}",
      "issues": [
        {
          "category": "Performance",
          "severity": "High",
          "title": "String Concatenation in Loop",
          "description": "Using '+=' for string concatenation in loop creates multiple String objects",
          "line": 8,
          "suggestion": "Use StringBuilder for efficient string building: StringBuilder sb = new StringBuilder()"
        },
        {
          "category": "Code Quality",
          "severity": "Medium",
          "title": "Redundant Condition",
          "description": "isEmpty method can be simplified",
          "line": 14,
          "suggestion": "Return the condition directly: return str == null || str.length() == 0;"
        },
        {
          "category": "Best Practices",
          "severity": "Low",
          "title": "Use Existing Utility",
          "description": "Consider using existing utility methods",
          "line": 13,
          "suggestion": "Consider using str == null || str.isEmpty() for better readability"
        }
      ]
    }
  },
  
  "severityColors": {
    "Critical": "#dc2626",
    "High": "#ea580c", 
    "Medium": "#d97706",
    "Low": "#65a30d"
  },
  
  "categories": {
    "Code Quality": {
      "icon": "🎯",
      "description": "Issues related to code structure, naming, and maintainability"
    },
    "Bug Detection": {
      "icon": "🐛", 
      "description": "Potential runtime errors and logical issues"
    },
    "Security": {
      "icon": "🔒",
      "description": "Security vulnerabilities and potential attack vectors"
    },
    "Performance": {
      "icon": "⚡",
      "description": "Performance optimizations and efficiency improvements"
    },
    "Best Practices": {
      "icon": "✨",
      "description": "Industry standards and recommended patterns"
    }
  },
  
  "languages": [
    "javascript",
    "python", 
    "java",
    "typescript",
    "cpp",
    "csharp",
    "go",
    "rust",
    "php",
    "ruby"
  ]
};

// Global variables
let monacoEditor = null;
let currentLanguage = 'javascript';

// DOM elements
const elements = {
  languageSelect: null,
  loadSampleBtn: null,
  analyzeBtn: null,
  analysisResults: null,
  noAnalysis: null,
  resultsContent: null,
  issuesCount: null,
  sampleModal: null,
  sampleOptions: null,
  closeModal: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  initializeMonacoEditor();
  attachEventListeners();
  populateSampleOptions();
});

// Initialize DOM element references
function initializeElements() {
  elements.languageSelect = document.getElementById('language-select');
  elements.loadSampleBtn = document.getElementById('load-sample-btn');
  elements.analyzeBtn = document.getElementById('analyze-btn');
  elements.analysisResults = document.getElementById('analysis-results');
  elements.noAnalysis = document.getElementById('no-analysis');
  elements.resultsContent = document.getElementById('results-content');
  elements.issuesCount = document.getElementById('issues-count');
  elements.sampleModal = document.getElementById('sample-modal');
  elements.sampleOptions = document.getElementById('sample-options');
  elements.closeModal = document.getElementById('close-modal');
}

// Initialize Monaco Editor
function initializeMonacoEditor() {
  require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function () {
    monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
      value: '// Paste your code here or load a sample\n// Select your programming language from the dropdown above\n\nfunction example() {\n    console.log("Hello, AI Code Reviewer!");\n}',
      language: currentLanguage,
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      minimap: { enabled: true },
      wordWrap: 'on'
    });

    // Listen for content changes
    monacoEditor.onDidChangeModelContent(() => {
      // Clear results when code changes
      hideResults();
    });
  });
}

// Attach event listeners
function attachEventListeners() {
  // Language selection
  elements.languageSelect.addEventListener('change', function(e) {
    currentLanguage = e.target.value;
    if (monacoEditor) {
      monaco.editor.setModelLanguage(monacoEditor.getModel(), getMonacoLanguage(currentLanguage));
    }
  });

  // Load sample code button
  elements.loadSampleBtn.addEventListener('click', function() {
    showSampleModal();
  });

  // Analyze button
  elements.analyzeBtn.addEventListener('click', function() {
    analyzeCode();
  });

  // Modal close
  elements.closeModal.addEventListener('click', function() {
    hideSampleModal();
  });

  // Modal overlay click
  elements.sampleModal.querySelector('.modal-overlay').addEventListener('click', function() {
    hideSampleModal();
  });

  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !elements.sampleModal.classList.contains('hidden')) {
      hideSampleModal();
    }
  });
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
    'ruby': 'ruby'
  };
  return languageMap[language] || 'plaintext';
}

// Populate sample code options
function populateSampleOptions() {
  elements.sampleOptions.innerHTML = '';
  
  Object.keys(appData.sampleCodes).forEach(language => {
    const sample = appData.sampleCodes[language];
    const option = document.createElement('div');
    option.className = 'sample-option';
    option.dataset.language = language;
    
    const preview = sample.code.substring(0, 100) + (sample.code.length > 100 ? '...' : '');
    
    option.innerHTML = `
      <div class="sample-title">${sample.title}</div>
      <div class="sample-language">${language.toUpperCase()}</div>
      <div class="sample-preview">${preview}</div>
    `;
    
    option.addEventListener('click', function() {
      loadSampleCode(language);
      hideSampleModal();
    });
    
    elements.sampleOptions.appendChild(option);
  });
}

// Load sample code
function loadSampleCode(language) {
  const sample = appData.sampleCodes[language];
  if (sample && monacoEditor) {
    monacoEditor.setValue(sample.code);
    elements.languageSelect.value = language;
    currentLanguage = language;
    monaco.editor.setModelLanguage(monacoEditor.getModel(), getMonacoLanguage(language));
    hideResults();
  }
}

// Show sample modal
function showSampleModal() {
  elements.sampleModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Hide sample modal
function hideSampleModal() {
  elements.sampleModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Analyze code
async function analyzeCode() {
  if (!monacoEditor) return;
  
  const code = monacoEditor.getValue().trim();
  if (!code || code === '// Paste your code here or load a sample\n// Select your programming language from the dropdown above\n\nfunction example() {\n    console.log("Hello, AI Code Reviewer!");\n}') {
    alert('Please enter some code to analyze or load a sample.');
    return;
  }

  // Show loading state
  showLoadingState();
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Analyze the code
  const results = performAnalysis(code, currentLanguage);
  
  // Hide loading state and show results
  hideLoadingState();
  displayResults(results);
}

// Show loading state
function showLoadingState() {
  elements.analyzeBtn.classList.add('loading');
  elements.analyzeBtn.disabled = true;
  elements.analyzeBtn.querySelector('.loading-spinner').classList.remove('hidden');
}

// Hide loading state
function hideLoadingState() {
  elements.analyzeBtn.classList.remove('loading');
  elements.analyzeBtn.disabled = false;
  elements.analyzeBtn.querySelector('.loading-spinner').classList.add('hidden');
}

// Perform code analysis (simulated)
function performAnalysis(code, language) {
  // Check if we have sample data for this language
  if (appData.sampleCodes[language]) {
    const sample = appData.sampleCodes[language];
    // If the code matches our sample, return the predefined issues
    if (code.trim() === sample.code.trim()) {
      return sample.issues;
    }
  }
  
  // Generate generic analysis for other code
  return generateGenericAnalysis(code, language);
}

// Generate generic analysis based on common patterns
function generateGenericAnalysis(code, language) {
  const issues = [];
  const lines = code.split('\n');
  
  // Language-specific analysis
  switch (language) {
    case 'javascript':
    case 'typescript':
      analyzeJavaScript(code, lines, issues);
      break;
    case 'python':
      analyzePython(code, lines, issues);
      break;
    case 'java':
      analyzeJava(code, lines, issues);
      break;
    default:
      analyzeGeneric(code, lines, issues);
  }
  
  return issues;
}

// JavaScript-specific analysis
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
        description: 'Consider using "let" or "const" instead of "var" for better scoping',
        line: lineNum,
        suggestion: 'Replace "var" with "let" for mutable variables or "const" for immutable ones'
      });
    }
    
    // Check for console.log
    if (trimmedLine.includes('console.log')) {
      issues.push({
        category: 'Best Practices',
        severity: 'Low',
        title: 'Console Statement',
        description: 'Console statements should be removed in production code',
        line: lineNum,
        suggestion: 'Remove console.log statements or use a proper logging library'
      });
    }
    
    // Check for == instead of ===
    if (trimmedLine.includes('==') && !trimmedLine.includes('===')) {
      issues.push({
        category: 'Bug Detection',
        severity: 'Medium',
        title: 'Loose Equality Comparison',
        description: 'Using "==" can lead to unexpected type coercion',
        line: lineNum,
        suggestion: 'Use strict equality "===" instead of loose equality "=="'
      });
    }
  });
  
  // Check for missing semicolons
  const missingSemicolons = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 && 
           !trimmed.endsWith(';') && 
           !trimmed.endsWith('{') && 
           !trimmed.endsWith('}') && 
           !trimmed.startsWith('//') &&
           !trimmed.startsWith('*') &&
           !trimmed.includes('if ') &&
           !trimmed.includes('for ') &&
           !trimmed.includes('while ');
  });
  
  if (missingSemicolons.length > 0) {
    issues.push({
      category: 'Code Quality',
      severity: 'Low',
      title: 'Missing Semicolons',
      description: 'Some statements are missing semicolons',
      line: 1,
      suggestion: 'Add semicolons at the end of statements for consistency'
    });
  }
}

// Python-specific analysis
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
        line: lineNum,
        suggestion: 'Use the logging module instead of print statements'
      });
    }
    
    // Check for broad except clauses
    if (trimmedLine.includes('except:')) {
      issues.push({
        category: 'Best Practices',
        severity: 'Medium',
        title: 'Broad Exception Handling',
        description: 'Catching all exceptions can hide bugs',
        line: lineNum,
        suggestion: 'Specify the exception type: except SpecificException:'
      });
    }
  });
}

// Java-specific analysis
function analyzeJava(code, lines, issues) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Check for System.out.println
    if (trimmedLine.includes('System.out.println')) {
      issues.push({
        category: 'Best Practices',
        severity: 'Low',
        title: 'System.out Usage',
        description: 'Consider using a logging framework instead of System.out',
        line: lineNum,
        suggestion: 'Use a logging framework like SLF4J or java.util.logging'
      });
    }
  });
}

// Generic analysis for other languages
function analyzeGeneric(code, lines, issues) {
  // Check for long lines
  lines.forEach((line, index) => {
    if (line.length > 120) {
      issues.push({
        category: 'Code Quality',
        severity: 'Low',
        title: 'Long Line',
        description: 'Line exceeds recommended length of 120 characters',
        line: index + 1,
        suggestion: 'Break long lines into multiple lines for better readability'
      });
    }
  });
  
  // Check for TODO comments
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('todo')) {
      issues.push({
        category: 'Code Quality',
        severity: 'Low',
        title: 'TODO Comment',
        description: 'TODO comment found - consider addressing or creating a task',
        line: index + 1,
        suggestion: 'Address the TODO item or create a proper task/issue'
      });
    }
  });
  
  // If no specific issues found, add a generic positive message
  if (issues.length === 0) {
    issues.push({
      category: 'Code Quality',
      severity: 'Low',
      title: 'Code Structure',
      description: 'Code appears to follow basic structure guidelines',
      line: 1,
      suggestion: 'Consider adding more comprehensive error handling and documentation'
    });
  }
}

// Display analysis results
function displayResults(issues) {
  if (!issues || issues.length === 0) {
    elements.issuesCount.textContent = 'No issues found';
    elements.issuesCount.className = 'status status--success';
    elements.resultsContent.innerHTML = '<div class="no-issues">✅ Great! No issues were detected in your code.</div>';
  } else {
    elements.issuesCount.textContent = `${issues.length} issue${issues.length !== 1 ? 's' : ''} found`;
    elements.issuesCount.className = 'status status--warning';
    
    // Group issues by category
    const groupedIssues = groupIssuesByCategory(issues);
    elements.resultsContent.innerHTML = renderIssueGroups(groupedIssues);
  }
  
  showResults();
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
function renderIssueGroups(groupedIssues) {
  let html = '';
  
  Object.keys(groupedIssues).forEach(category => {
    const categoryInfo = appData.categories[category] || { icon: '📋', description: 'General issues' };
    const issues = groupedIssues[category];
    
    html += `
      <div class="category-section">
        <div class="category-header">
          <div class="category-icon">${categoryInfo.icon}</div>
          <div>
            <h3 class="category-title">${category}</h3>
            <div class="category-description">${categoryInfo.description}</div>
          </div>
        </div>
        <div class="issue-list">
          ${issues.map(issue => renderIssue(issue)).join('')}
        </div>
      </div>
    `;
  });
  
  return html;
}

// Render individual issue
function renderIssue(issue) {
  const severityClass = `severity-${issue.severity.toLowerCase()}`;
  
  return `
    <div class="issue-item">
      <div class="issue-header">
        <h4 class="issue-title">${issue.title}</h4>
        <div class="severity-badge ${severityClass}">${issue.severity}</div>
      </div>
      <div class="issue-description">${issue.description}</div>
      <div class="issue-details">
        <div class="issue-line">
          📍 Line <span class="line-number">${issue.line}</span>
        </div>
        <div class="issue-suggestion">
          <div class="suggestion-label">
            💡 Suggestion
          </div>
          <div class="suggestion-text">${issue.suggestion}</div>
        </div>
      </div>
    </div>
  `;
}

// Show results
function showResults() {
  elements.noAnalysis.classList.add('hidden');
  elements.analysisResults.classList.remove('hidden');
}

// Hide results
function hideResults() {
  elements.noAnalysis.classList.remove('hidden');
  elements.analysisResults.classList.add('hidden');
}