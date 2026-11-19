import { DAY } from '$lib/const.time';
import { getLocalTimeZone, type DateValue } from '@internationalized/date';
import type { IcsEvent } from 'ts-ics';

export type EventFilterType =
  'duration' | 'recent' | 'range' | 'whitelist' | 'blacklist';
export type CalendarIdType = string;
export type EventFilterFunc = (date: IcsEvent) => boolean;

export type EventFilterScopeAll = { kind: 'all' };
export type EventFilterScopeSingle = {
  kind: 'single';
  calendarId: CalendarIdType;
};
export type EventFilterScopeType = EventFilterScopeAll | EventFilterScopeSingle;
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

export interface EventFilterIndentity {
  type: EventFilterType;
  scope: EventFilterScopeType;
}

export type EventFilter = EventFilterIndentity & {
  filterFunc: EventFilterFunc;
} & (
    | {
        type: 'duration';
        value: number;
      }
    | {
        type: 'range';
        start: DateValue | undefined;
        end: DateValue | undefined;
      }
    | {
        type: 'recent';
        value: number;
      }
    | {
        type: 'whitelist';
        value: string[];
      }
    | {
        type: 'blacklist';
        value: string[];
      }
  );

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

type ConcreteEventFilter<T extends EventFilterType> = Extract<
  EventFilter,
  { type: T }
>;

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

export function recentFilter(days: number = 7): ConcreteEventFilter<'recent'> {
  return {
    type: 'recent',
    scope: { kind: 'all' },
    value: days,
    filterFunc: (ev) => {
      const now = Date.now();
      const threshold = DAY * days;

      const isStartWithinFuture = ev.start.date.getTime() <= now + threshold;
      const isEndWithinPast = ev.end
        ? ev.end.date.getTime() >= now - threshold
        : false;

      return isStartWithinFuture && isEndWithinPast;
    },
  };
}

export function dayDurationFilter(
  maxDurationInDay: number,
): ConcreteEventFilter<'duration'> {
  return {
    type: 'duration',
    scope: { kind: 'all' },
    value: maxDurationInDay,
    filterFunc: durationFilter(maxDurationInDay * DAY),
  };
}

function durationFilter(maxDurationMs: number): EventFilterFunc {
  return (ev) => {
    if (!ev.end) {
      return true;
    }
    const duration = ev.end.date.getTime() - ev.start.date.getTime();
    return duration <= maxDurationMs;
  };
}

export function dateRangeFilter(
  start: DateValue | undefined, // inclusive
  end: DateValue | undefined, // inclusive
): ConcreteEventFilter<'range'> | undefined {
  if (!start && !end) {
    return;
  }
  return {
    type: 'range',
    scope: { kind: 'all' },
    start,
    end,
    filterFunc: (ev) => {
      const startTime =
        start &&
        Math.floor(start.toDate(getLocalTimeZone()).getTime() / DAY) * DAY;
      if (startTime && ev.start.date.getTime() < startTime) {
        return false;
      }
      const endTime =
        end &&
        Math.floor(end.toDate(getLocalTimeZone()).getTime() / DAY + 1) * DAY -
          1;
      if (endTime && ev.end && ev.end.date.getTime() > endTime) {
        return false;
      }
      return true;
    },
  };
}
