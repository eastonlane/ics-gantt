<script lang="ts">
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

<select bind:value={seletedCategories} multiple>
  {#each categories as category (category)}
    {#key category}
      <option value={category}>{category}</option>
    {/key}
  {/each}
</select>
<Button
  onclick={() => {
    if (seletedCategories) {
      onadd({
        type: filterType,
        filter: categoriesBlackFilter(seletedCategories),
      });
      resetInput();
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
