<script lang="ts">
  import * as Select from '$lib/components/ui/select';
  import i18n from '$lib/i18n';
  import type {
    CalendarIdType,
    EventFilter,
    EventFilterIndentity,
    EventFilterType,
  } from '$lib/types/ics-event-filter';
  import {
    isSameFilter,
    newEventFilterScopeAll,
    newEventFilterScopeSingle,
  } from '$lib/utils/ics-event-filter';
  import {
    CategoriesBlackFilterComp,
    CategoriesWhiteFilterComp,
    DurationFilterComp,
    RangeFilterComp,
    RecentFilterComp,
  } from './editors';

  interface Props {
    filters: EventFilter[];
    selectedFilterIdentity?: EventFilterIndentity;
    calendarId: string;
    categories: string[];
    appendFilter?: (f: EventFilter) => void;
    removeFilter?: (f: EventFilterIndentity) => void;
  }

  let {
    filters,
    selectedFilterIdentity = $bindable(),
    calendarId,
    categories,
    appendFilter,
    removeFilter,
  }: Props = $props();

  const filterTypeItems = $derived([
    { value: 'range', label: $i18n.t('filters.range') },
    { value: 'recent', label: $i18n.t('filters.recent') },
    { value: 'duration', label: $i18n.t('filters.duration') },
    { value: 'blacklist', label: $i18n.t('filters.blacklist') },
    { value: 'whitelist', label: $i18n.t('filters.whitelist') },
  ]);

  function doAppendFilter(f: EventFilter) {
    if (appendFilter) {
      appendFilter(f);
    } else {
      filters = [...filters.filter((x) => !isSameFilter(x, f)), f];
    }
  }
  function doRemoveFilter(f: EventFilterIndentity) {
    if (removeFilter) {
      removeFilter(f);
    } else {
      filters = [...filters.filter((x) => !isSameFilter(x, f))];
    }
  }
  function findFilterSafely<T extends EventFilterType>({
    type,
    scope,
  }: EventFilterIndentity & { type: T }):
    Extract<EventFilter, { type: T }> | undefined {
    return filters.find((x) => isSameFilter(x, { type, scope })) as
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

  function onSelectedFilterChanged(value: string) {
    const type = value as EventFilterType;
    switch (type) {
      case 'duration':
      case 'range':
      case 'recent':
        selectedFilterIdentity = { type, scope: newEventFilterScopeAll() };
        break;
      case 'blacklist':
      case 'whitelist':
        selectedFilterIdentity = {
          type,
          scope: newEventFilterScopeSingle(calendarId),
        };
        break;
      default:
        throw new Error(`Unsupported filter type changed: ${type}`);
    }
  }
</script>

<div class="px-6">
  <Select.Root
    type="single"
    onValueChange={onSelectedFilterChanged}
    value={selectedFilterIdentity?.type}
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

  {#if selectedFilterIdentity?.type === 'recent'}
    {@const filter = findFilterSafely(
      getFilterIdentity(selectedFilterIdentity.type, calendarId),
    )}
    <RecentFilterComp
      onadd={doAppendFilter}
      onremove={doRemoveFilter}
      isEdit={filter}
      defaultValue={filter?.value}
    />
  {:else if selectedFilterIdentity?.type === 'duration'}
    {@const filter = findFilterSafely(
      getFilterIdentity(selectedFilterIdentity.type, calendarId),
    )}
    <DurationFilterComp
      onadd={doAppendFilter}
      onremove={doRemoveFilter}
      isEdit={filter}
      defaultValue={filter?.value}
    />
  {:else if selectedFilterIdentity?.type === 'range'}
    {@const filter = findFilterSafely(
      getFilterIdentity(selectedFilterIdentity.type, calendarId),
    )}
    <RangeFilterComp
      onadd={doAppendFilter}
      onremove={doRemoveFilter}
      isEdit={filter}
      defaultStart={filter?.start}
      defaultEnd={filter?.end}
    />
  {:else if selectedFilterIdentity?.type === 'whitelist'}
    {@const filter = findFilterSafely(
      getFilterIdentity(selectedFilterIdentity.type, calendarId),
    )}
    <CategoriesWhiteFilterComp
      onadd={doAppendFilter}
      onremove={doRemoveFilter}
      {categories}
      isEdit={filter}
      defaultValue={filter?.value}
      {calendarId}
    />
  {:else if selectedFilterIdentity?.type === 'blacklist'}
    {@const filter = findFilterSafely(
      getFilterIdentity(selectedFilterIdentity.type, calendarId),
    )}
    <CategoriesBlackFilterComp
      onadd={doAppendFilter}
      onremove={doRemoveFilter}
      {categories}
      isEdit={filter}
      defaultValue={filter?.value}
      {calendarId}
    />
  {/if}
</div>
