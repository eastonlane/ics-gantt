<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Select from '$lib/components/ui/select';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  import { appStateKey, langKey } from '$lib/const';
  import i18n, { i18next } from '$lib/i18n';
  import { createAppState } from '$lib/state.svelte';
  import { initStore, restoreCalendars } from '$lib/stores/data';
  import { sidebarContent } from '$lib/stores/sidebar';
  import type { SupportedLocale } from '$lib/types/locale';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import SunIcon from '@lucide/svelte/icons/sun';
  import { ModeWatcher, resetMode, setMode } from 'mode-watcher';
  import { setContext } from 'svelte';
  import './layout.css';

  let { children } = $props();

  initStore();
  restoreCalendars().catch((error) => {
    console.error($i18n.t('loadCalendarsError'), error);
  });

  const appState = createAppState();

  setContext(appStateKey, appState);

  const localeItems: { label: string; value: string }[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en', label: 'English' },
  ];
  let locale = $state<SupportedLocale>(
    localStorage.getItem(langKey) === 'zh-CN' ? 'zh-CN' : 'en',
  );
  $effect(() => {
    appState.locale = locale;
    localStorage.setItem(langKey, locale);
    document.documentElement.lang = locale;
    void i18next.changeLanguage(locale);
  });
</script>

<ModeWatcher />
<Sidebar.Provider class="h-svh max-h-svh">
  {#if $sidebarContent}
    {@render $sidebarContent()}
  {/if}
  <Sidebar.Inset class="min-w-0">
    <main>
      <div class="header">
        <div class="header-left">
          <Sidebar.Trigger />
          <strong>{$i18n.t('appName')}</strong>
        </div>

        <div class="app-control">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class={buttonVariants({ variant: 'outline', size: 'icon' })}
            >
              <SunIcon
                class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
              />
              <MoonIcon
                class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
              />
              <span class="sr-only">Toggle theme</span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" placeholder={$i18n.t('theme')}>
              <DropdownMenu.Item onclick={() => setMode('light')}
                >Light</DropdownMenu.Item
              >
              <DropdownMenu.Item onclick={() => setMode('dark')}
                >Dark</DropdownMenu.Item
              >
              <DropdownMenu.Item onclick={() => resetMode()}
                >System</DropdownMenu.Item
              >
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <Select.Root type="single" bind:value={locale} items={localeItems}>
            <Select.Trigger class="w-45">
              <Select.Value placeholder={$i18n.t('language')} />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each localeItems as { value, label } (value)}
                  <Select.Item {value} {label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      <TooltipProvider>
        {@render children()}
      </TooltipProvider>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>

<footer></footer>

<style>
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    color: #0f0f0f;
    background-color: #f6f6f6;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  .header {
    grid-area: header;
    background-color: var(--header-bg);
    color: var(--header-text);
    border-bottom: 1px solid var(--header-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    transition: background-color 0.3s;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .app-control {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    height: 100%;
  }
</style>
