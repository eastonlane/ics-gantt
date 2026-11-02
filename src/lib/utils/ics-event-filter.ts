import { DAY } from '$lib/const.time';
import type { IcsEvent } from 'ts-ics';

export type EventFilterType =
  'duration' | 'recent' | 'range' | 'whitelist' | 'blacklist';
export type EventFilter = (date: IcsEvent) => boolean;
export type EventFilterWithId = {
  type: EventFilterType;
  filter: EventFilter;
};

export function categoriesWhiteFilter(whiteList: string[] = []): EventFilter {
  return (ev) =>
    ev.categories
      ? ev.categories.some((x) => whiteList.some((y) => y === x))
      : false;
}

export function categoriesBlackFilter(blackList: string[] = []): EventFilter {
  return (ev) =>
    ev.categories
      ? ev.categories.some((x) => blackList.every((y) => y !== x))
      : true;
}

export function recentFilter(days: number = 7): EventFilter {
  return (ev) => {
    const now = Date.now();
    const threshold = DAY * days;

    const isStartWithinFuture = ev.start.date.getTime() <= now + threshold;
    const isEndWithinPast = ev.end
      ? ev.end.date.getTime() >= now - threshold
      : false;

    return isStartWithinFuture && isEndWithinPast;
  };
}

export function dayDurationFilter(maxDurationInDay: number): EventFilter {
  return durationFilter(maxDurationInDay * DAY);
}

function durationFilter(maxDurationMs: number): EventFilter {
  return (ev) => {
    if (!ev.end) {
      return true;
    }
    const duration = ev.end.date.getTime() - ev.start.date.getTime();
    return duration <= maxDurationMs;
  };
}

export function rangeFilter(
  start: Date | undefined, // inclusive
  end: Date | undefined, // inclusive
): EventFilter | undefined {
  if (!start && !end) {
    return;
  }
  return (ev) => {
    const startTime = start && Math.floor(start.getTime() / DAY) * DAY;
    if (startTime && ev.start.date.getTime() < startTime) {
      return false;
    }
    const endTime = end && Math.floor(end.getTime() / DAY + 1) * DAY - 1;
    if (endTime && ev.end && ev.end.date.getTime() > endTime) {
      return false;
    }
    return true;
  };
}
