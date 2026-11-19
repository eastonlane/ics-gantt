<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import i18n from '$lib/i18n';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import type { SupportedLocale } from '$lib/types/locale';
  import { cn } from '$lib/utils.js';
  import {
    DateFormatter,
    getLocalTimeZone,
    type DateValue,
  } from '@internationalized/date';
  import CalendarIcon from '@lucide/svelte/icons/calendar';

  let {
    value = $bindable(),
    locale = 'en',
  }: { value: DateValue | undefined; locale?: SupportedLocale } = $props();

  const df = $derived(
    new DateFormatter(locale, {
      dateStyle: 'long',
    }),
  );
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class={cn(
          'w-70 justify-start text-start font-normal',
          !value && 'text-muted-foreground',
        )}
        {...props}
      >
        <CalendarIcon class="me-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : $i18n.t('common.selectDate')}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus captionLayout="dropdown" />
  </Popover.Content>
</Popover.Root>
