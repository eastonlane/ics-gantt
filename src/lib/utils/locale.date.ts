import type { SupportedLocale } from '$lib/types/locale';

/**
 * Returns the format string for the Day scale (e.g., the numbers at the bottom of the timeline).
 * EN: "1", "2", "3" (Day of month)
 * ZH: "1日", "2日", "3日" (Day of month with Chinese character)
 */
export function getDayFormat(locale: SupportedLocale): string {
  switch (locale) {
    case 'zh-CN':
      return '%j日'; // %j is day of month (1-31)
    case 'en':
    default:
      return '%j';
  }
}

/**
 * Returns the format string for the Month scale (e.g., the top row of the timeline).
 * EN: "January 2024", "February 2024"
 * ZH: "2024年1月", "2024年2月"
 */
export function getYearMonthFormat(locale: SupportedLocale): string {
  switch (locale) {
    case 'zh-CN':
      return '%Y年%n月'; // %Y is year, %n is month number
    case 'en':
    default:
      return '%F %Y'; // %F is full month name (January), %Y is year
  }
}

export function formatDateTime(dateTime: Date, locale: SupportedLocale) {
  return Intl.DateTimeFormat(locale).format(dateTime);
}
