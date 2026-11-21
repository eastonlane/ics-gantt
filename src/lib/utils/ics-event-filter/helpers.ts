import type {
  CalendarIdType,
  DateRange,
  EventFilter,
  EventFilterIndentity,
} from '$lib/types/ics-event-filter';
import type { DateValue } from '@internationalized/date';
import { endOfDay, startOfDay } from 'date-fns';
import type { IcsEvent } from 'ts-ics';

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

/**
 * Note that the left as right are inclusive range index.
 */
export function hasOverlap(a: DateRange, b: DateRange): boolean {
  return a.start <= b.end && b.start <= a.end;
}

export function eventRange(ev: IcsEvent): DateRange {
  const start = ev.start.date.getTime();
  const isAllDay = ev.start.type === 'DATE'; // undefined → false → timed

  if (!ev.end) {
    return {
      start,
      end: isAllDay ? endOfDay(start).getTime() : start,
    };
  }

  const end = ev.end.date.getTime();
  return {
    start: start,
    // all-day DTEND is exclusive, convert to inclusive last millisecond
    end: isAllDay ? endOfDay(end).getTime() : end,
  };
}

export function recentRange(base: number, length: number): DateRange {
  return {
    start: startOfDay(base - length).getTime(),
    end: endOfDay(base + length).getTime(),
  };
}

export function toEpochMs(dv: DateValue, timezone = 'UTC'): number {
  return dv.toDate(timezone).getTime();
}
