import type {
  CalendarIdType,
  ConcreteEventFilter,
} from '$lib/types/ics-event-filter';

export function categoriesBlackFilter(
  blackList: string[] = [],
  calendarId: CalendarIdType,
): ConcreteEventFilter<'blacklist'> {
  return {
    type: 'blacklist',
    scope: { kind: 'single', calendarId },
    value: blackList,
    filterFunc: (ev) =>
      ev.categories
        ? ev.categories.some((x) => blackList.every((y) => y !== x))
        : true,
  };
}
