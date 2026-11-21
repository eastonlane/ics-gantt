import { type IcsCalendar } from 'ts-ics';

export interface BaseFileCalendar {
  type: 'file';
  name: string;
  path: string;
}

export interface AppFileCalendar extends BaseFileCalendar {
  icsCalendar: IcsCalendar;
  created: Date;
  isVisible?: boolean;
}

export interface StoredFileCalendar extends BaseFileCalendar {
  created: number;
}
export interface BaseUrlCalendar {
  type: 'url';
  path: string;
  name: string;
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
