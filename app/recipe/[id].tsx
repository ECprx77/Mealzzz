import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { getIngredients } from '@/api/mealdb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';
import { selectFavoriteById, selectIsFavorite, toggleFavorite } from '@/store/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMealById,
  selectDetailError,
  selectDetailStatus,
  selectMealById,
} from '@/store/recipesSlice';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Favorited meals are stored in full, so they keep working without network.
  const cachedMeal = useAppSelector(selectMealById(id));
  const favoriteMeal = useAppSelector(selectFavoriteById(id));
  const meal = cachedMeal ?? favoriteMeal;

  const isFavorite = useAppSelector(selectIsFavorite(id));
  const status = useAppSelector(selectDetailStatus);
  const error = useAppSelector(selectDetailError);

  useEffect(() => {
    dispatch(fetchMealById(id));
  }, [dispatch, id]);

  const onToggleFavorite = useCallback(() => {
    if (meal) {
      dispatch(toggleFavorite(meal));
    }
  }, [dispatch, meal]);

  const openVideo = useCallback(() => {
    if (meal?.strYoutube) {
      WebBrowser.openBrowserAsync(meal.strYoutube);
    }
  }, [meal?.strYoutube]);

  if (!meal) {
    return (
      <View style={styles.stateBox}>
        <Stack.Screen options={{ title: 'Recipe' }} />
        {status === 'failed' ? (
          <>
            <Text style={styles.errorText}>Could not load this recipe</Text>
            <Text style={styles.stateText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => dispatch(fetchMealById(id))}>
              <Text style={styles.retryText}>RETRY</Text>
            </Pressable>
          </>
        ) : (
          <ActivityIndicator size="large" color={Palette.primary} />
        )}
      </View>
    );
  }

  const ingredients = getIngredients(meal);
  const meta = [meal.strCategory, meal.strArea].filter(Boolean) as string[];
  const instructions = (meal.strInstructions ?? '')
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: meal.strMeal,
          headerRight: () => (
            <Pressable onPress={onToggleFavorite} hitSlop={12}>
              <IconSymbol
                size={26}
                name={isFavorite ? 'heart.fill' : 'heart'}
                color={isFavorite ? Palette.accent : Palette.textMuted}
              />
            </Pressable>
          ),
        }}
      />

      <Animated.View entering={FadeIn.duration(400)}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <View style={styles.badgeRow}>
          {meta.map((label) => (
            <View key={label} style={styles.badge}>
              <Text style={styles.badgeText}>{label}</Text>
            </View>
          ))}
        </View>
        {meal.strYoutube ? (
          <Pressable
            style={({ pressed }) => [styles.videoButton, pressed && styles.videoPressed]}
            onPress={openVideo}>
            <IconSymbol size={20} name="play.rectangle.fill" color={Palette.textOnPrimary} />
            <Text style={styles.videoText}>WATCH VIDEO</Text>
          </Pressable>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsCard}>
          {ingredients.map((ingredient, index) => (
            <View
              key={`${ingredient.name}-${index}`}
              style={[styles.ingredientRow, index > 0 && styles.ingredientDivider]}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientMeasure}>{ingredient.measure}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {instructions.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  content: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 260,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Palette.text,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  badge: {
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.accent,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 16,
  },
  videoPressed: {
    opacity: 0.8,
  },
  videoText: {
    color: Palette.textOnPrimary,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Palette.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ingredientsCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 14,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  ingredientDivider: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  ingredientName: {
    color: Palette.text,
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  ingredientMeasure: {
    color: Palette.textMuted,
    fontSize: 14,
  },
  paragraph: {
    color: Palette.text,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 12,
  },
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background,
    padding: 32,
    gap: 8,
  },
  errorText: {
    color: Palette.danger,
    fontSize: 18,
    fontWeight: '900',
  },
  stateText: {
    color: Palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
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
