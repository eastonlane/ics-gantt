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
    appCalendarStore.update((s) => [
      ...s,
      {
        ...stored,
        icsCalendar,
        created,
      },
    ]);
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
      <Sidebar.GroupLabel>Calendars</Sidebar.GroupLabel>
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
                    }}>Copy URL</ContextMenu.ContextMenuItem
                  >
                {/if}
                <ContextMenu.ContextMenuItem
                  onclick={() => removeCalendar(name)}
                  >Remove</ContextMenu.ContextMenuItem
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
      <Dialog.Title>Add a new calendar</Dialog.Title>
    </Dialog.Header>

    <Tabs.Root>
      <Tabs.List>
        {#if getCurrentEnv() === 'tauri'}
          <Tabs.Trigger value="file">File</Tabs.Trigger>
        {/if}
        <Tabs.Trigger value="url">URL</Tabs.Trigger>
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
              <Field.Label for="name">What label</Field.Label>
              <Input required name="name" type="text" />
            </Field.Field>

            <Field.Field>
              <Field.Label for="files">Select your ICS file</Field.Label>
              <Input name="files" required type="file" accept=".ics" />
            </Field.Field>
          </Field.Set>
          <Dialog.Footer>
            <Button type="submit">Add</Button>
            <Button type="reset">Reset</Button>
            <Dialog.Close class={buttonVariants()} type="button"
              >Cancel</Dialog.Close
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
              <Field.Label for="name">Name</Field.Label>
              <Input required name="name" type="text" />
            </Field.Field>
            <Field.Field>
              <Field.Label for="url">URL</Field.Label>
              <Input required name="url" type="url" />
            </Field.Field>
          </Field.Set>
          <Dialog.Footer>
            <Button type="submit">Add</Button>
            <Button type="reset">Reset</Button>
            <Dialog.Close class={buttonVariants()} type="button"
              >Cancel</Dialog.Close
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
