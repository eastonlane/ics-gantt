<script lang="ts">
  import {
    categoriesWhiteFilter,
    type EventFilterType,
  } from '$lib/utils/ics-event-filter';
  import { Button } from '../ui/button';
  import type { Props } from './props';

  const filterType: EventFilterType = 'whitelist';
  let {
    onadd,
    onremove,
    categories,
    isEdit,
    defaultCategories,
  }: Props & { categories: string[]; defaultCategories?: string[] } = $props();

  // svelte-ignore state_referenced_locally
  let seletedCategories = $state<string[]>(defaultCategories ?? []);

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
        filter: categoriesWhiteFilter(seletedCategories),
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
