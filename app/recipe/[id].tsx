import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { selectMealById } from '@/store/recipesSlice';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meal = useAppSelector(selectMealById(id));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: meal?.strMeal ?? 'Recipe' }} />
      <Text style={styles.title}>{meal?.strMeal ?? `Recipe #${id}`}</Text>
      <Text style={styles.subtitle}>Full details coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Palette.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Palette.textMuted,
  },
});
