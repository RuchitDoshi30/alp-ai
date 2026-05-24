import { api, setAccessToken } from './client';

export async function login(email, password) {
  const res = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.success) {
    setAccessToken(res.data.accessToken);
  }
  return res;
}

export async function register(email, password, name, phone) {
  const res = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, phone: phone || undefined }),
  });
  if (res.success) {
    setAccessToken(res.data.accessToken);
  }
  return res;
}

export async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch {
    // ignore errors on logout
  }
  setAccessToken(null);
}

export async function getMe() {
  return api('/auth/me');
}

export async function refreshSession() {
  const res = await api('/auth/refresh', { method: 'POST' });
  if (res.success) {
    setAccessToken(res.data.accessToken);
  }
  return res;
}
