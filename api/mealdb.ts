/**
 * TheMealDB API client (https://www.themealdb.com/api.php).
 * All network access of the app goes through this module.
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/** Full meal object as returned by search.php / lookup.php / random.php */
export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  // strIngredient1..20 / strMeasure1..20 are accessed dynamically
  [key: string]: string | null;
}

/** Lightweight meal returned by filter.php (category filtering) */
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Ingredient {
  name: string;
  measure: string;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}/${path}`);
  if (!response.ok) {
    throw new Error(`MealDB request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function searchMealsByName(query: string): Promise<Meal[]> {
  const data = await get<{ meals: Meal[] | null }>(
    `search.php?s=${encodeURIComponent(query)}`,
  );
  return data.meals ?? [];
}

export async function searchMealsByFirstLetter(letter: string): Promise<Meal[]> {
  const data = await get<{ meals: Meal[] | null }>(
    `search.php?f=${encodeURIComponent(letter)}`,
  );
  return data.meals ?? [];
}

/**
 * Smart search used by the app:
 * - 1 character: meals whose name starts with that letter
 * - 2+ characters: meals whose name contains the query
 */
export async function searchMeals(query: string): Promise<Meal[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    return searchMealsByFirstLetter(q);
  }
  const meals = await searchMealsByName(q);
  return meals.filter((meal) => meal.strMeal.toLowerCase().includes(q));
}

export async function getMealById(id: string): Promise<Meal | null> {
  const data = await get<{ meals: Meal[] | null }>(
    `lookup.php?i=${encodeURIComponent(id)}`,
  );
  return data.meals?.[0] ?? null;
}

export async function getRandomMeal(): Promise<Meal | null> {
  const data = await get<{ meals: Meal[] | null }>('random.php');
  return data.meals?.[0] ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const data = await get<{ categories: Category[] | null }>('categories.php');
  return data.categories ?? [];
}

export async function filterByCategory(category: string): Promise<MealSummary[]> {
  const data = await get<{ meals: MealSummary[] | null }>(
    `filter.php?c=${encodeURIComponent(category)}`,
  );
  return data.meals ?? [];
}

/** Collapse the strIngredient1..20 / strMeasure1..20 columns into a clean list. */
export function getIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    if (!name) continue;
    ingredients.push({
      name,
      measure: meal[`strMeasure${i}`]?.trim() ?? '',
    });
  }
  return ingredients;
}
