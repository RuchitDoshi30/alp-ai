import { api } from './client';

export async function createOrder(eventId, vendorId, deliverySeat, items) {
  return api('/orders', {
    method: 'POST',
    body: JSON.stringify({ eventId, vendorId, deliverySeat, items }),
  });
}

export async function getMyOrders() {
  return api('/orders/mine');
}

export async function updateOrderStatus(orderId, status) {
  return api(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
