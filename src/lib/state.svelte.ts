import type { SupportedLocale } from '$lib/types/locale';

export function createAppState() {
  let isDarkTheme = $state(false);
  let locale = $state<SupportedLocale>('en');

  return {
    get isDarkTheme() {
      return isDarkTheme;
    },
    set isDarkTheme(value: boolean) {
      isDarkTheme = value;
    },

    get locale() {
      return locale;
    },
    set locale(value: SupportedLocale) {
      locale = value;
    },
  };
}
