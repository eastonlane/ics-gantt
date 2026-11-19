<script lang="ts">
  import {
    recentFilter,
    type EventFilterType,
  } from '$lib/utils/ics-event-filter';
  import i18n from '$lib/i18n';
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
  <InputGroupAddon align="inline-end">{$i18n.t('common.days')}</InputGroupAddon>
</InputGroup>
<Button
  onclick={() => {
    if (dayCount) {
      onadd({
        type: filterType,
        filter: recentFilter(dayCount),
      });
    }
  }}>{$i18n.t(isEdit ? 'filters.editFilter' : 'filters.addFilter')}</Button
>
{#if isEdit}
  <Button
    onclick={() => {
      onremove(filterType);
    }}>{$i18n.t('filters.removeFilter')}</Button
  >
{/if}
