// Recipes come from the free TheMealDB API. Time, servings, calories and
// difficulty are not provided by the API, so they are derived from the id
// (stable per recipe) to give every recipe a complete details page.
const BASE = 'https://www.themealdb.com/api/json/v1/1';

export const CATEGORIES = [
  'Beef', 'Breakfast', 'Chicken', 'Dessert', 'Goat', 'Lamb', 'Miscellaneous',
  'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian',
];

const seed = (id) => {
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return h;
};

export async function fetchByCategory(category) {
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  const json = await res.json();
  return (json.meals || []).map((m) => ({
    id: m.idMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    category,
  }));
}

function toSteps(text = '') {
  let parts = text.split(/\r?\n+/).map((s) => s.trim()).filter(Boolean);
  parts = parts.filter((s) => !/^(step\s*\d+|\d+\.?)$/i.test(s));
  if (parts.length <= 2) {
    parts = text.split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean);
  }
  return parts;
}

export async function fetchRecipe(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  const json = await res.json();
  const m = json.meals && json.meals[0];
  if (!m) throw new Error('Recipe not found');

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = (m[`strIngredient${i}`] || '').trim();
    const qty = (m[`strMeasure${i}`] || '').trim();
    if (name) ingredients.push(qty ? `${qty} ${name}` : name);
  }

  const h = seed(id);
  return {
    id: m.idMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    category: m.strCategory,
    ingredients,
    steps: toSteps(m.strInstructions),
    prepTime: `${20 + (h % 7) * 10} min`,
    servings: 2 + (h % 5),
    calories: 250 + (h % 12) * 45,
    difficulty: ['Easy', 'Medium', 'Hard'][h % 3],
  };
}
