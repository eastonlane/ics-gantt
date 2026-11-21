//TODO: all these operation need error check
import { getCurrentEnv } from '$lib/env';
import type {
  AppIcsCalendar,
  BaseCalendar,
  StoredCalendar,
  StoredCalendarInput,
} from '$lib/types/data';
import * as uuidTauri from '@marrionesa/plugin-uuid';
import { writable } from 'svelte/store';
import { convertIcsCalendar } from 'ts-ics';
import * as uuidWeb from 'uuid';
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
 * Reset the store data, including the calendar metadata and managed ICS file(tauri mode).
 * @returns nothing
 */
export async function resetStore(): Promise<void> {
  switch (getCurrentEnv()) {
    case 'tauri':
      return await tauri.resetStore();
    case 'web':
      return web.resetStore();
  }
}

/**
 * add a new calendar to the store
 * @param input the calendare to added, allow no calendar id
 * @returns the stored calendar list after this action
 */
export async function addStoredCalendar(
  input: StoredCalendarInput,
): Promise<StoredCalendar[]> {
  const calendar = await ensureCalendarId(input);
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
  id: string,
  value: BaseCalendar,
): Promise<StoredCalendar[]> {
  let result: StoredCalendar[] = [];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.updateStoredCalendar(id, value);
      break;
    case 'web':
      result = web.updateStoredCalendar(id, value);
      break;
  }
  storedCalendarStore.set(result);
  return result;
}

/**
 * Remove a calendar with the given id
 * @param id The id of the calendar to remove
 * @returns The stored calendar list after remove
 */
export async function removeStoredCalendar(
  id: string,
): Promise<StoredCalendar[]> {
  let result: StoredCalendar[] = [];
  switch (getCurrentEnv()) {
    case 'tauri':
      result = await tauri.removeStoredCalendar(id);
      break;
    case 'web':
      result = web.removeStoredCalendar(id);
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
 * @param id The calendar id
 * @param contents The calendar contents
 * @returns the path where the ICS file is stored in the device.
 */
export function saveIcsContents(
  id: string,
  contents: ArrayBuffer,
): Promise<string> {
  switch (getCurrentEnv()) {
    case 'tauri':
      return tauri.saveIcsContents(id, contents);
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
  visiableCalendarIdList: string[],
) {
  appCalendarStore.update((it) =>
    it.map(
      (calendar) =>
        (visiableCalendarIdList.find((x) => x === calendar.id)
          ? { ...calendar, isVisible: true }
          : { ...calendar, isVisible: false }) as AppIcsCalendar,
    ),
  );
}

async function newCalendarId(): Promise<string> {
  switch (getCurrentEnv()) {
    case 'tauri':
      return await uuidTauri.v7();
    case 'web':
      return uuidWeb.v7();
  }
}

async function ensureCalendarId(
  calendar: StoredCalendarInput,
): Promise<StoredCalendar> {
  const id = calendar.id?.length ? calendar.id : await newCalendarId();
  return {
    ...calendar,
    id,
  };
}
