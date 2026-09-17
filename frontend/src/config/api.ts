const envApiUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '';
export const API_BASE = envApiUrl.replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${cleanPath}` : cleanPath;
}

export async function parseResponseJson<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || data?.detail || `Request failed with status ${res.status}`);
    }
    return data;
  }

  const text = await res.text();
  if (text.includes('The page could not be found') || res.status === 404) {
    throw new Error(
      'Backend API endpoint not found (404). Please ensure VITE_API_URL is set to your deployed Render backend in Vercel settings, or update frontend/vercel.json.'
    );
  }

  if (!res.ok) {
    throw new Error(`Server returned error ${res.status}: ${text.slice(0, 120)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Received non-JSON response from server (${res.status}): ${text.slice(0, 120)}`);
  }
}
