<script lang="ts">
  import { getContentType } from '$lib/api/http';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as ContextMenu from '$lib/components/ui/context-menu';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Field from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Tabs from '$lib/components/ui/tabs/';
  import { getCurrentEnv } from '$lib/env';
  import i18n from '$lib/i18n';
  import {
    addStoredCalendar,
    appCalendarStore,
    removeStoredCalendar,
    restoreCalendars,
    saveIcsContents,
    updateCalendarsVisibility,
  } from '$lib/stores/data';
  import { copyToClipBoard } from '$lib/utils/clipboard';
  import { Eye, EyeOff } from '@lucide/svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import { convertIcsCalendar } from 'ts-ics';

  let dialogOpen = $state(false);
  let calendarNameList = $derived($appCalendarStore.map((x) => x.name));

  let singleSelectedCalendar = $state<string>();
  let selectedCalendarList = $derived.by(() => {
    if (singleSelectedCalendar?.length) {
      return [singleSelectedCalendar];
    }
    return [];
  });

  $effect(() => {
    if (selectedCalendarList) {
      updateCalendarsVisibility(selectedCalendarList);
    }
  });

  function isCalendarNameUsed(name: string): boolean {
    return !!calendarNameList.find((x) => x === name);
  }

  function closeDialog() {
    restoreCalendars();
    dialogOpen = false;
  }

  function updateHidden(name: string, isVisiblePrev?: boolean) {
    singleSelectedCalendar = isVisiblePrev ? undefined : name;
  }

  function removeCalendar(name: string) {
    removeStoredCalendar(name);
  }

  async function addFileCalendar(form: FormData) {
    const file = form.get('files') as File;
    const name = form.get('name') as string;
    if (isCalendarNameUsed(name)) {
      // TODO: toast error or form validate
      return;
    }
    const contents = await file.arrayBuffer();
    const icsCalendar = convertIcsCalendar(
      undefined,
      new TextDecoder().decode(contents),
    );
    const created = new Date();
    const path = await saveIcsContents(name, contents);
    const stored = {
      type: 'file' as const,
      name,
      path,
      created: Math.floor(created.getTime() / 1000),
    };
    await addStoredCalendar(stored);
    closeDialog();
  }

  async function addUrlcalendar(form: FormData) {
    const name = form.get('name') as string;
    const url = form.get('url') as string;
    if (isCalendarNameUsed(name)) {
      // TODO: toast error or form validate
      return;
    }
    const contentType = await getContentType(url);
    if (contentType?.toLowerCase() !== 'text/calendar') {
      //TODO toast an error
      return;
    }
    addStoredCalendar({
      type: 'url',
      name,
      url,
      path: '',
      created: new Date().getTime(),
      lastSync: new Date().getTime(),
    });
    closeDialog();
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Sidebar.Root>
    <Sidebar.Group>
      <Sidebar.GroupLabel>{$i18n.t('calendar.heading')}</Sidebar.GroupLabel>
      <Sidebar.GroupAction>
        <Dialog.Trigger>
          <Plus />
        </Dialog.Trigger>
      </Sidebar.GroupAction>
      <Sidebar.Menu>
        {#each $appCalendarStore as { name, icsCalendar, ...restProps } (`${name} ${icsCalendar.name}`)}
          {@const isVisible = !!selectedCalendarList.find((x) => x === name)}
          <Sidebar.MenuSub>
            <!-- <Sidebar.GroupAction /> -->
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <Sidebar.MenuSubItem>
                  <div class="calendar-list-item">
                    <span>
                      {name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onclick={() => updateHidden(name, isVisible)}
                    >
                      {#if isVisible}
                        <Eye />
                      {:else}
                        <EyeOff />
                      {/if}
                    </Button>
                  </div>
                </Sidebar.MenuSubItem>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                {#if restProps.type === 'url'}
                  <ContextMenu.ContextMenuItem
                    onclick={() => {
                      copyToClipBoard(restProps.url);
                    }}>{$i18n.t('calendar.copyUrl')}</ContextMenu.ContextMenuItem
                  >
                {/if}
                <ContextMenu.ContextMenuItem
                  onclick={() => removeCalendar(name)}
                  >{$i18n.t('calendar.remove')}</ContextMenu.ContextMenuItem
                >
              </ContextMenu.Content>
            </ContextMenu.Root>
          </Sidebar.MenuSub>
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Root>

  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$i18n.t('calendar.addTitle')}</Dialog.Title>
    </Dialog.Header>

    <Tabs.Root>
      <Tabs.List>
        {#if getCurrentEnv() === 'tauri'}
          <Tabs.Trigger value="file">{$i18n.t('calendar.fileTab')}</Tabs.Trigger>
        {/if}
        <Tabs.Trigger value="url">{$i18n.t('calendar.urlTab')}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="file">
        <form
          onsubmit={async (e) => {
            e.preventDefault();
            await addFileCalendar(new FormData(e.currentTarget));
          }}
        >
          <Field.Set>
            <Field.Field>
              <Field.Label for="name">{$i18n.t('calendar.nameLabel')}</Field.Label>
              <Input required name="name" type="text" />
            </Field.Field>

            <Field.Field>
              <Field.Label for="files">{$i18n.t('calendar.fileLabel')}</Field.Label>
              <Input name="files" required type="file" accept=".ics" />
            </Field.Field>
          </Field.Set>
          <Dialog.Footer>
            <Button type="submit">{$i18n.t('common.add')}</Button>
            <Button type="reset">{$i18n.t('common.reset')}</Button>
            <Dialog.Close class={buttonVariants()} type="button"
              >{$i18n.t('common.cancel')}</Dialog.Close
            >
          </Dialog.Footer>
        </form>
      </Tabs.Content>
      <Tabs.Content value="url">
        <form
          onsubmit={async (e) => {
            e.preventDefault();
            await addUrlcalendar(new FormData(e.currentTarget));
          }}
        >
          <Field.Set>
            <Field.Field>
              <Field.Label for="name">{$i18n.t('calendar.nameLabel')}</Field.Label>
              <Input required name="name" type="text" />
            </Field.Field>
            <Field.Field>
              <Field.Label for="url">{$i18n.t('calendar.urlLabel')}</Field.Label>
              <Input required name="url" type="url" />
            </Field.Field>
          </Field.Set>
          <Dialog.Footer>
            <Button type="submit">{$i18n.t('common.add')}</Button>
            <Button type="reset">{$i18n.t('common.reset')}</Button>
            <Dialog.Close class={buttonVariants()} type="button"
              >{$i18n.t('common.cancel')}</Dialog.Close
            >
          </Dialog.Footer>
        </form>
      </Tabs.Content>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>

<style>
  .calendar-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
