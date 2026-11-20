import { DAY } from '$lib/const.time';
import type { ConcreteEventFilter } from '$lib/types/ics-event-filter';
import { getLocalTimeZone, type DateValue } from '@internationalized/date';

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
