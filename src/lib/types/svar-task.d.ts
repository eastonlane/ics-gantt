import type { IcsEventBase } from 'ts-ics';
import type { ITask } from '@svar-ui/svelte-gantt';

export type AppTask = ITask & { categories: typeof IcsEventBase.categories };
