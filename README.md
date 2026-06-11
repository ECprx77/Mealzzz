# SMDpreppers

A fierce, jungle-themed recipe app built with React Native (Expo) and powered by [TheMealDB](https://www.themealdb.com/api.php).

## Features

- Recipe search (single letter = starts with, 2+ characters = contains)
- Filter by category, random recipe button
- Recipe detail: image, ingredients, instructions, YouTube video link
- Favorites, persisted across restarts (works offline)
- Loading / error / empty states everywhere
- Dark jungle theme, staggered entrance animations

## Stack

- **Expo / React Native** with [expo-router](https://docs.expo.dev/router/introduction) (bottom tab navigation: Home / Favorites)
- **Redux Toolkit** (`createSlice`, `configureStore`, async thunks) for all shared state
- **redux-persist** + AsyncStorage for favorites
- **react-native-reanimated** for animations
- Functional components + hooks only; all network access isolated in `api/`

## Project structure

```
api/        TheMealDB client (the only place doing fetch)
store/      Redux store, recipesSlice (with search cache), favoritesSlice
app/        expo-router screens: (tabs)/index, (tabs)/favorites, recipe/[id]
components/ Reusable UI (RecipeCard, ...)
constants/  Jungle theme palette
```

## Get started

```bash
bun install
bunx expo start
```

Then open the app in Expo Go (or an emulator) from the QR code / menu.

## Notes

- The recipes search/category/detail caches live in Redux memory: repeating a search or reopening a recipe does not hit the network again.
- Only the favorites slice is persisted; favorited recipes are stored in full so their detail screen works without a connection.
