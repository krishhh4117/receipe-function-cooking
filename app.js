// ==========================
// Recipe Data
// ==========================

const recipes = [
  { id: 1, title: "Spaghetti Carbonara", time: 25, difficulty: "easy", description: "Classic Italian pasta with eggs and cheese.", category: "pasta" },
  { id: 2, title: "Chicken Curry", time: 60, difficulty: "medium", description: "Spicy and flavorful Indian curry.", category: "curry" },
  { id: 3, title: "Beef Wellington", time: 120, difficulty: "hard", description: "Tender beef wrapped in pastry.", category: "meat" },
  { id: 4, title: "Greek Salad", time: 15, difficulty: "easy", description: "Fresh salad with feta and olives.", category: "salad" },
  { id: 5, title: "Ramen", time: 90, difficulty: "hard", description: "Japanese noodle soup with rich broth.", category: "soup" },
  { id: 6, title: "Pancakes", time: 20, difficulty: "easy", description: "Fluffy breakfast pancakes.", category: "breakfast" },
  { id: 7, title: "Butter Chicken", time: 70, difficulty: "medium", description: "Creamy tomato-based chicken curry.", category: "curry" },
  { id: 8, title: "Chocolate Soufflé", time: 80, difficulty: "hard", description: "Light and airy chocolate dessert.", category: "dessert" }
];

// ==========================
// Select Container
// ==========================

const recipeContainer = document.querySelector("#recipe-container");

// ==========================
// Create Recipe Card
// ==========================

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
    </div>
  `;
};

// ==========================
// Render Recipes
// ==========================

const renderRecipes = (recipesArray) => {
  const cardsHTML = recipesArray
    .map(recipe => createRecipeCard(recipe))
    .join("");

  recipeContainer.innerHTML = cardsHTML;
};

// ==========================
// Initialize App
// ==========================

renderRecipes(recipes);