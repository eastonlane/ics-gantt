<script lang="ts">
  import {
    EventCategoriesBlackFilterComp,
    EventCategoriesWhiteFilterComp,
    EventDurationFilterComp,
    EventRangeFilterComp,
    EventRecentFilterComp,
  } from '$lib/components/EventFilter';
  import SVARGanttChart from '$lib/components/svar-gantt/SVARGanttChart.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '$lib/components/ui/select';
  import { appStateKey } from '$lib/const';
  import type { createAppState } from '$lib/state.svelte';
  import type {
    EventFilterType,
    EventFilterWithId,
  } from '$lib/utils/ics-event-filter';
  import { getContext } from 'svelte';
  import { convertIcsCalendar, type IcsCalendar } from 'ts-ics';

  let appState = getContext<ReturnType<typeof createAppState>>(appStateKey);
  let locale = $derived(appState.locale);

  let fileInputRef = $state.raw<HTMLInputElement | undefined>();
  let files = $state<FileList>();
  $effect(() => {
    if (files && files[0]) {
      files[0].text().then((str) => {
        icsCalendar = convertIcsCalendar(undefined, str);
      });
    }
  });

  let icsCalendar = $state<IcsCalendar>();
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

  const filterTypeItems = [
    { value: 'recent', label: 'Recent' },
    { value: 'duration', label: 'Duration' },
    { value: 'range', label: 'Date Range' },
    { value: 'blacklist', label: 'Categories Blacklist' },
    { value: 'whitelist', label: 'Categories Whitelist' },
  ];
  let selectedFilterType = $state<EventFilterType>();
  let filters = $state<EventFilterWithId[]>([]);
  function appendFilter(f: EventFilterWithId) {
    filters = [...filters.filter((x) => x.type !== f.type), f];
  }
  function removeFilter(filterType: EventFilterType) {
    filters = filters.filter((x) => x.type !== filterType);
  }
</script>

<div class="page-container">
  {#if icsCalendar && icsCalendar.events}
    <div class="gantt-wrapper">
      <div class="tool-bar">
        <Select
          type="single"
          bind:value={selectedFilterType}
          items={filterTypeItems}
        >
          <SelectTrigger class="w-45">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each filterTypeItems as item (item)}
                <SelectItem value={item.value}>
                  {item.label}
                </SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button disabled={!filters?.length} onclick={() => (filters = [])}
          >Reset Filters</Button
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
    <div>
      <Button onclick={(_) => fileInputRef?.click()}>Upload</Button>
      <input
        style="display: none"
        type="file"
        accept=".ics"
        bind:files
        bind:this={fileInputRef}
      />
    </div>
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
