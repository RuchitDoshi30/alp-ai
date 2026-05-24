import { api } from './client';

export async function getVenue(id) {
  return api(`/venues/${id}`);
}

export async function getCrowdData(venueId) {
  return api(`/venues/${venueId}/crowd`);
}
