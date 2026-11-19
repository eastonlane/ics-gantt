<script lang="ts">
  import * as Select from '$lib/components/ui/select';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  import { appStateKey, langKey } from '$lib/const';
  import i18n, { i18next } from '$lib/i18n';
  import { createAppState } from '$lib/state.svelte';
  import { initStore, restoreCalendars } from '$lib/stores/data';
  import { sidebarContent } from '$lib/stores/sidebar';
  import type { SupportedLocale } from '$lib/types/locale';
  import { setContext } from 'svelte';
  import './layout.css';

  let { children } = $props();

  initStore();
  restoreCalendars().catch((error) => {
    console.error($i18n.t('loadCalendarsError'), error);
  });

  const appState = createAppState();

  setContext(appStateKey, appState);

  let isDark = $state(false);
  $effect(() => {
    appState.isDarkTheme = isDark;
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light',
    );
  });

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

<Sidebar.Provider>
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
          <div class="theme-switch-wrapper">
            <label class="theme-switch" aria-label={$i18n.t('theme')}>
              <input type="checkbox" bind:checked={isDark} />
              <div class="slider round"></div>
            </label>
          </div>

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

  .theme-switch-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
  }

  .theme-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
  }
  .theme-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '☀️';
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    font-size: 12px;
  }

  .theme-switch input:checked + .slider {
    background-color: #666;
  }

  .theme-switch input:checked + .slider:before {
    transform: translateX(24px);
    content: '🌙';
  }

  main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    height: 100%;
  }
</style>
