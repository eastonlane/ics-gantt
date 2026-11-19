<script lang="ts">
  import {
    EventCategoriesBlackFilterComp,
    EventCategoriesWhiteFilterComp,
    EventDurationFilterComp,
    EventRangeFilterComp,
    EventRecentFilterComp,
  } from '$lib/components/EventFilter';
  import { CalendarPageSidebar } from '$lib/components/sidebar';
  import SVARGanttChart from '$lib/components/svar-gantt/SVARGanttChart.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Select from '$lib/components/ui/select';
  import { appStateKey } from '$lib/const';
  import i18n from '$lib/i18n';
  import type { createAppState } from '$lib/state.svelte';
  import { appCalendarStore } from '$lib/stores/data';
  import { sidebarContent } from '$lib/stores/sidebar';
  import type {
    EventFilterType,
    EventFilterWithId,
  } from '$lib/utils/ics-event-filter';
  import { getContext, onMount } from 'svelte';
  import { type IcsCalendar } from 'ts-ics';

  let appState = getContext<ReturnType<typeof createAppState>>(appStateKey);
  let locale = $derived(appState.locale);

  onMount(() => {
    sidebarContent.set(sidebar);
    return () => {
      sidebarContent.set(null);
    };
  });

  let icsCalendar = $derived.by<IcsCalendar | null>(() => {
    if (!$appCalendarStore.length) {
      return null;
    }
    const item = $appCalendarStore.find((x) => x.isVisible);
    if (!item) {
      return null;
    }
    return item.icsCalendar;
  });
  let icsEvents = $derived(
    (icsCalendar?.events ?? []).filter((x) =>
      x.end ? x.end >= x.start : true,
    ),
  );
  let events = $derived(
    icsEvents.filter(
      (x) =>
        filters.values().reduce((cur, f) => cur && f.filter(x), true) ?? true,
    ),
  );

  let categories = $derived([
    ...icsEvents
      .flatMap((x) => x.categories ?? [])
      .reduce((cur, val) => cur.add(val), new Set<string>()),
  ]);

  const filterTypeItems = $derived([
    { value: 'recent', label: $i18n.t('filters.recent') },
    { value: 'duration', label: $i18n.t('filters.duration') },
    { value: 'range', label: $i18n.t('filters.range') },
    { value: 'blacklist', label: $i18n.t('filters.blacklist') },
    { value: 'whitelist', label: $i18n.t('filters.whitelist') },
  ]);
  let selectedFilterType = $state<EventFilterType>();
  let filters = $state<EventFilterWithId[]>([]);
  function appendFilter(f: EventFilterWithId) {
    filters = [...filters.filter((x) => x.type !== f.type), f];
  }
  function removeFilter(filterType: EventFilterType) {
    filters = filters.filter((x) => x.type !== filterType);
  }
</script>

{#snippet sidebar()}
  <CalendarPageSidebar />
{/snippet}

<div class="page-container">
  {#if icsCalendar?.events}
    <div class="gantt-wrapper">
      <div class="tool-bar">
        <Select.Root
          type="single"
          bind:value={selectedFilterType}
          items={filterTypeItems}
        >
          <Select.Trigger class="w-45">
            <Select.Value placeholder={$i18n.t('filters.placeholder')} />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each filterTypeItems as item (item)}
                <Select.Item value={item.value}>
                  {item.label}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Button disabled={!filters?.length} onclick={() => (filters = [])}
          >{$i18n.t('filters.resetFilters')}</Button
        >
        {#if selectedFilterType === 'recent'}
          <EventRecentFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            isEdit={filters.find((x) => x.type === selectedFilterType)}
          />
        {:else if selectedFilterType === 'duration'}
          <EventDurationFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            isEdit={filters.find((x) => x.type === selectedFilterType)}
          />
        {:else if selectedFilterType === 'range'}
          <EventRangeFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            isEdit={filters.find((x) => x.type === selectedFilterType)}
          />
        {:else if selectedFilterType === 'whitelist'}
          <EventCategoriesWhiteFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            {categories}
            isEdit={filters.find((x) => x.type === selectedFilterType)}
          />
        {:else if selectedFilterType === 'blacklist'}
          <EventCategoriesBlackFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            {categories}
            isEdit={filters.find((x) => x.type === selectedFilterType)}
          />
        {/if}
      </div>

      <SVARGanttChart {events} {locale} isDark={appState.isDarkTheme} />
    </div>
  {:else}
    <!-- <div>
      <Button onclick={(_) => fileInputRef?.click()}>Upload</Button>
      <input
        style="display: none"
        type="file"
        accept=".ics"
        bind:files
        bind:this={fileInputRef}
      />
    </div> -->
  {/if}
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 100vh;
    height: 100%;
    overflow: hidden;
    padding: 1vh 2vw 24px;
    box-sizing: border-box;
    align-items: stretch;
    min-width: 0;
    width: 100%;
  }

  .gantt-wrapper {
    min-height: 100vh;
    height: 100%;
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 3vh;
  }

  .tool-bar {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
</style>
