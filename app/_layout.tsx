import { DarkTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-reanimated';

import { Palette } from '@/constants/theme';
import { persistor, store } from '@/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

const JungleTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Palette.primary,
    background: Palette.background,
    card: Palette.surface,
    text: Palette.text,
    border: Palette.border,
    notification: Palette.accent,
  },
};

function BootSplash() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Palette.background,
      }}>
      <ActivityIndicator size="large" color={Palette.primary} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<BootSplash />} persistor={persistor}>
        <ThemeProvider value={JungleTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="recipe/[id]"
              options={{ title: 'Recipe', headerTintColor: Palette.primary }}
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
