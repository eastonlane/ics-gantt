<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import {
    rangeFilter,
    type EventFilterType,
  } from '$lib/utils/ics-event-filter';
  import { getLocalTimeZone, type DateValue } from '@internationalized/date';
  import DatePicker from '../composed/DatePicker.svelte';
  import { Button } from '../ui/button';
  import type { Props } from './props';

  const filterType: EventFilterType = 'range';
  let { onadd, onremove, isEdit, locale }: Props = $props();

  let startDate = $state<DateValue>();
  let endDate = $state<DateValue>();

  let confirmDisableReason = $derived.by<string>(() => {
    if (!startDate && !endDate) {
      return 'Please set the range!';
    }
    if (startDate && endDate && startDate > endDate) {
      return 'Start date is after end date!';
    }
    return '';
  });
  let isConfirmDisabled = $derived(!!confirmDisableReason?.length);

  function confirmFilter() {
    const filter = rangeFilter(
      startDate?.toDate(getLocalTimeZone()),
      endDate?.toDate(getLocalTimeZone()),
    );
    if (!filter) {
      // TODO: toast the error
      throw new Error('invalid range');
    }
    onadd({
      type: filterType,
      filter,
    });
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
          {isEdit ? 'Edit' : 'Add'} Filter
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
      onremove(filterType);
    }}>Remove filter</Button
  >
{/if}
