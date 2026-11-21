import { DAY } from '$lib/const.time';
import type {
  ConcreteEventFilter,
  EventFilterFunc,
} from '$lib/types/ics-event-filter';
import { eventRange } from './helpers';

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
    const range = eventRange(ev);
    const duration = range.end - range.start;
    return duration <= maxDurationMs;
  };
}
