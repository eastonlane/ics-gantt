import type { SupportedLocale } from '$lib/types/locale';

export function createAppState() {
  let locale = $state<SupportedLocale>('en');

  return {
    get locale() {
      return locale;
    },
    set locale(value: SupportedLocale) {
      locale = value;
    },
  };
}
