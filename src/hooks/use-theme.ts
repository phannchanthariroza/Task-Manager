/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/preferences';

export function useTheme() {
  const { colorScheme } = usePreferences();
  return Colors[colorScheme];
}
