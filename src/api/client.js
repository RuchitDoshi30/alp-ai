const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // send HttpOnly cookies for refresh
  });

  // Auto-refresh on 401
  if (res.status === 401 && !options._retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return api(endpoint, { ...options, _retried: true });
    }
    // If refresh fails, clear token and signal logout
    accessToken = null;
    window.dispatchEvent(new Event('venueiq:logout'));
    throw new Error('Session expired');
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || `API error: ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.success && data.data.accessToken) {
      accessToken = data.data.accessToken;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
