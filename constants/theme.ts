/**
 * SMDpreppers jungle theme.
 * Dark, leafy and bold: deep forest backgrounds, vivid leaf green primary,
 * fierce amber/orange accent for strong call-to-actions.
 */

import { Platform } from 'react-native';

export const Palette = {
  // Backgrounds
  background: '#0B130A', // near-black forest floor
  surface: '#15200F', // dark moss card
  surfaceRaised: '#1C2B14',
  border: '#2E4220',

  // Brand
  primary: '#58C322', // vivid leaf green
  primaryDark: '#3B8A14',
  accent: '#FF7A1A', // fierce tiger orange
  danger: '#E5484D',

  // Text
  text: '#EDF6E5',
  textMuted: '#9DB38C',
  textOnPrimary: '#081203',
};

// Kept in light/dark shape for compatibility with the color-scheme hooks,
// but SMDpreppers is dark-only: both map to the jungle palette.
export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.background,
    tint: Palette.primary,
    icon: Palette.textMuted,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.primary,
  },
  dark: {
    text: Palette.text,
    background: Palette.background,
    tint: Palette.primary,
    icon: Palette.textMuted,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
