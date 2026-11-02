<script lang="ts">
  import { DAY, HOUR } from '$lib/const.time';
  import type { CustomTooltipContentData } from '$lib/types/svar-comp';
  import type { AppTask } from '$lib/types/svar-task';
  import { format } from 'date-fns';

  type Props = {
    data: CustomTooltipContentData;
  };

  let { data }: Props = $props();

  const mask = 'yyyy.MM.dd';

  function getRemainingTime(end: Date): string {
    const remaining = end.getTime() - new Date().getTime();
    if (remaining <= 0) {
      return 'Finished';
    }
    const remaingDays = Math.floor(remaining / DAY);
    if (remaingDays > 0) {
      return `${remaingDays} days`;
    }
    const remainingHours = Math.floor(remaining / HOUR);
    if (remainingHours > 0) {
      return `${remainingHours} Hours`;
    }
    return 'Less than one hour';
  }
</script>

{#snippet row(label: string, value: string | undefined)}
  <div class="wx-row">
    <span class="wx-label">{label}:</span>
    <span class="wx-value">{value}</span>
  </div>
{/snippet}

{#if 'task' in data}
  {@const task = data.task as AppTask}
  <div class="data">
    {@render row('Name', task.text)}
    {#if task.start}
      {@render row('Start date', format(task.start, mask))}
    {/if}
    {#if task.end}
      {@render row('End date', format(task.end, mask))}
      {@render row('Remaining time', getRemainingTime(task.end))}
    {/if}
  </div>
{/if}

<style>
  .data {
    white-space: nowrap;
    background-color: var(--wx-tooltip-background);
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .wx-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-family: var(--wx-font-family);
    font-size: 13px;
    color: var(--wx-color-primary-font);
  }

  .wx-label {
    font-weight: normal;
  }

  .wx-value {
    font-weight: 600;
  }
</style>
