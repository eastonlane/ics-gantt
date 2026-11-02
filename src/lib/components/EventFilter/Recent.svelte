<script lang="ts">
  import {
    recentFilter,
    type EventFilterType,
  } from '$lib/utils/ics-event-filter';
  import { Button } from '../ui/button';
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
  } from '../ui/input-group';
  import type { Props } from './props';

  const filterType: EventFilterType = 'recent';
  let { onadd, onremove, isEdit }: Props = $props();

  let dayCount = $state<number>();
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
        filter: recentFilter(dayCount),
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
