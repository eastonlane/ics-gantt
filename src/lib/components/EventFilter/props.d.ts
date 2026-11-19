import type { SupportedLocale } from '$lib/types/locale';
import type {
    EventFilter,
    EventFilterIndentity
} from '$lib/utils/ics-event-filter';

export interface Props {
  onadd: (filter: EventFilter) => void;
  onremove: (f: EventFilterIndentity) => void;
  isEdit?: bool;
  locale?: SupportedLocale = "en";
}
