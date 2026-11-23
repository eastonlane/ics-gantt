import type {
  CalendarIdType,
  ConcreteEventFilter,
} from '$lib/types/ics-event-filter';

export function categoriesBlackFilter(
  blackList: string[] = [],
  calendarId: CalendarIdType,
): ConcreteEventFilter<'blacklist'> {
  const value = [...blackList];
  return {
    type: 'blacklist',
    scope: { kind: 'single', calendarId },
    value,
    filterFunc: (ev) =>
      ev.categories
        ? ev.categories.some((x) => value.every((y) => y !== x))
        : true,
  };
}
