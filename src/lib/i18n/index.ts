// i18n/index.ts
import { langKey } from '$lib/const';
import i18next from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import en from './en';
import zhCN from './zh-CN';

void i18next.init({
  resources: { en: { translation: en }, 'zh-CN': { translation: zhCN } },
  lng: localStorage.getItem(langKey) ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18next.services.formatter?.add('bold', (value) => {
  return `<strong>${value}</strong>`;
});

const i18n = createI18nStore(i18next);
export { i18next };
export default i18n;
