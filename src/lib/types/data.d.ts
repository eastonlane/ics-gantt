import { type IcsCalendar } from 'ts-ics';

export type CalendarType = 'url' | 'file';

export interface BaseCalendar {
  id: string;
  name: string;
  path: string;
  type: CalendarType;
}

export interface BaseFileCalendar extends BaseCalendar {
  type: 'file';
}

export interface AppFileCalendar extends BaseFileCalendar {
  icsCalendar: IcsCalendar;
  created: Date;
  isVisible?: boolean;
}

export interface StoredFileCalendar extends BaseFileCalendar {
  created: number;
}
export interface BaseUrlCalendar extends BaseCalendar {
  type: 'url';
  url: string;
}

export interface AppUrlCalendar extends BaseUrlCalendar {
  icsCalendar: IcsCalendar;
  created: Date;
  lastSync: Date; // UTC
  isVisible?: boolean;
}

export interface StoredUrlCalendar extends BaseUrlCalendar {
  created: number;
  lastSync: number;
}

export type BaseCalendar = BaseFileCalendar | BaseUrlCalendar;
export type AppIcsCalendar = AppFileCalendar | AppUrlCalendar;
export type StoredCalendar = StoredFileCalendar | StoredUrlCalendar;

type StoredCalendarInput =
  | (Omit<StoredFileCalendar, 'id'> & { id?: string })
  | (Omit<StoredUrlCalendar, 'id'> & { id?: string });
