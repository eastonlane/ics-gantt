import { getCurrentEnv } from '$lib/env';
import * as web from './http-web';

export async function getContentType(url: string): Promise<string | null> {
  return await web.getContentType(url);
}

export async function getCalendarContent(url: string): Promise<string> {
  switch (getCurrentEnv()) {
    case 'web':
      return (await web.getCalendarContent(url)).toString();
    case 'tauri':
      return '';
  }
}
