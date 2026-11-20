<script lang="ts">
  import i18n from '$lib/i18n';
  import type { EventFilterType } from '$lib/types/ics-event-filter';
  import {
    dayDurationFilter,
    newEventFilterScopeAll,
  } from '$lib/utils/ics-event-filter';
  import { Button } from '../ui/button';
  import { InputGroupAddon, InputGroupInput } from '../ui/input-group';
  import InputGroup from '../ui/input-group/input-group.svelte';
  import type { Props } from './props';

  const filterType: EventFilterType = 'duration';
  let {
    onadd,
    onremove,
    isEdit,
    defaultValue,
  }: Props & { defaultValue?: number } = $props();

  // svelte-ignore state_referenced_locally
  let dayCount = $state(defaultValue);
</script>

<InputGroup class="w-24">
  <InputGroupInput
    type="number"
    defaultValue="30"
    min="1"
    bind:value={dayCount}
  />
  <InputGroupAddon align="inline-end">{$i18n.t('common.days')}</InputGroupAddon>
</InputGroup>

<Button
  onclick={() => {
    if (dayCount) {
      onadd(dayDurationFilter(dayCount));
    }
  }}>{$i18n.t(isEdit ? 'filters.editFilter' : 'filters.addFilter')}</Button
>

{#if isEdit}
  <Button
    onclick={() => {
      onremove({ type: filterType, scope: newEventFilterScopeAll() });
    }}>{$i18n.t('filters.removeFilter')}</Button
  >
{/if}
