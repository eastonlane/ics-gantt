<script lang="ts">
  import {
    EventFilterDescriber,
    EventFilterEditor,
  } from '$lib/components/EventFilter';
  import { CalendarPageSidebar } from '$lib/components/sidebar';
  import SVARGanttChart from '$lib/components/svar-gantt/SVARGanttChart.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Card from '$lib/components/ui/card';
  import { appStateKey } from '$lib/const';
  import i18n from '$lib/i18n';
  import type { createAppState } from '$lib/state.svelte';
  import { appCalendarStore } from '$lib/stores/data';
  import { sidebarContent } from '$lib/stores/sidebar';
  import type { AppIcsCalendar } from '$lib/types/data';
  import type {
    EventFilter,
    EventFilterIndentity,
  } from '$lib/types/ics-event-filter';
  import {
    dateRangeFilter,
    isFilterApplicable,
    isSameFilter,
  } from '$lib/utils/ics-event-filter';
  import { getLocalTimeZone, today } from '@internationalized/date';
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

  let selectedFilterIdentity = $state<EventFilterIndentity>({
    type: 'range',
    scope: { kind: 'all' },
  });
  let filters = $state<EventFilter[]>([defaultDateRangeFilter()]);
  let filtersInScope = $derived(
    filters.filter((filter) => isFilterApplicable({ filter, calendarId })),
  );
  function appendFilter(f: EventFilter) {
    filters = [...filters.filter((x) => !isSameFilter(x, f)), f];
  }
  function removeFilter(f: EventFilterIndentity) {
    filters = filters.filter((x) => !isSameFilter(x, f));
  }

  function defaultDateRangeFilter(): EventFilter {
    return dateRangeFilter(
      today(getLocalTimeZone()).add({ days: -4 }),
      today(getLocalTimeZone()).add({ days: 8 }),
    )!;
  }
</script>

{#snippet sidebar()}
  <CalendarPageSidebar />
{/snippet}

<div
  class="box-border flex h-full min-h-0 w-full min-w-0 flex-col gap-4 overflow-hidden px-[2vw] pt-[1vh] pb-6"
>
  {#if calendarId && icsCalendar?.events}
    <div class="flex h-full min-h-0 w-full min-w-0 flex-col gap-3">
      <!--Filter Helpers-->
      <Card.Root class="pt-0">
        <Card.Header class="border-b bg-muted px-4 pt-4">
          <Card.Title>{$i18n.t('filters.workspace.tittle')}</Card.Title>
          <Card.Action>
            <Button
              disabled={!filtersInScope?.length}
              onclick={() => (filters = [])}
              >{$i18n.t('filters.resetFilters')}</Button
            >
          </Card.Action>
        </Card.Header>
        <Card.Content>
          <div class="flex min-w-0 justify-between">
            <!--Filter Overview-->
            <section class="min-w-[240px] flex-1 border-r pr-6">
              <EventFilterDescriber
                filters={filtersInScope}
                selected={selectedFilterIdentity}
                onFilterChecked={(f) => (selectedFilterIdentity = f)}
              />
            </section>

            <!--Filter Editor-->
            <section class="min-w-0 flex-[3]">
              <div class="px-6">
                <EventFilterEditor
                  bind:selectedFilterIdentity
                  filters={filtersInScope}
                  {calendarId}
                  {categories}
                  {appendFilter}
                  {removeFilter}
                />
              </div>
            </section>
          </div>
        </Card.Content>
      </Card.Root>

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
