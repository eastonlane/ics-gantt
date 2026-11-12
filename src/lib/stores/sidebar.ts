import type { Snippet } from 'svelte';
import { writable } from 'svelte/store';

export const sidebarContent = writable<Snippet | null>(null);
