// TODO: Replace 'YOUR_API_KEY_HERE' with your actual Spoonacular API key
const API_KEY = 'c38766cf56e249e2b9bc769909eed0f3';
const API_BASE_URL = 'https://api.spoonacular.com';

// Application data from provided JSON
const APP_DATA = [
  {
    "commonIngredients": [
      "chicken", "beef", "pork", "salmon", "eggs", "milk", "cheese", "tomatoes", 
      "onions", "garlic", "carrots", "potatoes", "rice", "pasta", "bread", 
      "flour", "sugar", "salt", "pepper", "olive oil", "butter", "lemon", 
      "spinach", "mushrooms", "bell peppers", "broccoli", "beans", "quinoa", 
      "avocado", "bananas", "apples", "berries", "yogurt", "herbs", "spices"
    ],
    "mealTypes": [
      {"value": "", "label": "Any Meal Type"},
      {"value": "breakfast", "label": "Breakfast"},
      {"value": "lunch", "label": "Lunch"}, 
      {"value": "dinner", "label": "Dinner"},
      {"value": "snack", "label": "Snack"},
      {"value": "appetizer", "label": "Appetizer"},
      {"value": "dessert", "label": "Dessert"}
    ],
    "dietaryFilters": [
      {"value": "", "label": "Any Diet"},
      {"value": "vegetarian", "label": "Vegetarian"},
      {"value": "vegan", "label": "Vegan"},
      {"value": "gluten free", "label": "Gluten-Free"},
      {"value": "ketogenic", "label": "Keto"},
      {"value": "paleo", "label": "Paleo"},
      {"value": "mediterranean", "label": "Mediterranean"},
      {"value": "dairy free", "label": "Dairy-Free"},
      {"value": "whole30", "label": "Whole30"}
    ]
  }
];

// App state
let selectedIngredients = [];
let currentRecipes = [];
let currentFilters = {
  mealType: '',
  dietary: '',
  cuisine: '',
  maxReadyTime: ''
};

// DOM element references
let ingredientInput, addIngredientBtn, selectedIngredientsContainer, ingredientSuggestions;
let mealTypeSelect, dietarySelect, cuisineSelect, maxReadyTimeSelect;
let searchBtn, clearFiltersBtn, toggleFiltersBtn, advancedFiltersPanel;
let loadingState, errorState, resultsGrid, apiNotice;
let recipeModal, closeModal;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - initializing app');
  
  // Add small delay to ensure DOM is fully ready
  setTimeout(() => {
    initializeDOMReferences();
    initializeApp();
    setupEventListeners();
    checkApiKey();
    console.log('App initialization complete');
  }, 100);
});

function initializeDOMReferences() {
  console.log('Initializing DOM references...');
  
  // Get all DOM element references
  ingredientInput = document.getElementById('ingredientInput');
  addIngredientBtn = document.getElementById('addIngredientBtn');
  selectedIngredientsContainer = document.getElementById('selectedIngredients');
  ingredientSuggestions = document.getElementById('ingredientSuggestions');
  mealTypeSelect = document.getElementById('mealType');
  dietarySelect = document.getElementById('dietary');
  cuisineSelect = document.getElementById('cuisine');
  maxReadyTimeSelect = document.getElementById('maxReadyTime');
  searchBtn = document.getElementById('searchBtn');
  clearFiltersBtn = document.getElementById('clearFilters');
  toggleFiltersBtn = document.getElementById('toggleFilters');
  advancedFiltersPanel = document.getElementById('advancedFiltersPanel');
  loadingState = document.getElementById('loadingState');
  errorState = document.getElementById('errorState');
  resultsGrid = document.getElementById('resultsGrid');
  apiNotice = document.getElementById('apiNotice');
  recipeModal = document.getElementById('recipeModal');
  closeModal = document.getElementById('closeModal');

  // Log which elements were found
  console.log('DOM references status:', {
    ingredientInput: !!ingredientInput,
    addIngredientBtn: !!addIngredientBtn,
    selectedIngredientsContainer: !!selectedIngredientsContainer,
    searchBtn: !!searchBtn,
    mealTypeSelect: !!mealTypeSelect,
    dietarySelect: !!dietarySelect,
    recipeModal: !!recipeModal
  });
  
  // Check for missing critical elements
  if (!ingredientInput) console.error('ingredientInput not found!');
  if (!addIngredientBtn) console.error('addIngredientBtn not found!');
  if (!searchBtn) console.error('searchBtn not found!');
}

function initializeApp() {
  selectedIngredients = [];
  currentRecipes = [];
  console.log('App state initialized');
}

function checkApiKey() {
  if (API_KEY != 'c38766cf56e249e2b9bc769909eed0f3') {
    console.log('API key not configured - showing notice');
    if (apiNotice) {
      apiNotice.style.display = 'block';
    }
  } else {
    console.log('API key configured - hiding notice');
    if (apiNotice) {
      apiNotice.style.display = 'none';
    }
  }
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  try {
    // Ingredient input functionality
    if (ingredientInput) {
      console.log('Setting up ingredient input listeners');
      ingredientInput.addEventListener('input', handleIngredientInput);
      ingredientInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addIngredient();
        }
      });
      console.log('Ingredient input listeners attached');
    } else {
      console.error('Cannot attach ingredient input listeners - element not found');
    }

    if (addIngredientBtn) {
      console.log('Setting up add ingredient button listener');
      addIngredientBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Add ingredient button clicked');
        addIngredient();
      });
      console.log('Add ingredient button listener attached');
    } else {
      console.error('Cannot attach add ingredient button listener - element not found');
    }
    
    // Search functionality  
    if (searchBtn) {
      console.log('Setting up search button listener');
      searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Search button clicked');
        handleSearch();
      });
      console.log('Search button listener attached');
    } else {
      console.error('Cannot attach search button listener - element not found');
    }

    // Filter changes
    if (mealTypeSelect) {
      mealTypeSelect.addEventListener('change', handleFilterChange);
      console.log('Meal type select listener attached');
    }
    if (dietarySelect) {
      dietarySelect.addEventListener('change', handleFilterChange);
      console.log('Dietary select listener attached');
    }
    if (cuisineSelect) {
      cuisineSelect.addEventListener('change', handleFilterChange);
      console.log('Cuisine select listener attached');
    }
    if (maxReadyTimeSelect) {
      maxReadyTimeSelect.addEventListener('change', handleFilterChange);
      console.log('Max ready time select listener attached');
    }

    // Advanced filters toggle
    if (toggleFiltersBtn) {
      console.log('Setting up advanced filters toggle listener');
      toggleFiltersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Toggle filters button clicked');
        toggleAdvancedFilters();
      });
      console.log('Advanced filters toggle listener attached');
    }

    // Clear filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Clear filters button clicked');
        clearAllFilters();
      });
      console.log('Clear filters listener attached');
    }

    // Modal functionality
    if (closeModal) {
      closeModal.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Close modal button clicked');
        closeRecipeModal();
      });
      console.log('Close modal listener attached');
    }
    
    if (recipeModal) {
      recipeModal.addEventListener('click', function(e) {
        if (e.target === recipeModal || e.target.classList.contains('modal-backdrop')) {
          console.log('Modal backdrop clicked');
          closeRecipeModal();
        }
      });
      console.log('Modal backdrop listener attached');
    }

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && recipeModal && !recipeModal.classList.contains('hidden')) {
        console.log('Escape key pressed - closing modal');
        closeRecipeModal();
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
      if (ingredientInput && ingredientSuggestions && 
          !ingredientInput.contains(e.target) && 
          !ingredientSuggestions.contains(e.target)) {
        hideSuggestions();
      }
    });

    console.log('Event listeners setup complete');
    
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

// Enhanced ingredient input with suggestions
function handleIngredientInput() {
  console.log('Handling ingredient input');
  
  if (!ingredientInput) {
    console.error('Ingredient input not found');
    return;
  }
  
  const query = ingredientInput.value.trim().toLowerCase();
  console.log('Input query:', query);
  
  if (query.length < 2) {
    hideSuggestions();
    return;
  }

  const suggestions = APP_DATA[0].commonIngredients
    .filter(ingredient => 
      ingredient.toLowerCase().includes(query) && 
      !selectedIngredients.includes(ingredient)
    )
    .slice(0, 8);

  console.log('Generated suggestions:', suggestions);

  if (suggestions.length > 0) {
    showSuggestions(suggestions);
  } else {
    hideSuggestions();
  }
}

function showSuggestions(suggestions) {
  console.log('Showing suggestions:', suggestions);
  
  if (!ingredientSuggestions) {
    console.error('Ingredient suggestions container not found');
    return;
  }

  ingredientSuggestions.innerHTML = '';
  suggestions.forEach(suggestion => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.textContent = suggestion;
    suggestionItem.addEventListener('click', () => {
      console.log('Suggestion clicked:', suggestion);
      selectSuggestion(suggestion);
    });
    ingredientSuggestions.appendChild(suggestionItem);
  });

  ingredientSuggestions.classList.remove('hidden');
  console.log('Suggestions displayed');
}

function hideSuggestions() {
  if (ingredientSuggestions) {
    ingredientSuggestions.classList.add('hidden');
  }
}

function selectSuggestion(ingredient) {
  console.log('Selecting suggestion:', ingredient);
  
  if (ingredientInput) {
    ingredientInput.value = ingredient;
  }
  hideSuggestions();
  addIngredient();
}

function addIngredient() {
  console.log('addIngredient() called');
  
  if (!ingredientInput) {
    console.error('Ingredient input not found');
    return;
  }
  
  const ingredient = ingredientInput.value.trim().toLowerCase();
  console.log('Adding ingredient:', ingredient);
  
  if (!ingredient) {
    console.log('Empty ingredient input');
    showMessage('Please enter an ingredient', 'warning');
    return;
  }
  
  if (selectedIngredients.includes(ingredient)) {
    console.log('Ingredient already selected:', ingredient);
    showMessage('Ingredient already added!', 'warning');
    ingredientInput.value = '';
    return;
  }
  
  selectedIngredients.push(ingredient);
  ingredientInput.value = '';
  hideSuggestions();
  
  console.log('Added ingredient:', ingredient);
  console.log('Selected ingredients:', selectedIngredients);
  
  renderSelectedIngredients();
  showMessage(`Added "${ingredient}"`, 'success');
}

function removeIngredient(ingredient) {
  console.log('Removing ingredient:', ingredient);
  
  const index = selectedIngredients.indexOf(ingredient);
  if (index > -1) {
    selectedIngredients.splice(index, 1);
    console.log('Removed ingredient:', ingredient);
    console.log('Selected ingredients:', selectedIngredients);
    
    renderSelectedIngredients();
    showMessage(`Removed "${ingredient}"`, 'info');
  }
}

function renderSelectedIngredients() {
  console.log('Rendering selected ingredients:', selectedIngredients);
  
  if (!selectedIngredientsContainer) {
    console.error('Selected ingredients container not found');
    return;
  }
  
  selectedIngredientsContainer.innerHTML = '';
  
  selectedIngredients.forEach(ingredient => {
    const tag = document.createElement('div');
    tag.className = 'ingredient-tag';
    
    const ingredientName = document.createElement('span');
    ingredientName.textContent = ingredient;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove ${ingredient}`);
    removeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Remove button clicked for:', ingredient);
      removeIngredient(ingredient);
    });
    
    tag.appendChild(ingredientName);
    tag.appendChild(removeBtn);
    selectedIngredientsContainer.appendChild(tag);
  });
  
  console.log('Selected ingredients rendered');
}

function showMessage(message, type = 'info') {
  console.log(`${type.toUpperCase()}: ${message}`);
  // You could enhance this with actual toast notifications
}

function handleSearch() {
  console.log('handleSearch() called');
  
  if (selectedIngredients.length === 0) {
    console.log('No ingredients selected');
    showMessage('Please add at least one ingredient', 'warning');
    return;
  }
  
  // Update current filters
  currentFilters = {
    mealType: mealTypeSelect ? mealTypeSelect.value : '',
    dietary: dietarySelect ? dietarySelect.value : '',
    cuisine: cuisineSelect ? cuisineSelect.value : '',
    maxReadyTime: maxReadyTimeSelect ? maxReadyTimeSelect.value : ''
  };
  
  console.log('Search with ingredients:', selectedIngredients);
  console.log('Current filters:', currentFilters);

  // Show loading state
  showLoadingState();

  // Perform search with delay for UX
  setTimeout(async () => {
    try {
      await performSearch();
      scrollToResults();
    } catch (error) {
      console.error('Search failed:', error);
      showErrorState('Search failed. Please try again.');
    }
  }, 1000);
}

function handleFilterChange() {
  console.log('Filter changed');
  // Auto-search if ingredients are selected
  if (selectedIngredients.length > 0) {
    handleSearch();
  }
}

// Enhanced search with Spoonacular API
async function performSearch() {
  console.log('Performing search with ingredients:', selectedIngredients);
  
  try {
    let recipes;
    
    if (API_KEY != 'c38766cf56e249e2b9bc769909eed0f3') {
      console.log('Using mock data - API key not configured');
      recipes = await getMockRecipes();
    } else {
      console.log('Using Spoonacular API');
      recipes = await searchRecipes(selectedIngredients, currentFilters.mealType, currentFilters.dietary);
    }
    
    currentRecipes = recipes;
    displayResults();
    
  } catch (error) {
    console.error('Search error:', error);
    showErrorState('Failed to fetch recipes. Please check your connection and try again.');
  }
}

// Spoonacular API integration
async function searchRecipes(ingredients, mealType, dietary) {
  if (API_KEY != 'c38766cf56e249e2b9bc769909eed0f3') {
    throw new Error('API key not configured');
  }

  const ingredientsParam = ingredients.join(',');
  let url = `${API_BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&includeIngredients=${ingredientsParam}&number=12&addRecipeInformation=true&fillIngredients=true`;
  
  // Add filters
  if (mealType) {
    url += `&type=${mealType}`;
  }
  if (dietary) {
    url += `&diet=${dietary}`;
  }
  if (currentFilters.cuisine) {
    url += `&cuisine=${currentFilters.cuisine}`;
  }
  if (currentFilters.maxReadyTime) {
    url += `&maxReadyTime=${currentFilters.maxReadyTime}`;
  }

  console.log('API URL:', url);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Spoonacular API key.');
      } else if (response.status === 402) {
        throw new Error('API quota exceeded. Please check your Spoonacular plan.');
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    return data.results || [];
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Mock data fallback when API key is not configured
async function getMockRecipes() {
  console.log('Using mock recipe data');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockRecipes = [
    {
      "id": 1,
      "title": "Chicken Fried Rice",
      "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
      "summary": "Classic Asian-style fried rice with tender chicken and vegetables. Perfect comfort food that's quick and easy to make.",
      "readyInMinutes": 25,
      "servings": 4,
      "healthScore": 78,
      "diets": ["gluten free"],
      "cuisines": ["asian"],
      "extendedIngredients": [
        {"original": "2 cups cooked rice"},
        {"original": "1 lb chicken breast, diced"},
        {"original": "2 eggs, beaten"},
        {"original": "3 tbsp soy sauce"},
        {"original": "2 cloves garlic, minced"},
        {"original": "1 tsp fresh ginger, grated"}
      ],
      "analyzedInstructions": [{
        "steps": [
          {"step": "Cook rice according to package directions and set aside to cool."},
          {"step": "Heat oil in a large wok or skillet over high heat."},
          {"step": "Scramble eggs and remove from pan."},
          {"step": "Cook chicken until no longer pink."},
          {"step": "Add vegetables and stir-fry for 2-3 minutes."},
          {"step": "Add rice, soy sauce, and seasonings. Stir-fry until heated through."},
          {"step": "Return eggs to pan and toss everything together. Serve hot."}
        ]
      }],
      "sourceUrl": "https://example.com/recipe1",
      "spoonacularSourceUrl": "https://spoonacular.com/chicken-fried-rice-1"
    },
    {
      "id": 2,
      "title": "Mediterranean Quinoa Bowl",
      "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      "summary": "Nutritious and colorful bowl packed with quinoa, fresh vegetables, and a tangy lemon dressing. A perfect healthy meal.",
      "readyInMinutes": 30,
      "servings": 2,
      "healthScore": 95,
      "diets": ["vegan", "gluten free"],
      "cuisines": ["mediterranean"],
      "extendedIngredients": [
        {"original": "1 cup quinoa"},
        {"original": "1 cucumber, diced"}, 
        {"original": "2 cups cherry tomatoes, halved"},
        {"original": "1/2 red onion, thinly sliced"},
        {"original": "1/4 cup olive oil"},
        {"original": "2 tbsp lemon juice"}
      ],
      "analyzedInstructions": [{
        "steps": [
          {"step": "Cook quinoa according to package directions and let cool."},
          {"step": "Dice cucumber and halve cherry tomatoes."},
          {"step": "Slice red onion thinly."},
          {"step": "Whisk together olive oil, lemon juice, salt and pepper."},
          {"step": "Combine quinoa with vegetables in a large bowl."},
          {"step": "Drizzle with dressing and toss to combine."},
          {"step": "Let sit for 10 minutes before serving to allow flavors to meld."}
        ]
      }],
      "sourceUrl": "https://example.com/recipe2",
      "spoonacularSourceUrl": "https://spoonacular.com/mediterranean-quinoa-bowl-2"
    },
    {
      "id": 3,
      "title": "Creamy Tomato Pasta",
      "image": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", 
      "summary": "Rich and creamy tomato pasta that's ready in just 20 minutes. Comfort food at its finest with simple ingredients.",
      "readyInMinutes": 20,
      "servings": 4,
      "healthScore": 65,
      "diets": ["vegetarian"],
      "cuisines": ["italian"],
      "extendedIngredients": [
        {"original": "12 oz pasta"},
        {"original": "1 can crushed tomatoes"},
        {"original": "1/2 cup heavy cream"},
        {"original": "3 cloves garlic, minced"},
        {"original": "1/4 cup parmesan cheese"},
        {"original": "2 tbsp olive oil"}
      ],
      "analyzedInstructions": [{
        "steps": [
          {"step": "Cook pasta according to package directions."},
          {"step": "Heat olive oil in a large pan over medium heat."},
          {"step": "Sauté garlic until fragrant, about 1 minute."},
          {"step": "Add crushed tomatoes and simmer for 10 minutes."},
          {"step": "Stir in heavy cream and season with salt and pepper."},
          {"step": "Toss pasta with sauce and top with parmesan cheese."},
          {"step": "Serve immediately with fresh basil if desired."}
        ]
      }],
      "sourceUrl": "https://example.com/recipe3",
      "spoonacularSourceUrl": "https://spoonacular.com/creamy-tomato-pasta-3"
    },
    {
      "id": 4,
      "title": "Avocado Toast with Eggs",
      "image": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
      "summary": "Simple yet delicious avocado toast topped with perfectly cooked eggs. A nutritious breakfast or brunch option.",
      "readyInMinutes": 15,
      "servings": 2,
      "healthScore": 85,
      "diets": ["vegetarian"],
      "cuisines": ["american"],
      "extendedIngredients": [
        {"original": "2 slices whole grain bread"},
        {"original": "1 ripe avocado"},
        {"original": "2 eggs"},
        {"original": "1 tbsp lemon juice"},
        {"original": "Salt and pepper to taste"},
        {"original": "Red pepper flakes (optional)"}
      ],
      "analyzedInstructions": [{
        "steps": [
          {"step": "Toast bread slices until golden brown."},
          {"step": "Mash avocado with lemon juice, salt, and pepper."},
          {"step": "Cook eggs to your preference (fried, poached, or scrambled)."},
          {"step": "Spread avocado mixture on toast."},
          {"step": "Top with cooked eggs."},
          {"step": "Sprinkle with red pepper flakes if desired."},
          {"step": "Serve immediately while toast is still warm."}
        ]
      }],
      "sourceUrl": "https://example.com/recipe4",
      "spoonacularSourceUrl": "https://spoonacular.com/avocado-toast-eggs-4"
    }
  ];
  
  // Filter mock recipes based on selected ingredients
  const filteredRecipes = mockRecipes.filter(recipe => {
    const recipeIngredients = recipe.extendedIngredients.map(ing => 
      ing.original.toLowerCase()
    ).join(' ');
    
    return selectedIngredients.some(ingredient => 
      recipeIngredients.includes(ingredient.toLowerCase()) ||
      recipe.title.toLowerCase().includes(ingredient.toLowerCase())
    );
  });
  
  return filteredRecipes.length > 0 ? filteredRecipes : mockRecipes;
}

function displayResults() {
  console.log('Displaying results:', currentRecipes.length, 'recipes');
  hideLoadingState();
  
  if (currentRecipes.length === 0) {
    console.log('No recipes found, showing error state');
    showErrorState('No recipes found with your selected ingredients. Try different ingredients or remove some filters.');
    hideResultsGrid();
  } else {
    console.log('Recipes found, showing results');
    hideErrorState();
    showResultsGrid();
    renderRecipeCards();
  }
}

function renderRecipeCards() {
  if (!resultsGrid) {
    console.error('Results grid not found');
    return;
  }
  
  console.log('Rendering', currentRecipes.length, 'recipe cards');
  resultsGrid.innerHTML = '';
  
  currentRecipes.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    resultsGrid.appendChild(recipeCard);
  });
}

function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = 'recipe-card glass-card';
  
  // Add click event to entire card
  card.addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') {
      openRecipeModal(recipe);
    }
  });

  // Create tags for diets and cuisines
  const tags = [...(recipe.diets || []), ...(recipe.cuisines || [])];
  const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

  // Handle different image sources
  const imageUrl = recipe.image || `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400`;
  
  card.innerHTML = `
    <img src="${imageUrl}" alt="${recipe.title}" class="recipe-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjcpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SZWNpcGUgSW1hZ2U8L3RleHQ+PC9zdmc+'">
    <h3 class="recipe-title">${recipe.title}</h3>
    <p class="recipe-description">${stripHtml(recipe.summary || 'Delicious recipe perfect for any occasion.')}</p>
    <div class="recipe-meta">
      <div class="meta-item">⏱️ ${recipe.readyInMinutes || 30} min</div>
      <div class="meta-item">🍽️ ${recipe.servings || 4} servings</div>
      <div class="meta-item">❤️ ${recipe.healthScore || 75}</div>
    </div>
    <div class="recipe-tags">
      ${tagsHTML}
    </div>
    <button class="view-recipe-btn" data-recipe-id="${recipe.id}">View Recipe</button>
  `;

  // Add specific event listener for the button
  const viewBtn = card.querySelector('.view-recipe-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('View recipe button clicked for recipe:', recipe.title);
      openRecipeModal(recipe);
    });
  }

  return card;
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function openRecipeModal(recipe) {
  console.log('Opening modal for recipe:', recipe.title);
  
  if (!recipeModal) {
    console.error('Recipe modal not found');
    return;
  }

  // Handle case where recipe is passed as JSON string  
  if (typeof recipe === 'string') {
    try {
      recipe = JSON.parse(recipe);
    } catch (e) {
      console.error('Failed to parse recipe JSON:', e);
      return;
    }
  }

  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalReadyTime = document.getElementById('modalReadyTime');
  const modalServings = document.getElementById('modalServings');
  const modalHealthScore = document.getElementById('modalHealthScore');
  const modalTags = document.getElementById('modalTags');
  const modalDescription = document.getElementById('modalDescription');
  const modalIngredients = document.getElementById('modalIngredients');
  const modalInstructions = document.getElementById('modalInstructions');
  const modalSourceLink = document.getElementById('modalSourceLink');

  // Populate modal content
  if (modalTitle) modalTitle.textContent = recipe.title;
  if (modalImage) {
    modalImage.src = recipe.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400';
    modalImage.alt = recipe.title;
    modalImage.onerror = function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjcpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SZWNpcGUgSW1hZ2U8L3RleHQ+PC9zdmc+';
    };
  }
  if (modalReadyTime) modalReadyTime.textContent = `${recipe.readyInMinutes || 30} min`;
  if (modalServings) modalServings.textContent = recipe.servings || 4;
  if (modalHealthScore) modalHealthScore.textContent = recipe.healthScore || 75;
  if (modalDescription) modalDescription.textContent = stripHtml(recipe.summary || 'Delicious recipe perfect for any occasion.');

  // Tags
  if (modalTags) {
    const tags = [...(recipe.diets || []), ...(recipe.cuisines || [])];
    const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    modalTags.innerHTML = tagsHTML;
  }

  // Ingredients
  if (modalIngredients) {
    const ingredients = recipe.extendedIngredients || [];
    const ingredientsHTML = ingredients.map(ingredient => 
      `<li>${ingredient.original || ingredient}</li>`
    ).join('');
    modalIngredients.innerHTML = ingredientsHTML;
  }

  // Instructions
  if (modalInstructions) {
    const instructions = recipe.analyzedInstructions || [];
    if (instructions.length > 0 && instructions[0].steps) {
      const instructionsHTML = instructions[0].steps.map(step => 
        `<li>${step.step}</li>`
      ).join('');
      modalInstructions.innerHTML = `<ol>${instructionsHTML}</ol>`;
    } else {
      modalInstructions.innerHTML = '<p>Instructions not available for this recipe.</p>';
    }
  }

  // Source link
  if (modalSourceLink) {
    modalSourceLink.href = recipe.spoonacularSourceUrl || recipe.sourceUrl || '#';
  }

  // Show modal
  recipeModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  console.log('Modal opened successfully');
}

// Make openRecipeModal globally accessible
window.openRecipeModal = openRecipeModal;

function closeRecipeModal() {
  console.log('Closing recipe modal');
  if (recipeModal) {
    recipeModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function toggleAdvancedFilters() {
  console.log('Toggling advanced filters');
  
  if (!advancedFiltersPanel || !toggleFiltersBtn) {
    console.error('Advanced filters elements not found');
    return;
  }
  
  const icon = toggleFiltersBtn.querySelector('.toggle-icon');
  
  if (advancedFiltersPanel.classList.contains('hidden')) {
    console.log('Showing advanced filters');
    advancedFiltersPanel.classList.remove('hidden');
    if (icon) icon.classList.add('rotated');
  } else {
    console.log('Hiding advanced filters');
    advancedFiltersPanel.classList.add('hidden');
    if (icon) icon.classList.remove('rotated');
  }
}

function clearAllFilters() {
  console.log('Clearing all filters');
  
  // Clear ingredients
  selectedIngredients = [];
  renderSelectedIngredients();
  
  // Clear input
  if (ingredientInput) ingredientInput.value = '';
  
  // Clear select filters
  if (mealTypeSelect) mealTypeSelect.value = '';
  if (dietarySelect) dietarySelect.value = '';
  if (cuisineSelect) cuisineSelect.value = '';
  if (maxReadyTimeSelect) maxReadyTimeSelect.value = '';
  
  currentFilters = {
    mealType: '',
    dietary: '',
    cuisine: '',
    maxReadyTime: ''
  };
  
  // Clear results
  hideResultsGrid();
  hideErrorState();
  
  showMessage('All filters cleared', 'info');
}

function showLoadingState() {
  console.log('Showing loading state');
  if (loadingState) loadingState.classList.remove('hidden');
  if (errorState) errorState.classList.add('hidden');
  if (resultsGrid) resultsGrid.classList.add('hidden');
  
  // Update button state
  if (searchBtn) {
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoader = searchBtn.querySelector('.btn-loader');
    if (btnText) btnText.classList.add('hidden');
    if (btnLoader) btnLoader.classList.remove('hidden');
    searchBtn.disabled = true;
  }
}

function hideLoadingState() {
  console.log('Hiding loading state');
  if (loadingState) loadingState.classList.add('hidden');
  
  // Reset button state
  if (searchBtn) {
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoader = searchBtn.querySelector('.btn-loader');
    if (btnText) btnText.classList.remove('hidden');
    if (btnLoader) btnLoader.classList.add('hidden');
    searchBtn.disabled = false;
  }
}

function showErrorState(message = 'No recipes found. Try adjusting your ingredients or filters.') {
  console.log('Showing error state:', message);
  if (errorState) {
    errorState.classList.remove('hidden');
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }
}

function hideErrorState() {
  if (errorState) errorState.classList.add('hidden');
}

function showResultsGrid() {
  if (resultsGrid) resultsGrid.classList.remove('hidden');
}

function hideResultsGrid() {
  if (resultsGrid) resultsGrid.classList.add('hidden');
}

function scrollToResults() {
  const resultsSection = document.querySelector('.results-section');
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}