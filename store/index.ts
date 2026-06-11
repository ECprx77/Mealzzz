import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import favoritesReducer from '@/store/favoritesSlice';
import recipesReducer from '@/store/recipesSlice';

const rootReducer = combineReducers({
  recipes: recipesReducer,
  favorites: favoritesReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'smdpreppers',
    storage: AsyncStorage,
    // Only favorites survive restarts; the recipes cache stays in-memory.
    whitelist: ['favorites'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
