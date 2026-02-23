// ==========================
// Recipe Data (Part 1)
// ==========================

const recipes = [
  { id: 1, title: "Spaghetti Carbonara", time: 25, difficulty: "easy", description: "Classic Italian pasta with eggs and cheese." },
  { id: 2, title: "Chicken Curry", time: 60, difficulty: "medium", description: "Spicy and flavorful Indian curry." },
  { id: 3, title: "Beef Wellington", time: 120, difficulty: "hard", description: "Tender beef wrapped in pastry." },
  { id: 4, title: "Greek Salad", time: 15, difficulty: "easy", description: "Fresh salad with feta and olives." },
  { id: 5, title: "Ramen", time: 90, difficulty: "hard", description: "Japanese noodle soup with rich broth." },
  { id: 6, title: "Pancakes", time: 20, difficulty: "easy", description: "Fluffy breakfast pancakes." },
  { id: 7, title: "Butter Chicken", time: 70, difficulty: "medium", description: "Creamy tomato-based chicken curry." },
  { id: 8, title: "Chocolate Soufflé", time: 80, difficulty: "hard", description: "Light and airy chocolate dessert." }
];

// ==========================
// State Management (Part 2)
// ==========================

let currentFilter = "all";
let currentSort = "none";

// ==========================
// DOM Selections
// ==========================

const recipeContainer = document.querySelector("#recipe-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortButtons = document.querySelectorAll(".sort-btn");

// ==========================
// Create Recipe Card (Part 1)
// ==========================

const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>
      <div class="recipe-meta">
        <span>⏱️ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">
          ${recipe.difficulty}
        </span>
      </div>
      <p>${recipe.description}</p>
    </div>
  `;
};

// ==========================
// Render Recipes
// ==========================

const renderRecipes = (recipesArray) => {
  recipeContainer.innerHTML = recipesArray
    .map(recipe => createRecipeCard(recipe))
    .join("");
};

// ==========================
// Pure Filter Functions
// ==========================

const filterByDifficulty = (recipes, difficulty) => {
  return recipes.filter(recipe => recipe.difficulty === difficulty);
};

const filterByTime = (recipes, maxTime) => {
  return recipes.filter(recipe => recipe.time < maxTime);
};

const applyFilter = (recipes, filterType) => {
  switch (filterType) {
    case "easy":
    case "medium":
    case "hard":
      return filterByDifficulty(recipes, filterType);
    case "quick":
      return filterByTime(recipes, 30);
    default:
      return recipes;
  }
};

// ==========================
// Pure Sort Functions
// ==========================

const sortByName = (recipes) => {
  return [...recipes].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
};

const sortByTime = (recipes) => {
  return [...recipes].sort((a, b) =>
    a.time - b.time
  );
};

const applySort = (recipes, sortType) => {
  switch (sortType) {
    case "name":
      return sortByName(recipes);
    case "time":
      return sortByTime(recipes);
    default:
      return recipes;
  }
};

// ==========================
// Update Display
// ==========================

const updateDisplay = () => {
  let recipesToDisplay = recipes;

  recipesToDisplay = applyFilter(recipesToDisplay, currentFilter);
  recipesToDisplay = applySort(recipesToDisplay, currentSort);

  console.log(
    `Displaying ${recipesToDisplay.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
  );

  renderRecipes(recipesToDisplay);
};

// ==========================
// Active Button Handling
// ==========================

const updateActiveButtons = () => {
  filterButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    }
  });

  sortButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.sort === currentSort) {
      btn.classList.add("active");
    }
  });
};

// ==========================
// Event Listeners
// ==========================

const setupEventListeners = () => {

  filterButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
      currentFilter = event.target.dataset.filter;
      updateActiveButtons();
      updateDisplay();
    });
  });

  sortButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
      currentSort = event.target.dataset.sort;
      updateActiveButtons();
      updateDisplay();
    });
  });

};

// ==========================
// Initialize App
// ==========================

setupEventListeners();
updateDisplay();