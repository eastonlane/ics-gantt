<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import i18n from '$lib/i18n';
  import type { EventFilterType } from '$lib/types/ics-event-filter';
  import {
    dateRangeFilter,
    newEventFilterScopeAll,
  } from '$lib/utils/ics-event-filter';
  import { type DateValue } from '@internationalized/date';
  import DatePicker from '../composed/DatePicker.svelte';
  import { Button } from '../ui/button';
  import type { Props } from './props';

  const filterType: EventFilterType = 'range';
  let {
    onadd,
    onremove,
    isEdit,
    locale,
    defaultStart,
    defaultEnd,
  }: Props & { defaultStart?: DateValue; defaultEnd?: DateValue } = $props();

  // svelte-ignore state_referenced_locally
  let startDate = $state(defaultStart);
  // svelte-ignore state_referenced_locally
  let endDate = $state(defaultEnd);

  let confirmDisableReason = $derived.by<string>(() => {
    if (!startDate && !endDate) {
      return $i18n.t('filters.rangeRequired');
    }
    if (startDate && endDate && startDate > endDate) {
      return $i18n.t('filters.invalidRange');
    }
    return '';
  });
  let isConfirmDisabled = $derived(!!confirmDisableReason?.length);

  function confirmFilter() {
    const filter = dateRangeFilter(startDate, endDate);
    if (!filter) {
      // TODO: toast the error
      throw new Error($i18n.t('filters.invalidRangeError'));
    }
    onadd(filter);
  }
</script>

<DatePicker {locale} bind:value={startDate} />
<DatePicker {locale} bind:value={endDate} />

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <span {...props} class="inline-block w-fit">
        <Button
          disabled={isConfirmDisabled}
          aria-disabled={isConfirmDisabled}
          onclick={confirmFilter}
        >
          {$i18n.t(isEdit ? 'filters.editFilter' : 'filters.addFilter')}
        </Button>
      </span>
    {/snippet}
  </Tooltip.Trigger>
  {#if isConfirmDisabled}
    <Tooltip.Content side="bottom">
      {confirmDisableReason}
    </Tooltip.Content>
  {/if}
</Tooltip.Root>

{#if isEdit}
  <Button
    onclick={() => {
      onremove({ type: filterType, scope: newEventFilterScopeAll() });
    }}>{$i18n.t('filters.removeFilter')}</Button
  >
{/if}
