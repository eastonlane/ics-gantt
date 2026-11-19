<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import i18n from '$lib/i18n';
  import type { SupportedLocale } from '$lib/types/locale';
  import type { AppTask } from '$lib/types/svar-task';
  import { getDayFormat, getYearMonthFormat } from '$lib/utils/locale.date';
  import { getLocaleCore, getLocaleUI } from '$lib/utils/locale.svar';
  import { Locale } from '@svar-ui/svelte-core';
  import {
    Gantt,
    Tooltip,
    Willow,
    WillowDark,
    type IApi,
    type IColumnConfig,
  } from '@svar-ui/svelte-gantt';
  import type { IcsEvent } from 'ts-ics';
  import CustomTooltip from './CustomTooltip.svelte';

  interface IProperty {
    events: IcsEvent[];
    locale: SupportedLocale;
    isDark: boolean;
  }

  let { events, isDark = false, locale = 'en' }: IProperty = $props();

  let localeUI = $derived(getLocaleUI(locale));
  let localeCore = $derived(getLocaleCore(locale));

  let tasks = $derived<AppTask[]>(
    events.map((ev, idx) => ({
      id: idx + 1,
      text: ev.summary,
      start: ev.start.date,
      end: ev.end?.date,
      duration: ev.end ? ev.end.date.getDay() - ev.end.date.getDay() : 0,
      progress: 0,
      type: 'task',
      lazy: false,
      categories: ev.categories,
      description: ev.description,
    })),
  );
  let scales = $derived([
    { unit: 'month', step: 1, format: getYearMonthFormat(locale) },
    { unit: 'day', step: 2, format: getDayFormat(locale) },
  ]);
  let columns = $derived<false | Array<IColumnConfig> | undefined>([
    {
      id: 'text',
      header: $i18n.t('chart.taskName'),
      width: 120,
      flexgrow: 2,
    },
  ]);

  let ganttApi = $state<IApi>();
  $effect(() => {
    if (ganttApi) {
      scrollToDate(new Date());
    }
  });
  function scrollToDate(date: Date) {
    ganttApi?.exec('scroll-chart', { date: date });
  }
</script>

{#snippet chart()}
  {#key locale}
    <Locale words={{ ...localeUI, ...localeCore }}>
      <Tooltip api={ganttApi} content={CustomTooltip} touch={true}>
        <Gantt
          {tasks}
          {scales}
          {columns}
          readonly={true}
          cellHeight={90}
          bind:this={ganttApi}
        />
      </Tooltip>
    </Locale>
  {/key}
{/snippet}

<div class="gantt-wrapper">
  <div class="chart-control">
    <Button onclick={() => scrollToDate(new Date())}
      >{$i18n.t('chart.today')}</Button
    >
  </div>
  <div class="min-h-0">
    {#if isDark}
      <WillowDark>
        {@render chart()}
      </WillowDark>
    {:else}
      <Willow>
        {@render chart()}
      </Willow>
    {/if}
  </div>
</div>

<style>
  .gantt-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    height: 100%;
    overflow: hidden;
    row-gap: 3vh;
  }

  .chart-control {
    display: flex;
    flex-direction: rows;
    justify-content: left;
    align-items: left;
    gap: 10px;
  }
</style>
