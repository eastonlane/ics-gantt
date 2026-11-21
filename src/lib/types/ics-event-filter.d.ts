import { type DateValue } from '@internationalized/date';
import type { IcsEvent } from 'ts-ics';

export type EventFilterType =
  'duration' | 'recent' | 'range' | 'whitelist' | 'blacklist';

type ConcreteEventFilter<T extends EventFilterType> = Extract<
  EventFilter,
  { type: T }
>;

export type EventFilter = EventFilterIndentity & {
  filterFunc: EventFilterFunc;
} & EventFilterMetadata;

export type EventFilterFunc = (date: IcsEvent) => boolean;

export interface EventFilterIndentity {
  type: EventFilterType;
  scope: EventFilterScopeType;
}

export type EventFilterScopeType = EventFilterScopeAll | EventFilterScopeSingle;

export type EventFilterScopeAll = { kind: 'all' };

export type CalendarIdType = string;

export type EventFilterScopeSingle = {
  kind: 'single';
  calendarId: CalendarIdType;
};

export type EventFilterMetadata =
  | {
      type: 'duration';
      value: number;
    }
  | {
      type: 'range';
      start: DateValue | undefined;
      end: DateValue | undefined;
    }
  | {
      type: 'recent';
      value: number;
    }
  | {
      type: 'whitelist';
      value: string[];
    }
  | {
      type: 'blacklist';
      value: string[];
    };

export interface DateRange {
  start: number; //Inclusive
  end: number; //Inclusive
}
