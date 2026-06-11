import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.subtitle}>Favorites screen coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: Palette.primary,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Palette.textMuted,
  },
});
