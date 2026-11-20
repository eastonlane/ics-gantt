import type {
  CalendarIdType,
  EventFilterScopeAll,
  EventFilterScopeSingle,
} from '$lib/types/ics-event-filter';

export function newEventFilterScopeAll(): EventFilterScopeAll {
  return {
    kind: 'all',
  };
}

export function newEventFilterScopeSingle(
  calendarId: CalendarIdType,
): EventFilterScopeSingle {
  return {
    kind: 'single',
    calendarId,
  };
}
