import type {
  CalendarIdType,
  ConcreteEventFilter,
} from '$lib/types/ics-event-filter';

export function categoriesWhiteFilter(
  whiteList: string[] = [],
  calendarId: CalendarIdType,
): ConcreteEventFilter<'whitelist'> {
  return {
    type: 'whitelist',
    scope: { kind: 'single', calendarId },
    value: whiteList,
    filterFunc: (ev) =>
      ev.categories
        ? ev.categories.some((x) => whiteList.some((y) => y === x))
        : false,
  };
}
