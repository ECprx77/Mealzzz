import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Meal } from '@/api/mealdb';
import type { RootState } from '@/store';

interface FavoritesState {
  /** Full meals are stored so the favorites tab works without refetching. */
  items: Meal[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Meal>) {
      const index = state.items.findIndex((meal) => meal.idMeal === action.payload.idMeal);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectIsFavorite = (id: string) => (state: RootState) =>
  state.favorites.items.some((meal) => meal.idMeal === id);
export const selectFavoriteById = (id: string) => (state: RootState) =>
  state.favorites.items.find((meal) => meal.idMeal === id);

export default favoritesSlice.reducer;
