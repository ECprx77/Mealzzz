import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecipeCard, type RecipeCardData } from '@/components/recipe-card';
import { Palette } from '@/constants/theme';
import { selectFavorites } from '@/store/favoritesSlice';
import { useAppSelector } from '@/store/hooks';

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = useAppSelector(selectFavorites);

  const onPressMeal = useCallback(
    (meal: RecipeCardData) => {
      router.push(`/recipe/${meal.idMeal}`);
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        {favorites.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favorites.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <RecipeCard meal={item} onPress={onPressMeal} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>No favorites yet</Text>
            <Text style={styles.stateText}>
              Tap the heart on a recipe to keep it in your den.
            </Text>
          </View>
        }
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
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Palette.primary,
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: Palette.accent,
    borderRadius: 999,
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    color: Palette.textOnPrimary,
    fontWeight: '900',
    fontSize: 13,
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
});
