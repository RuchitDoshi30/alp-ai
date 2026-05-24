import { api } from './client';

export async function getMyTickets() {
  return api('/tickets/mine');
}

export async function verifyTicket(bookingRef) {
  return api('/tickets/verify', {
    method: 'POST',
    body: JSON.stringify({ bookingRef }),
  });
}
