const RecipeApp = (() => {
  'use strict';

  // ============================================
  // DATA
  // ============================================

  const recipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "Classic Italian pasta with eggs and cheese.",
      category: "pasta",
      ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Pepper"],
      steps: [
        "Boil salted water",
        "Cook spaghetti",
        {
          text: "Prepare sauce",
          substeps: [
            "Beat eggs",
            "Add grated cheese",
            "Add black pepper"
          ]
        },
        "Cook pancetta",
        "Combine everything and serve"
      ]
    },
    {
      id: 2,
      title: "Chicken Curry",
      time: 60,
      difficulty: "medium",
      description: "Spicy and flavorful Indian curry.",
      category: "curry",
      ingredients: ["Chicken", "Onions", "Tomatoes", "Garlic", "Spices"],
      steps: [
        "Heat oil",
        {
          text: "Prepare base",
          substeps: [
            "Cook onions",
            "Add garlic",
            {
              text: "Add spices",
              substeps: ["Turmeric", "Chili powder"]
            }
          ]
        },
        "Add chicken",
        "Simmer until cooked"
      ]
    }
  ];

  // ============================================
  // STATE
  // ============================================

  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  // ============================================
  // DOM REFERENCES
  // ============================================

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCountDisplay = document.querySelector("#recipe-count");

  // ============================================
  // FILTER FUNCTIONS
  // ============================================

  const filterBySearch = (recipes, query) => {
    if (!query.trim()) return recipes;

    const lowerQuery = query.toLowerCase();

    return recipes.filter(recipe => {
      const titleMatch = recipe.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = recipe.description.toLowerCase().includes(lowerQuery);
      const ingredientMatch = recipe.ingredients.some(ing =>
        ing.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || descriptionMatch || ingredientMatch;
    });
  };

  const filterFavorites = (recipes) =>
    recipes.filter(recipe => favorites.includes(recipe.id));

  const applyFilter = (recipes) => {
    if (currentFilter === "favorites") return filterFavorites(recipes);
    if (currentFilter === "all") return recipes;
    return recipes.filter(r => r.difficulty === currentFilter);
  };

  const applySort = (recipes) => {
    if (currentSort === "time") {
      return [...recipes].sort((a, b) => a.time - b.time);
    }
    return recipes;
  };

  // ============================================
  // RECURSIVE STEP RENDERING
  // ============================================

  const renderSteps = (steps, level = 0) => {
    const listClass = level === 0 ? "steps-list" : "substeps-list";
    let html = `<ol class="${listClass}">`;

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.text}`;
        if (step.substeps) {
          html += renderSteps(step.substeps, level + 1);
        }
        html += `</li>`;
      }
    });

    html += "</ol>";
    return html;
  };

  // ============================================
  // RENDER CARD
  // ============================================

  const createRecipeCard = (recipe) => {
    const isFavorited = favorites.includes(recipe.id);
    const heart = isFavorited ? "❤️" : "🤍";

    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <button class="favorite-btn" data-recipe-id="${recipe.id}">
          ${heart}
        </button>

        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty}">
            ${recipe.difficulty}
          </span>
        </div>
        <p>${recipe.description}</p>

        <div class="card-actions">
          <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">
            📋 Show Steps
          </button>
          <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">
            🥗 Show Ingredients
          </button>
        </div>

        <div class="ingredients-container" data-recipe-id="${recipe.id}">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>

        <div class="steps-container" data-recipe-id="${recipe.id}">
          ${renderSteps(recipe.steps)}
        </div>
      </div>
    `;
  };

  const renderRecipes = (recipes) => {
    recipeContainer.innerHTML = recipes.map(createRecipeCard).join("");
  };

  // ============================================
  // UI HELPERS
  // ============================================

  const updateRecipeCounter = (showing, total) => {
    if (recipeCountDisplay) {
      recipeCountDisplay.textContent = `Showing ${showing} of ${total} recipes`;
    }
  };

  const updateDisplay = () => {
    let results = recipes;
    results = filterBySearch(results, searchQuery);
    results = applyFilter(results);
    results = applySort(results);

    updateRecipeCounter(results.length, recipes.length);
    renderRecipes(results);
  };

  // ============================================
  // FAVORITES
  // ============================================

  const saveFavorites = () => {
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
  };

  const toggleFavorite = (id) => {
    const recipeId = parseInt(id);

    if (favorites.includes(recipeId)) {
      favorites = favorites.filter(fav => fav !== recipeId);
    } else {
      favorites.push(recipeId);
    }

    saveFavorites();
    updateDisplay();
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleSearchInput = (e) => {
    const value = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = value ? "block" : "none";
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = value;
      updateDisplay();
    }, 300);
  };

  const handleClearSearch = () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  };

  const handleFavoriteClick = (e) => {
    if (!e.target.classList.contains("favorite-btn")) return;
    toggleFavorite(e.target.dataset.recipeId);
  };

  const handleToggleClick = (e) => {
    if (!e.target.classList.contains("toggle-btn")) return;

    const recipeId = e.target.dataset.recipeId;
    const toggleType = e.target.dataset.toggle;

    const containerClass =
      toggleType === "steps" ? "steps-container" : "ingredients-container";

    const container = document.querySelector(
      `.${containerClass}[data-recipe-id="${recipeId}"]`
    );

    if (container) {
      container.classList.toggle("visible");
    }
  };

  const handleFilterClick = (e) => {
    currentFilter = e.target.dataset.filter;
    updateDisplay();
  };

  const handleSortClick = (e) => {
    currentSort = e.target.dataset.sort;
    updateDisplay();
  };

  // ============================================
  // INIT
  // ============================================

  const setupEventListeners = () => {
    filterButtons.forEach(btn =>
      btn.addEventListener("click", handleFilterClick)
    );

    sortButtons.forEach(btn =>
      btn.addEventListener("click", handleSortClick)
    );

    recipeContainer.addEventListener("click", handleFavoriteClick);
    recipeContainer.addEventListener("click", handleToggleClick);

    if (searchInput) {
      searchInput.addEventListener("input", handleSearchInput);
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", handleClearSearch);
    }
  };

  const init = () => {
    console.log("🍳 RecipeJS initializing...");
    setupEventListeners();
    updateDisplay();
    console.log("✅ RecipeJS ready!");
  };

  return { init };

})();

RecipeApp.init();