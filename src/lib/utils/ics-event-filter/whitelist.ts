import type {
  CalendarIdType,
  ConcreteEventFilter,
} from '$lib/types/ics-event-filter';

export function categoriesWhiteFilter(
  whiteList: string[] = [],
  calendarId: CalendarIdType,
): ConcreteEventFilter<'whitelist'> {
  const value = [...whiteList];
  return {
    type: 'whitelist',
    scope: { kind: 'single', calendarId },
    value,
    filterFunc: (ev) =>
      ev.categories
        ? ev.categories.some((x) => value.some((y) => y === x))
        : false,
  };
}
