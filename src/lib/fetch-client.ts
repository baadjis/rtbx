// lib/fetch-client.ts
export async function fetchClient(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return res;
}