import type {
  CalendarIdType,
  EventFilter,
  EventFilterIndentity,
} from '$lib/types/ics-event-filter';

export function isFilterApplicable({
  filter: f,
  calendarId,
}: {
  filter: EventFilter;
  calendarId?: CalendarIdType;
}): boolean {
  switch (f.scope.kind) {
    case 'all':
      return true;
    case 'single':
      if (!calendarId) return false;
      return f.scope.calendarId === calendarId;
  }
}

export function isSameFilter(
  a: EventFilterIndentity,
  b: EventFilterIndentity,
): boolean {
  if (a.type !== b.type || a.scope.kind != b.scope.kind) {
    return false;
  }
  switch (a.scope.kind) {
    case 'all':
      return true;
    case 'single':
      if (b.scope.kind !== 'single') {
        return false;
      }
      return a.scope.calendarId === b.scope.calendarId;
  }
}
