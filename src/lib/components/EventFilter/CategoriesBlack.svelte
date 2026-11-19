<script lang="ts">
  import * as Select from '$lib/components/ui/select';
  import i18n from '$lib/i18n';
  import {
    categoriesBlackFilter,
    type EventFilterType,
  } from '$lib/utils/ics-event-filter';
  import { onMount } from 'svelte';
  import { Button } from '../ui/button';
  import type { Props } from './props';

  const filterType: EventFilterType = 'blacklist';
  let {
    onadd,
    onremove,
    categories,
    isEdit,
    defaultValue,
  }: Props & { categories: string[]; defaultValue?: string[] } = $props();

  let seletedCategories = $state<string[]>();
  onMount(() => {
    if (defaultValue) {
      seletedCategories = defaultValue;
    }
  });

  function resetInput() {
    seletedCategories = [];
  }
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
  onclick={() => {
    if (seletedCategories) {
      onadd({
        type: filterType,
        filter: categoriesBlackFilter(seletedCategories),
      });
      resetInput();
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
