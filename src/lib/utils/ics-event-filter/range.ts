import type { ConcreteEventFilter } from '$lib/types/ics-event-filter';
import { type DateValue } from '@internationalized/date';
import { endOfDay, startOfDay } from 'date-fns';
import { eventRange, hasOverlap, toEpochMs } from './helpers';

export function dateRangeFilter(
  startTime: DateValue | undefined, // inclusive
  endTime: DateValue | undefined, // inclusive
): ConcreteEventFilter<'range'> | undefined {
  if (!startTime && !endTime) {
    return;
  }
  return {
    type: 'range',
    scope: { kind: 'all' },
    start: startTime,
    end: endTime,
    filterFunc: (ev) => {
      const start = startTime
        ? startOfDay(toEpochMs(startTime)).getTime()
        : -Infinity;
      const end = endTime ? endOfDay(toEpochMs(endTime)).getTime() : Infinity;
      return hasOverlap({ start, end }, eventRange(ev));
    },
  };
}
