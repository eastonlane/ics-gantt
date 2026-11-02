import { en, cn } from '@svar-ui/gantt-locales';
import { cn as cnCore, en as enCore } from '@svar-ui/core-locales';
import type { SupportedLocale } from '$lib/types/locale';

interface LocaleObject {
  localeUI: typeof en;
  localeCore: typeof enCore;
}

const localeMap: Record<SupportedLocale, LocaleObject> = {
  en: {
    localeUI: en,
    localeCore: enCore,
  },
  'zh-CN': {
    localeUI: { ...cn, gantt: { ...cn.gantt, Duration: '持续时间' } },
    localeCore: cnCore,
  },
};
export function getLocaleUI(locale: SupportedLocale) {
  return localeMap[locale].localeUI;
}
export function getLocaleCore(locale: SupportedLocale) {
  return localeMap[locale].localeCore;
}
