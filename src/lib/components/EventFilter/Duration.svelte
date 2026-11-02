<script lang="ts">
  import {
    dayDurationFilter,
    type EventFilterType,
  } from '$lib/utils/ics-event-filter';
  import { onMount } from 'svelte';
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

  let dayCount = $state<number>();
  onMount(() => {
    if (defaultValue) {
      dayCount = defaultValue;
    }
  });
</script>

<InputGroup class="w-24">
  <InputGroupInput
    type="number"
    defaultValue="30"
    min="1"
    bind:value={dayCount}
  />
  <InputGroupAddon align="inline-end">days</InputGroupAddon>
</InputGroup>

<Button
  onclick={() => {
    if (dayCount) {
      onadd({
        type: filterType,
        filter: dayDurationFilter(dayCount),
      });
    }
  }}>{isEdit ? 'Edit' : 'Add'} filter</Button
>

{#if isEdit}
  <Button
    onclick={() => {
      onremove(filterType);
    }}>Remove filter</Button
  >
{/if}
