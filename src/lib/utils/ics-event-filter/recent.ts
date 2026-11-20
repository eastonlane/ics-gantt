import { DAY } from '$lib/const.time';
import type { ConcreteEventFilter } from '$lib/types/ics-event-filter';

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
