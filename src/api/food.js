import { api } from './client';

export async function getVendors(venueId) {
  const qs = venueId ? `?venueId=${venueId}` : '';
  return api(`/food/vendors${qs}`);
}

export async function getMenu(vendorId) {
  return api(`/food/vendors/${vendorId}/menu`);
}

export async function getQueueStatus(eventId) {
  const qs = eventId ? `?eventId=${eventId}` : '';
  return api(`/food/queue-status${qs}`);
}
