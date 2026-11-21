import { DAY } from '$lib/const.time';
import type { ConcreteEventFilter } from '$lib/types/ics-event-filter';
import { eventRange, hasOverlap, recentRange } from './helpers';

export function recentDaysFilter(
  days: number = 7,
): ConcreteEventFilter<'recent'> {
  return {
    type: 'recent',
    scope: { kind: 'all' },
    value: days,
    filterFunc: (ev) => {
      return hasOverlap(recentRange(Date.now(), DAY * days), eventRange(ev));
    },
  };
}
