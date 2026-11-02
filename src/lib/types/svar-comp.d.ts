import { ComponentProps } from 'svelte';
import { Tooltip } from '@svar-ui/svelte-gantt';

type CustomTooltipContentData = ComponentProps<
  ComponentProps<typeof Tooltip>['content']
>['data'];
