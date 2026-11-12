export async function getContentType(url: string): Promise<string | null> {
  const resp = await fetch(url, {
    method: 'HEAD',
  });
  return resp.headers.get('Content-Type');
}

export async function getCalendarContent(url: string): Promise<Uint8Array> {
  const resp = await fetch(url);
  const buf = await resp.arrayBuffer();
  return new Uint8Array(buf);
}
