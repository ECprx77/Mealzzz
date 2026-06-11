import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  filterByCategory,
  getMealById,
  getRandomMeal,
  listCategories,
  searchMealsByName,
  type Category,
  type Meal,
  type MealSummary,
} from '@/api/mealdb';
import type { RootState } from '@/store';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface RecipesState {
  query: string;
  selectedCategory: string | null;
  categories: Category[];
  /** Search results cached by normalized query, so a repeated search hits no network. */
  searchCache: Record<string, Meal[]>;
  /** Category listing cached by category name. */
  categoryCache: Record<string, MealSummary[]>;
  /** Full meal details cached by id (used by detail screen + random meal). */
  mealDetails: Record<string, Meal>;
  listStatus: Status;
  listError: string | null;
  detailStatus: Status;
  detailError: string | null;
}

const initialState: RecipesState = {
  query: '',
  selectedCategory: null,
  categories: [],
  searchCache: {},
  categoryCache: {},
  mealDetails: {},
  listStatus: 'idle',
  listError: null,
  detailStatus: 'idle',
  detailError: null,
};

const normalize = (query: string) => query.trim().toLowerCase();

export const searchMeals = createAsyncThunk<
  { query: string; meals: Meal[] },
  string,
  { state: RootState }
>('recipes/search', async (query, { getState }) => {
  const key = normalize(query);
  const cached = getState().recipes.searchCache[key];
  if (cached) {
    return { query: key, meals: cached };
  }
  const meals = await searchMealsByName(key);
  return { query: key, meals };
});

export const fetchCategories = createAsyncThunk<Category[], void, { state: RootState }>(
  'recipes/fetchCategories',
  async () => listCategories(),
  {
    condition: (_, { getState }) => getState().recipes.categories.length === 0,
  },
);

export const fetchMealsByCategory = createAsyncThunk<
  { category: string; meals: MealSummary[] },
  string,
  { state: RootState }
>('recipes/fetchByCategory', async (category, { getState }) => {
  const cached = getState().recipes.categoryCache[category];
  if (cached) {
    return { category, meals: cached };
  }
  const meals = await filterByCategory(category);
  return { category, meals };
});

export const fetchMealById = createAsyncThunk<Meal, string, { state: RootState }>(
  'recipes/fetchById',
  async (id) => {
    const meal = await getMealById(id);
    if (!meal) {
      throw new Error('Recipe not found');
    }
    return meal;
  },
  {
    condition: (id, { getState }) => !getState().recipes.mealDetails[id],
  },
);

export const fetchRandomMeal = createAsyncThunk<Meal>('recipes/fetchRandom', async () => {
  const meal = await getRandomMeal();
  if (!meal) {
    throw new Error('No random recipe returned');
  }
  return meal;
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMeals.pending, (state, action) => {
        state.listStatus = 'loading';
        state.listError = null;
        state.query = normalize(action.meta.arg);
        state.selectedCategory = null;
      })
      .addCase(searchMeals.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.searchCache[action.payload.query] = action.payload.meals;
      })
      .addCase(searchMeals.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.error.message ?? 'Search failed';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchMealsByCategory.pending, (state, action) => {
        state.listStatus = 'loading';
        state.listError = null;
        state.selectedCategory = action.meta.arg;
      })
      .addCase(fetchMealsByCategory.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.categoryCache[action.payload.category] = action.payload.meals;
      })
      .addCase(fetchMealsByCategory.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.error.message ?? 'Could not load category';
      })
      .addCase(fetchMealById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.mealDetails[action.payload.idMeal] = action.payload;
      })
      .addCase(fetchMealById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.error.message ?? 'Could not load recipe';
      })
      .addCase(fetchRandomMeal.fulfilled, (state, action) => {
        state.mealDetails[action.payload.idMeal] = action.payload;
      });
  },
});

export const { setSelectedCategory } = recipesSlice.actions;

// Selectors
export const selectQuery = (state: RootState) => state.recipes.query;
export const selectSelectedCategory = (state: RootState) => state.recipes.selectedCategory;
export const selectCategories = (state: RootState) => state.recipes.categories;
export const selectListStatus = (state: RootState) => state.recipes.listStatus;
export const selectListError = (state: RootState) => state.recipes.listError;
export const selectDetailStatus = (state: RootState) => state.recipes.detailStatus;
export const selectDetailError = (state: RootState) => state.recipes.detailError;

export const selectSearchResults = (state: RootState): Meal[] =>
  state.recipes.searchCache[state.recipes.query] ?? [];

export const selectCategoryResults = (state: RootState): MealSummary[] =>
  state.recipes.selectedCategory
    ? (state.recipes.categoryCache[state.recipes.selectedCategory] ?? [])
    : [];

export const selectMealById = (id: string) => (state: RootState) =>
  state.recipes.mealDetails[id];

export default recipesSlice.reducer;
