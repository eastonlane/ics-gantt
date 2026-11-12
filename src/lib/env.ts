import type { Env } from '$lib/types/env';

export function getCurrentEnv(): Env {
  return typeof window !== 'undefined' &&
    // @ts-ignore
    !!window.__TAURI_INTERNALS__
    ? 'tauri'
    : 'web';
}
