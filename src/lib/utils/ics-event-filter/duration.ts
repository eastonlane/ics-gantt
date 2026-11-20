import { DAY } from '$lib/const.time';
import type {
  ConcreteEventFilter,
  EventFilterFunc,
} from '$lib/types/ics-event-filter';

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
