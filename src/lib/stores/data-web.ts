import * as webapi from '$lib/api/http-web';
import type { BaseCalendar, StoredCalendar } from './model';

const calendarStorageKey = 'calendars';

export function addStoredCalendar(calendar: StoredCalendar): StoredCalendar[] {
  const added = loadStoredCalendars();
  added.push(calendar);
  localStorage.setItem(calendarStorageKey, JSON.stringify(added));
  return added;
}

export function removeStoredCalendar(name: string): StoredCalendar[] {
  const removed = loadStoredCalendars().filter((x) => x.name !== name);
  localStorage.setItem(calendarStorageKey, JSON.stringify(removed));
  return removed;
}

export function updateStoredCalendar(
  name: string,
  value: BaseCalendar,
): StoredCalendar[] {
  const updated = loadStoredCalendars().map((x) =>
    x.name !== name ? x : { ...x, name: value.name },
  );
  localStorage.setItem(calendarStorageKey, JSON.stringify(updated));
  return updated;
}

export function loadStoredCalendars(): StoredCalendar[] {
  const stored = localStorage.getItem(calendarStorageKey);
  if (!stored?.length) {
    return [];
  }
  return JSON.parse(stored);
}

export async function readIcsContents(
  calendar: BaseCalendar,
): Promise<Uint8Array> {
  if (calendar.type == 'file') {
    throw new Error('unsupported local file calendar');
  }
  return await webapi.getCalendarContent(calendar.url);
}

export function restoreCalendars(): StoredCalendar[] {
  return loadStoredCalendars();
}
