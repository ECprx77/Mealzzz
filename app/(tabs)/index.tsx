import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecipeCard, type RecipeCardData } from '@/components/recipe-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCategories,
  fetchMealsByCategory,
  fetchRandomMeal,
  searchMeals,
  selectCategories,
  selectCategoryResults,
  selectListError,
  selectListStatus,
  selectQuery,
  selectSearchResults,
  selectSelectedCategory,
  setSelectedCategory,
} from '@/store/recipesSlice';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [input, setInput] = useState('');
  const [randomLoading, setRandomLoading] = useState(false);

  const query = useAppSelector(selectQuery);
  const categories = useAppSelector(selectCategories);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchResults = useAppSelector(selectSearchResults);
  const categoryResults = useAppSelector(selectCategoryResults);
  const status = useAppSelector(selectListStatus);
  const error = useAppSelector(selectListError);

  const meals: RecipeCardData[] = selectedCategory ? categoryResults : searchResults;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSearch = useCallback(() => {
    if (input.trim().length === 0) return;
    dispatch(searchMeals(input));
  }, [dispatch, input]);

  const onPressCategory = useCallback(
    (category: string) => {
      if (category === selectedCategory) {
        dispatch(setSelectedCategory(null));
      } else {
        dispatch(fetchMealsByCategory(category));
      }
    },
    [dispatch, selectedCategory],
  );

  const onPressRandom = useCallback(async () => {
    setRandomLoading(true);
    try {
      const meal = await dispatch(fetchRandomMeal()).unwrap();
      router.push(`/recipe/${meal.idMeal}`);
    } catch {
      // the list error banner is for list fetches; a failed random pick is non-blocking
    } finally {
      setRandomLoading(false);
    }
  }, [dispatch, router]);

  const onPressMeal = useCallback(
    (meal: RecipeCardData) => {
      router.push(`/recipe/${meal.idMeal}`);
    },
    [router],
  );

  const retry = useCallback(() => {
    if (selectedCategory) {
      dispatch(fetchMealsByCategory(selectedCategory));
    } else if (query) {
      dispatch(searchMeals(query));
    }
  }, [dispatch, selectedCategory, query]);

  const renderEmpty = () => {
    if (status === 'loading') {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={Palette.primary} />
          <Text style={styles.stateText}>Hunting recipes…</Text>
        </View>
      );
    }
    if (status === 'failed') {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>RETRY</Text>
          </Pressable>
        </View>
      );
    }
    if (status === 'succeeded') {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>No prey found</Text>
          <Text style={styles.stateText}>Try another search or category.</Text>
        </View>
      );
    }
    return (
      <View style={styles.stateBox}>
        <Text style={styles.stateTitle}>Welcome to the jungle</Text>
        <Text style={styles.stateText}>
          Search a recipe, pick a category or roll a random one.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>SMDpreppers</Text>
        <Pressable
          style={({ pressed }) => [styles.randomButton, pressed && styles.randomPressed]}
          onPress={onPressRandom}
          disabled={randomLoading}>
          {randomLoading ? (
            <ActivityIndicator size="small" color={Palette.textOnPrimary} />
          ) : (
            <IconSymbol size={18} name="dice.fill" color={Palette.textOnPrimary} />
          )}
          <Text style={styles.randomText}>RANDOM</Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <IconSymbol size={20} name="magnifyingglass" color={Palette.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search a recipe…"
          placeholderTextColor={Palette.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.idCategory}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => {
            const active = item.strCategory === selectedCategory;
            return (
              <Pressable
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onPressCategory(item.strCategory)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.strCategory}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={status === 'loading' ? [] : meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <RecipeCard meal={item} onPress={onPressMeal} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Palette.primary,
    letterSpacing: 1,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  randomPressed: {
    opacity: 0.8,
  },
  randomText: {
    color: Palette.textOnPrimary,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: Palette.text,
    fontSize: 16,
  },
  chipsRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  chipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    color: Palette.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextActive: {
    color: Palette.textOnPrimary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
    gap: 8,
  },
  stateTitle: {
    color: Palette.text,
    fontSize: 20,
    fontWeight: '900',
  },
  stateText: {
    color: Palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: Palette.danger,
    fontSize: 18,
    fontWeight: '900',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: Palette.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: {
    color: Palette.textOnPrimary,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
