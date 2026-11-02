<script lang="ts">
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  import { appStateKey } from '$lib/const';
  import { createAppState } from '$lib/state.svelte';
  import type { SupportedLocale } from '$lib/types/locale';
  import { setContext } from 'svelte';
  import './layout.css';

  let { children } = $props();

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

  let locale = $state<SupportedLocale>('en');
  $effect(() => {
    appState.locale = locale;
  });
</script>

<header>
  <div class="header-left">
    <strong>ICS Gantt</strong>
  </div>

  <div class="app-control">
    <div class="theme-switch-wrapper">
      <label class="theme-switch">
        <input type="checkbox" bind:checked={isDark} />
        <div class="slider round"></div>
      </label>
    </div>

    <select bind:value={locale}>
      <option value="en">English</option>
      <option value="zh-CN">简体中文</option>
    </select>
  </div>
</header>
<main>
  <TooltipProvider>
    {@render children()}
  </TooltipProvider>
</main>
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

  header {
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
