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
  import type { AppIcsCalendar } from '$lib/types/data';
  import type {
    CalendarIdType,
    EventFilter,
    EventFilterIndentity,
    EventFilterType,
  } from '$lib/types/ics-event-filter';
  import {
    isFilterApplicable,
    isSameFilter,
    newEventFilterScopeAll,
    newEventFilterScopeSingle,
  } from '$lib/utils/ics-event-filter';
  import { mode } from 'mode-watcher';

  import { getContext, onMount } from 'svelte';

  let appState = getContext<ReturnType<typeof createAppState>>(appStateKey);
  let locale = $derived(appState.locale);

  onMount(() => {
    sidebarContent.set(sidebar);
    return () => {
      sidebarContent.set(null);
    };
  });

  let appCalendar = $derived.by<AppIcsCalendar | null>(() => {
    if (!$appCalendarStore.length) {
      return null;
    }
    const item = $appCalendarStore.find((x) => x.isVisible);
    if (!item) {
      return null;
    }
    return item;
  });
  let icsCalendar = $derived(appCalendar?.icsCalendar);
  let calendarId = $derived(appCalendar?.name);
  let icsEvents = $derived(
    (icsCalendar?.events ?? []).filter((x) =>
      x.end ? x.end >= x.start : true,
    ),
  );
  let events = $derived(
    icsEvents.filter(
      (x) =>
        filtersInScope
          .values()
          .reduce((cur, f) => cur && f.filterFunc(x), true) ?? true,
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
  let filters = $state<EventFilter[]>([]);
  let filtersInScope = $derived(
    filters.filter((filter) => isFilterApplicable({ filter, calendarId })),
  );
  function appendFilter(f: EventFilter) {
    filters = [...filters.filter((x) => !isSameFilter(x, f)), f];
  }
  function removeFilter(f: EventFilterIndentity) {
    filters = filters.filter((x) => !isSameFilter(x, f));
  }
  function findFilterSafely<T extends EventFilterType>({
    type,
    scope,
  }: EventFilterIndentity & { type: T }):
    Extract<EventFilter, { type: T }> | undefined {
    return filtersInScope.find((x) => isSameFilter(x, { type, scope })) as
      Extract<EventFilter, { type: T }> | undefined;
  }

  function getFilterIdentity<T extends EventFilterType>(
    type: T,
    calendarId: CalendarIdType,
  ): EventFilterIndentity & { type: T } {
    switch (type) {
      case 'range':
      case 'recent':
      case 'duration':
        return { type, scope: newEventFilterScopeAll() };
      case 'blacklist':
      case 'whitelist':
        return { type, scope: newEventFilterScopeSingle(calendarId) };
    }
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
        <Button
          disabled={!filtersInScope?.length}
          onclick={() => (filters = [])}
          >{$i18n.t('filters.resetFilters')}</Button
        >
        {#if selectedFilterType === 'recent'}
          {@const filter = findFilterSafely(
            getFilterIdentity(selectedFilterType, calendarId!),
          )}
          <EventRecentFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            isEdit={filter}
            defaultValue={filter?.value}
          />
        {:else if selectedFilterType === 'duration'}
          {@const filter = findFilterSafely(
            getFilterIdentity(selectedFilterType, calendarId!),
          )}
          <EventDurationFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            isEdit={filter}
            defaultValue={filter?.value}
          />
        {:else if selectedFilterType === 'range'}
          {@const filter = findFilterSafely(
            getFilterIdentity(selectedFilterType, calendarId!),
          )}
          <EventRangeFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            isEdit={filter}
            defaultStart={filter?.start}
            defaultEnd={filter?.end}
          />
        {:else if selectedFilterType === 'whitelist'}
          {@const filter = findFilterSafely(
            getFilterIdentity(selectedFilterType, calendarId!),
          )}
          <EventCategoriesWhiteFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            {categories}
            isEdit={filter}
            defaultValue={filter?.value}
            calendarId={calendarId!}
          />
        {:else if selectedFilterType === 'blacklist'}
          {@const filter = findFilterSafely(
            getFilterIdentity(selectedFilterType, calendarId!),
          )}
          <EventCategoriesBlackFilterComp
            {locale}
            onadd={appendFilter}
            onremove={removeFilter}
            {categories}
            isEdit={filter}
            defaultValue={filter?.value}
            calendarId={calendarId!}
          />
        {/if}
      </div>

      <SVARGanttChart {events} {locale} isDark={mode.current == 'dark'} />
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
    min-height: 0;
    height: 100%;
    overflow: hidden;
    padding: 1vh 2vw 24px;
    box-sizing: border-box;
    align-items: stretch;
    min-width: 0;
    width: 100%;
  }

  .gantt-wrapper {
    min-height: 0;
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
