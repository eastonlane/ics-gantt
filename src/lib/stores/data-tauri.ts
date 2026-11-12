import { invoke } from '@tauri-apps/api/core';
import type { BaseCalendar, StoredCalendar } from './model';

export function addStoredCalendar(
  calendar: StoredCalendar,
): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('add_calendar', {
    calendar,
  });
}

export function removeStoredCalendar(name: string): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('remove_calendar', {
    name,
  });
}

export async function updateStoredCalendar(
  name: string,
  value: BaseCalendar,
): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('update_calendar', {
    name,
    calendar: value,
  });
}

export function loadStoredCalendars(): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('list_calendars');
}

export async function saveIcsContents(
  name: string,
  contents: ArrayBuffer,
): Promise<string> {
  return invoke<string>('save_ics_file', {
    name,
    contents: Array.from(new Uint8Array(contents)),
  });
}

export async function readIcsContents({
  path,
}: BaseCalendar): Promise<Uint8Array> {
  const bytes = await invoke<number[]>('read_ics_file', { path });
  return new Uint8Array(bytes);
}

export function restoreCalendars(): Promise<StoredCalendar[]> {
  return loadStoredCalendars();
}
