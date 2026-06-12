import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

/** Minimal shape needed to render a card: both Meal and MealSummary satisfy it. */
export interface RecipeCardData {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string | null;
  strArea?: string | null;
}

interface RecipeCardProps {
  meal: RecipeCardData;
  onPress: (meal: RecipeCardData) => void;
}

export function RecipeCard({ meal, onPress }: RecipeCardProps) {
  const meta = [meal.strCategory, meal.strArea].filter(Boolean).join(' • ');

  return (
    <Pressable
      onPress={() => onPress(meal)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <Image
        source={{ uri: `${meal.strMealThumb}/medium` }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.strMeal}
        </Text>
        {meta.length > 0 && <Text style={styles.meta}>{meta}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  cardPressed: {
    borderColor: Palette.primary,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 96,
    height: 96,
  },
  body: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: Palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    marginTop: 4,
    color: Palette.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
