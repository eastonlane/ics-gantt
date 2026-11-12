import { getCurrentEnv } from '$lib/env';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export function copyToClipBoard(content: string) {
  switch (getCurrentEnv()) {
    case 'tauri':
      return copyToClipBoardTauri(content);
    case 'web':
      return copyToClipBoardWeb(content);
  }
}
function copyToClipBoardTauri(content: string) {
  writeText(content);
}

function copyToClipBoardWeb(content: string) {
  navigator.clipboard?.writeText(content);
}
