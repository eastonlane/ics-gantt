import { getCurrentEnv } from '$lib/env';
import type {
  AppIcsCalendar,
  BaseCalendar,
  StoredCalendar,
  StoredCalendarInput,
} from '$lib/types/data';
import { writable } from 'svelte/store';
import { convertIcsCalendar } from 'ts-ics';
import * as tauri from './data-tauri';
import * as web from './data-web';

export const storedCalendarStore = writable<StoredCalendar[]>([]);
export const appCalendarStore = writable<AppIcsCalendar[]>([]); // TODO: lazy load ics calendar

let inited = false;
export function initStore() {
  if (inited) {
    return;
  }
  storedCalendarStore.subscribe((stored) => {
    Promise.all(
      stored.map(async (calendar) => {
        const icsContent = new TextDecoder().decode(
          await readIcsContents(calendar),
        );
        const icsCalendar = convertIcsCalendar(undefined, icsContent);
        return {
          ...calendar,
          icsCalendar,
          created: new Date(calendar.created),
        } as AppIcsCalendar;
      }),
    ).then((x) => appCalendarStore.set(x));
  });
  inited = true;
}

/**
 * add a new calendar to the store
 * @param calendar the calendare to added
 * @returns the stored calendar list after this action
 */
export async function addStoredCalendar(
  calendar: StoredCalendar,
): Promise<StoredCalendar[]> {
  let result: StoredCalendar[] = [];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.addStoredCalendar(calendar);
      break;
    case 'web':
      result = web.addStoredCalendar(calendar);
      break;
  }
  storedCalendarStore.set(result);
  return result;
}

export async function updateStoredCalendar(
  name: string,
  value: BaseCalendar,
): Promise<StoredCalendar[]> {
  let result: StoredCalendar[] = [];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.updateStoredCalendar(name, value);
      break;
    case 'web':
      result = web.updateStoredCalendar(name, value);
      break;
  }
  storedCalendarStore.set(result);
  return result;
}

/**
 * Remove a calendar with the given name
 * @param name The name of the calendar to remove
 * @returns The stored calendar list after remove
 */
export async function removeStoredCalendar(
  name: string,
): Promise<StoredCalendar[]> {
  let result: StoredCalendar[] = [];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.removeStoredCalendar(name);
      break;
    case 'web':
      result = web.removeStoredCalendar(name);
      break;
  }
  storedCalendarStore.set(result);
  return result;
}

/**
 * load the calendar stored, containing only the metadata
 * @returns The tracked and stored calendars, without the contents
 */
export async function loadStoredCalendars(): Promise<StoredCalendar[]> {
  let result: StoredCalendar[];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.loadStoredCalendars();
      break;
    case 'web':
      result = web.loadStoredCalendars();
      break;
    default:
      return [];
  }
  storedCalendarStore.set(result);
  return result;
}

/**
 * Only for file calendar in `tauri` env. Persist the ICS file content.
 * @param name The calendar name
 * @param contents The calendar contents
 * @returns the path where the ICS file is stored in the device.
 */
export function saveIcsContents(
  name: string,
  contents: ArrayBuffer,
): Promise<string> {
  switch (getCurrentEnv()) {
    case 'tauri':
      return tauri.saveIcsContents(name, contents);
    case 'web':
      throw new Error("web mode doesn't support local calendar");
  }
}

/**
 * Read the calendar content.
 * @param calendar the calendar
 * @returns The raw content bytes.
 */
export function readIcsContents(calendar: BaseCalendar): Promise<Uint8Array> {
  switch (getCurrentEnv()) {
    case 'tauri':
      return tauri.readIcsContents(calendar);
    case 'web':
      return web.readIcsContents(calendar);
  }
}
/**
 * load calendar and enrich the content. This is for UI layer.
 * @returns Calendar list containing both calendar metadata and contents.
 */
export async function restoreCalendars(): Promise<StoredCalendar[]> {
  let result: StoredCalendar[];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.restoreCalendars();
      break;
    case 'web':
      result = web.restoreCalendars();
      break;
  }
  storedCalendarStore.set(result);
  return result;
}

export async function updateCalendarsVisibility(
  visiableCalendarName: string[],
) {
  appCalendarStore.update((it) =>
    it.map(
      (calendar) =>
        (visiableCalendarName.find((x) => x === calendar.name)
          ? { ...calendar, isVisible: true }
          : { ...calendar, isVisible: false }) as AppIcsCalendar,
    ),
  );
}
