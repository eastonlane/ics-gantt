import type { BaseCalendar, StoredCalendar } from '$lib/types/data';
import { invoke } from '@tauri-apps/api/core';

export async function resetStore(): Promise<void> {
  return invoke<void>('reset_store');
}

export function addStoredCalendar(
  calendar: StoredCalendar,
): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('add_calendar', {
    calendar,
  });
}

export function removeStoredCalendar(id: string): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('remove_calendar', {
    id,
  });
}

export async function updateStoredCalendar(
  id: string,
  value: BaseCalendar,
): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('update_calendar', {
    id,
    calendar: value,
  });
}

export function loadStoredCalendars(): Promise<StoredCalendar[]> {
  return invoke<StoredCalendar[]>('list_calendars');
}

export async function saveIcsContents(
  id: string,
  contents: ArrayBuffer,
): Promise<string> {
  return invoke<string>('save_ics_file', {
    id,
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
