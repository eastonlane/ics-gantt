import type { ITask } from '@svar-ui/svelte-gantt';

interface AppTaskExt {
  description?: string;
  categories: typeof IcsEventBase.categories;
}

export type AppTask = ITask & AppTaskExt;
