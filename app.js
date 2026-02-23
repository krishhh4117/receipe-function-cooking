// ============================================
// RecipeApp Module (IIFE)
// ============================================

const RecipeApp = (() => {

  // ============================================
  // PRIVATE DATA
  // ============================================

  const recipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "Classic Italian pasta with eggs and cheese.",
      category: "pasta",
      ingredients: [
        "400g spaghetti",
        "200g pancetta",
        "4 eggs",
        "100g Parmesan cheese",
        "Black pepper",
        "Salt"
      ],
      steps: [
        "Boil salted water",
        "Cook spaghetti",
        {
          text: "Prepare sauce",
          substeps: [
            "Beat eggs",
            "Add grated cheese",
            "Mix pepper"
          ]
        },
        "Cook pancetta",
        "Combine everything",
        "Serve hot"
      ]
    },
    {
      id: 2,
      title: "Chicken Curry",
      time: 60,
      difficulty: "medium",
      description: "Spicy and flavorful Indian curry.",
      category: "curry",
      ingredients: [
        "500g chicken",
        "2 onions",
        "Tomatoes",
        "Garlic",
        "Spices",
        "Oil"
      ],
      steps: [
        "Heat oil",
        {
          text: "Prepare base",
          substeps: [
            "Saute onions",
            "Add garlic",
            "Add tomatoes",
            {
              text: "Add spices",
              substeps: ["Turmeric", "Chili powder", "Garam masala"]
            }
          ]
        },
        "Add chicken",
        "Cook until tender",
        "Serve with rice"
      ]
    },
    {
      id: 3,
      title: "Greek Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh salad with feta and olives.",
      category: "salad",
      ingredients: [
        "Tomatoes",
        "Cucumber",
        "Olives",
        "Feta cheese",
        "Olive oil",
        "Salt"
      ],
      steps: [
        "Chop vegetables",
        "Add olives",
        "Add feta",
        "Drizzle olive oil",
        "Mix and serve"
      ]
    }
  ];

  // ============================================
  // PRIVATE STATE
  // ============================================

  let currentFilter = "all";
  let currentSort = "none";

  // ============================================
  // DOM REFERENCES
  // ============================================

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");

  // ============================================
  // RECURSIVE STEPS RENDERING
  // ============================================

  const renderSteps = (steps, level = 0) => {
    const listClass = level === 0 ? "steps-list" : "substeps-list";
    let html = `<ol class="${listClass}">`;

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.text}`;
        if (step.substeps && step.substeps.length > 0) {
          html += renderSteps(step.substeps, level + 1);
        }
        html += `</li>`;
      }
    });

    html += `</ol>`;
    return html;
  };

  const createStepsHTML = (steps) => {
    if (!steps || steps.length === 0) {
      return "<p>No steps available</p>";
    }
    return renderSteps(steps);
  };

  // ============================================
  // CREATE RECIPE CARD
  // ============================================

  const createRecipeCard = (recipe) => {
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
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
          <h4>Ingredients:</h4>
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>

        <div class="steps-container" data-recipe-id="${recipe.id}">
          <h4>Cooking Steps:</h4>
          ${createStepsHTML(recipe.steps)}
        </div>
      </div>
    `;
  };

  // ============================================
  // FILTER & SORT LOGIC
  // ============================================

  const applyFilter = (recipesArray) => {
    if (currentFilter === "all") return recipesArray;
    return recipesArray.filter(r => r.difficulty === currentFilter);
  };

  const applySort = (recipesArray) => {
    if (currentSort === "time") {
      return [...recipesArray].sort((a, b) => a.time - b.time);
    }
    return recipesArray;
  };

  const updateDisplay = () => {
    let updated = applyFilter(recipes);
    updated = applySort(updated);

    recipeContainer.innerHTML = updated
      .map(recipe => createRecipeCard(recipe))
      .join("");
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleToggleClick = (event) => {
    if (!event.target.classList.contains("toggle-btn")) return;

    const button = event.target;
    const recipeId = button.dataset.recipeId;
    const toggleType = button.dataset.toggle;

    const containerClass =
      toggleType === "steps" ? "steps-container" : "ingredients-container";

    const container = document.querySelector(
      `.${containerClass}[data-recipe-id="${recipeId}"]`
    );

    if (container) {
      container.classList.toggle("visible");

      const isVisible = container.classList.contains("visible");

      if (toggleType === "steps") {
        button.textContent = isVisible
          ? "📋 Hide Steps"
          : "📋 Show Steps";
      } else {
        button.textContent = isVisible
          ? "🥗 Hide Ingredients"
          : "🥗 Show Ingredients";
      }
    }
  };

  const handleFilterClick = (event) => {
    currentFilter = event.target.dataset.filter;
    updateDisplay();
  };

  const handleSortClick = (event) => {
    currentSort = event.target.dataset.sort;
    updateDisplay();
  };

  // ============================================
  // INITIALIZATION
  // ============================================

  const setupEventListeners = () => {
    filterButtons.forEach(btn =>
      btn.addEventListener("click", handleFilterClick)
    );

    sortButtons.forEach(btn =>
      btn.addEventListener("click", handleSortClick)
    );

    recipeContainer.addEventListener("click", handleToggleClick);
  };

  const init = () => {
    console.log("RecipeApp initializing...");
    setupEventListeners();
    updateDisplay();
    console.log("RecipeApp ready!");
  };

  // ============================================
  // PUBLIC API
  // ============================================

  return {
    init,
    updateDisplay
  };

})();

// ============================================
// START APP
// ============================================

RecipeApp.init();