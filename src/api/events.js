import { api } from './client';

export async function getEvents(sport, status) {
  const params = new URLSearchParams();
  if (sport) params.set('sport', sport);
  if (status) params.set('status', status);
  const qs = params.toString();
  return api(`/events${qs ? '?' + qs : ''}`);
}

export async function getEvent(id) {
  return api(`/events/${id}`);
}
