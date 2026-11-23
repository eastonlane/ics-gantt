<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import i18n from '$lib/i18n';
  import type {
    EventFilter,
    EventFilterIndentity,
    EventFilterMetadata,
  } from '$lib/types/ics-event-filter';
  import { getFilterIdentify, isSameFilter } from '$lib/utils/ics-event-filter';

  let {
    filters = [],
    selected,
    onFilterChecked,
  }: {
    filters: EventFilter[];
    selected?: EventFilterIndentity;
    onFilterChecked?: (filter: EventFilterIndentity) => void;
  } = $props();

  function parseTemplate(template: string) {
    const parts: Array<string | { tag: string; content: string }> = [];
    const regex = /<(\w+)>(.*?)<\/\1>/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(template)) !== null) {
      if (match.index > lastIndex) {
        parts.push(template.slice(lastIndex, match.index));
      }
      parts.push({
        tag: match[1],
        content: match[2],
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < template.length) {
      parts.push(template.slice(lastIndex));
    }

    return parts;
  }

  function describeFilter(
    filter: EventFilterMetadata,
  ): ReturnType<typeof parseTemplate> {
    return parseTemplate(getFilterDescriptionTemplate(filter));
  }

  function getFilterDescriptionTemplate(filter: EventFilterMetadata) {
    switch (filter.type) {
      case 'range':
        if (filter.start && filter.end) {
          return $i18n.t('filters.description.range.closed', {
            start: filter.start,
            end: filter.end,
          });
        }
        if (filter.start) {
          return $i18n.t('filters.description.range.after', {
            value: filter.start,
          });
        }
        if (filter.end) {
          return $i18n.t('filters.description.range.before', {
            value: filter.end,
          });
        }
        return 'Undefnied filter';
      case 'recent':
        return $i18n.t('filters.description.recent', {
          count: filter.value,
        });
      case 'duration':
        return $i18n.t('filters.description.duration', {
          count: filter.value,
        });
      case 'whitelist':
        return $i18n.t(
          `filters.description.whitelist${filter.value.length > 1 ? '_multiple' : '_single'}`,
          {
            value: filter.value.join(','),
          },
        );
      case 'blacklist':
        return $i18n.t(
          `filters.description.blacklist${filter.value.length > 1 ? '_multiple' : '_single'}`,
          {
            value: filter.value.join(','),
          },
        );
    }
  }

  function getFilterLongTextMetadata(filter: EventFilter) {
    switch (filter.type) {
      case 'whitelist':
      case 'blacklist':
        return filter.value.join(',');
    }
    return;
  }
</script>

{#snippet renderTemplate(parts: ReturnType<typeof parseTemplate>)}
  {#each parts as part (part)}
    {#if typeof part === 'string'}
      <span>{part}</span>
    {:else if part.tag === 'strong'}
      <strong>{part.content}</strong>
    {:else}
      <span>{part.content}</span>
    {/if}
  {/each}
{/snippet}

{#snippet filterDescription(isSelected: boolean, filter: EventFilter)}
  <Button
    class="min-w-0"
    variant={isSelected ? 'secondary' : 'ghost'}
    onclick={() => onFilterChecked?.(filter)}
  >
    {@render renderTemplate(describeFilter(filter))}
  </Button>
{/snippet}

<div class="flex flex-col items-start">
  <Tooltip.Root>
    <Tooltip.Provider>
      {@const anyActiveFilter = filters?.length}
      <h3 class="text-sm font-semibold">
        {$i18n.t(
          anyActiveFilter
            ? 'filters.overview.heading'
            : 'filters.overview.empty',
        )}
      </h3>
      {#if anyActiveFilter}
        {#each filters as filter (getFilterIdentify(filter))}
          {@const isSelected = selected && isSameFilter(selected, filter)}
          {@const longText = getFilterLongTextMetadata(filter)}
          {#if longText?.length}
            <Tooltip.Trigger class="max-w-full overflow-hidden">
              {@render filterDescription(!!isSelected, filter)}
            </Tooltip.Trigger>
            <Tooltip.Content>{longText}</Tooltip.Content>
          {:else}
            {@render filterDescription(!!isSelected, filter)}
          {/if}
        {/each}
      {/if}
    </Tooltip.Provider>
  </Tooltip.Root>
</div>
