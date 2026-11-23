<script lang="ts">
  import * as Select from '$lib/components/ui/select';
  import i18n from '$lib/i18n';
  import type {
    CalendarIdType,
    EventFilterType,
  } from '$lib/types/ics-event-filter';
  import {
    categoriesBlackFilter,
    newEventFilterScopeSingle,
  } from '$lib/utils/ics-event-filter';
  import { Button } from '../ui/button';
  import type { Props } from './props';

  const filterType: EventFilterType = 'blacklist';
  let {
    onadd,
    onremove,
    categories,
    isEdit,
    defaultValue,
    calendarId,
  }: Props & {
    categories: string[];
    defaultValue?: string[];
    calendarId: CalendarIdType;
  } = $props();

  // svelte-ignore state_referenced_locally
  let seletedCategories = $state(defaultValue);
  let isAddable = $derived(!!seletedCategories?.length);
</script>

<Select.Root type="multiple" bind:value={seletedCategories}>
  <Select.Trigger>
    <Select.Value placeholder={$i18n.t('filters.categoryPlaceholder')} />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each categories as category (category)}
        {#key category}
          <Select.Item value={category} label={category} />
        {/key}
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
<Button
  disabled={!isAddable}
  onclick={() => {
    if (isAddable) {
      onadd(categoriesBlackFilter(seletedCategories, calendarId));
    }
  }}>{$i18n.t(isEdit ? 'filters.editFilter' : 'filters.addFilter')}</Button
>
{#if isEdit}
  <Button
    onclick={() => {
      onremove({
        type: filterType,
        scope: newEventFilterScopeSingle(calendarId),
      });
    }}>{$i18n.t('filters.removeFilter')}</Button
  >
{/if}
