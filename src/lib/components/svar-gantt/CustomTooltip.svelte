<script lang="ts">
  import { DAY, HOUR } from '$lib/const.time';
  import i18n from '$lib/i18n';
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
      return $i18n.t('chart.tooltip.finished');
    }
    const remainingDays = Math.floor(remaining / DAY);
    if (remainingDays > 0) {
      return $i18n.t('chart.tooltip.remainingDays', {
        count: remainingDays,
      });
    }
    const remainingHours = Math.floor(remaining / HOUR);
    if (remainingHours > 0) {
      return $i18n.t('chart.tooltip.remainingHours', {
        count: remainingHours,
      });
    }
    return $i18n.t('chart.tooltip.lessThanOneHour');
  }
</script>

{#snippet row(label: string, value: string | undefined)}
  <div class="wx-row">
    <span class="wx-label">{label}:</span>
    <p class="font-semifold max-w-[400px] break-words">{value}</p>
  </div>
{/snippet}

{#if 'task' in data}
  {@const task = data.task as AppTask}
  <div class="data">
    {@render row($i18n.t('chart.tooltip.name'), task.text)}
    {#if task.start}
      {@render row(
        $i18n.t('chart.tooltip.startDate'),
        format(task.start, mask),
      )}
    {/if}
    {#if task.end}
      {@render row($i18n.t('chart.tooltip.endDate'), format(task.end, mask))}
      {@render row(
        $i18n.t('chart.tooltip.remainingTime'),
        getRemainingTime(task.end),
      )}
    {/if}
    {#if task.description?.length}
      {@render row($i18n.t('chart.tooltip.description'), task.description)}
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
</style>
