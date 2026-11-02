import type { SupportedLocale } from '$lib/types/locale';
import type {
    EventFilterType,
    EventFilterWithId,
} from '$lib/utils/ics-event-filter';

export interface Props {
  onadd: (filter: EventFilterWithId) => void;
  onremove: (type: EventFilterType) => void;
  isEdit?: bool;
  locale?: SupportedLocale = "en";
}
