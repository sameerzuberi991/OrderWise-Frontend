// Single place the dashboards talk to the server from.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    // Prefer the server's own error message when it sends one.
    let msg = `${options.method || 'GET'} ${path} → ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}
