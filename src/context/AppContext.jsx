import { createContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshSession } from '../api/auth';
import { getEvents } from '../api/events';
import { getCrowdData } from '../api/venues';
import { getMyTickets, verifyTicket } from '../api/tickets';
import { getVendors, getQueueStatus } from '../api/food';
import { setAccessToken } from '../api/client';

export const AppContext = createContext(null);

const defaultWelcomeNotif = {
  id: 'welcome',
  title: 'Welcome to VenueIQ!',
  desc: 'Explore crowd densities, order food to your seat, and ask Gemini for help.',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  type: 'success',
  icon: '🎉',
  read: false,
};

const initialState = {
  // Onboarding (same flow as before)
  onboarded: false,
  selectedSport: null,

  // Auth (transparent to user)
  user: null,

  // Live data from API
  event: null,
  venue: null,
  ticket: null,
  crowdZones: [],
  gates: [],
  vendors: [],
  queueStatuses: [],

  // Navigation
  activePage: 'home',
  poiFilter: 'all',

  // Client-side state
  cart: [],
  orders: [],
  activeOrder: null,
  alerts: [],
  chatMessages: [],
  notifications: [defaultWelcomeNotif],
};

function generateAlerts(state) {
  const alerts = [];

  const highDensityZones = (state.crowdZones || []).filter(z => z.density > 0.85);
  if (highDensityZones.length > 0) {
    alerts.push({
      id: 'crowd-1', type: 'warning', icon: '👥',
      title: `${highDensityZones[0].zoneName} is very crowded`,
      desc: 'Consider using alternate routes to lower-density sections.',
    });
  }

  const sortedQueues = [...(state.queueStatuses || [])].sort((a, b) => a.waitMinutes - b.waitMinutes);
  if (sortedQueues.length > 0 && sortedQueues[0].vendor) {
    alerts.push({
      id: 'food-1', type: 'success', icon: '🍽️',
      title: `Shortest queue at ${sortedQueues[0].vendor.name}`,
      desc: `Only ${sortedQueues[0].waitMinutes} min wait`,
    });
  }

  const highGate = (state.gates || []).find(g => g.congestion > 0.8);
  if (highGate) {
    alerts.push({
      id: 'gate-1', type: 'accent', icon: '🚪',
      title: `${highGate.name} congestion`,
      desc: `${highGate.direction} — try an alternate gate`,
    });
  }

  if (state.event) {
    alerts.push({
      id: 'event-1', type: 'info', icon: '📢',
      title: state.event.status === 'live' ? 'Match is LIVE!' : 'Event update',
      desc: `${state.event.title} at ${state.venue?.name || 'the stadium'}`,
    });
  }

  alerts.push({
    id: 'park-1', type: 'info', icon: '🚗',
    title: 'Plan your exit',
    desc: 'Parking lots fill fast. Leave 5 min early for a smooth exit.',
  });

  return alerts;
}

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboarded: true,
        selectedSport: action.sport || state.selectedSport,
        user: action.user || state.user,
        event: action.event || state.event,
        venue: action.venue || state.venue,
        ticket: action.ticket || state.ticket,
        crowdZones: action.crowdZones || state.crowdZones,
        gates: action.gates || state.gates,
        vendors: action.vendors || state.vendors,
        queueStatuses: action.queueStatuses || state.queueStatuses,
        alerts: generateAlerts({
          ...state,
          crowdZones: action.crowdZones || state.crowdZones,
          gates: action.gates || state.gates,
          queueStatuses: action.queueStatuses || state.queueStatuses,
          event: action.event || state.event,
          venue: action.venue || state.venue,
        }),
      };

    case 'SET_LIVE_DATA': {
      const newState = {
        ...state,
        event: action.event ?? state.event,
        venue: action.venue ?? state.venue,
        ticket: action.ticket ?? state.ticket,
        crowdZones: action.crowdZones ?? state.crowdZones,
        gates: action.gates ?? state.gates,
        vendors: action.vendors ?? state.vendors,
        queueStatuses: action.queueStatuses ?? state.queueStatuses,
      };
      return { ...newState, alerts: generateAlerts(newState) };
    }

    case 'REFRESH_CROWD': {
      const newState = {
        ...state,
        crowdZones: action.crowdZones ?? state.crowdZones,
        gates: action.gates ?? state.gates,
        queueStatuses: action.queueStatuses ?? state.queueStatuses,
      };
      return { ...newState, alerts: generateAlerts(newState) };
    }

    case 'SET_PAGE':
      return { ...state, activePage: action.page };

    case 'SET_POI_FILTER':
      return { ...state, poiFilter: action.filter };

    case 'ADD_TO_CART': {
      const exists = state.cart.find(i => i.id === action.item.id);
      if (exists) {
        return { ...state, cart: state.cart.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { ...action.item, qty: 1 }] };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0),
      };

    case 'PLACE_ORDER': {
      const order = {
        id: action.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        items: [...state.cart],
        total: state.cart.reduce((s, i) => s + i.price * i.qty, 0),
        status: 0,
        placedAt: new Date().toISOString(),
      };
      const orderNotif = {
        id: `notif-order-${Date.now()}`,
        title: 'Order Placed!',
        desc: `Your order ${order.id} has been received.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'success', icon: '🍔', read: false,
      };
      return {
        ...state, cart: [], activeOrder: order,
        orders: [order, ...state.orders],
        notifications: [orderNotif, ...(state.notifications || [])],
      };
    }

    case 'ADVANCE_ORDER': {
      if (!state.activeOrder) return state;
      const newStatus = Math.min(3, state.activeOrder.status + 1);
      const updated = { ...state.activeOrder, status: newStatus };
      const statusLabels = ['Received', 'Preparing', 'Ready for Pickup', 'Delivered'];
      const statusIcons = ['🛒', '👨‍🍳', '📦', '✅'];
      const statusDescs = [
        `Order ${updated.id} has been received.`,
        `Chef is preparing your order ${updated.id}.`,
        `Order ${updated.id} is ready at the counter!`,
        `Order ${updated.id} has been delivered.`,
      ];
      const statusNotif = {
        id: `notif-order-status-${Date.now()}`,
        title: `Order Status: ${statusLabels[newStatus]}`,
        desc: statusDescs[newStatus],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: newStatus === 3 ? 'success' : newStatus === 2 ? 'accent' : 'info',
        icon: statusIcons[newStatus], read: false,
      };
      return {
        ...state, activeOrder: updated,
        orders: state.orders.map(o => o.id === updated.id ? updated : o),
        notifications: [statusNotif, ...(state.notifications || [])],
      };
    }

    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };

    case 'SUBMIT_PREDICTION': {
      const predNotif = {
        id: `notif-prediction-${Date.now()}`,
        title: 'Prediction Locked!',
        desc: `You predicted ${action.team} will score next! Reward coupon: ${action.coupon} (${action.reward}).`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'success', icon: '🎯', read: false,
      };
      return { ...state, notifications: [predNotif, ...(state.notifications || [])] };
    }

    case 'ADD_NOTIFICATION': {
      const newNotif = {
        id: `notif-custom-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false, ...action.notification,
      };
      return { ...state, notifications: [newNotif, ...(state.notifications || [])] };
    }

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notifications: (state.notifications || []).map(n => ({ ...n, read: true })) };

    case 'RESET_PORTAL':
      return { ...initialState };

    case 'SET_SPORT':
      return {
        ...state, selectedSport: action.sport, onboarded: false,
        notifications: [{
          id: `notif-switch-${Date.now()}`,
          title: `Sport switched`,
          desc: 'Complete your ticket verification to enter the match portal.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'info', icon: '🔄', read: false,
        }, ...(state.notifications || [])],
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const orderTimerRef = useRef(null);

  // ─── Refresh crowd data every 15 seconds while in portal ──
  useEffect(() => {
    if (!state.onboarded || !state.venue?.id) return;
    const interval = setInterval(async () => {
      try {
        const crowdRes = await getCrowdData(state.venue.id);
        const queueRes = state.event?.id ? await getQueueStatus(state.event.id) : { data: [] };
        dispatch({
          type: 'REFRESH_CROWD',
          crowdZones: crowdRes.data?.zones || [],
          gates: crowdRes.data?.gates || [],
          queueStatuses: queueRes.data || [],
        });
      } catch { /* silent */ }
    }, 15000);
    return () => clearInterval(interval);
  }, [state.onboarded, state.venue?.id, state.event?.id]);

  // ─── Auto-advance order status ───────────────────────────
  useEffect(() => {
    if (state.activeOrder && state.activeOrder.status < 3) {
      orderTimerRef.current = setTimeout(() => dispatch({ type: 'ADVANCE_ORDER' }), 8000);
    }
    return () => clearTimeout(orderTimerRef.current);
  }, [state.activeOrder?.status]);

  // ─── Onboarding action: register/login + verify ticket + fetch all data ──
  const completeOnboarding = async ({ bookingRef, name, email, phone, sport }) => {
    // 1. Register or login the user
    let user = null;
    try {
      const regRes = await apiRegister(email, 'venueiq2025', name, phone);
      user = regRes.data?.user;
    } catch (err) {
      // Already registered — login instead
      try {
        const loginRes = await apiLogin(email, 'venueiq2025');
        user = loginRes.data?.user;
      } catch (loginErr) {
        console.error('Auth failed:', loginErr);
        throw new Error('Authentication failed. Please try again.');
      }
    }

    // 2. Verify ticket
    let ticket = null;
    try {
      const ticketRes = await verifyTicket(bookingRef);
      ticket = ticketRes.data || null;
    } catch {
      // Ticket not found — continue without (guest mode)
    }

    // 3. Fetch events
    let event = null;
    try {
      const eventsRes = await getEvents(sport, 'live');
      event = eventsRes.data?.[0] || null;
      if (!event) {
        const allEvents = await getEvents(sport);
        event = allEvents.data?.[0] || null;
      }
    } catch { /* no events */ }

    // 4. Fetch venue + crowd data
    const venue = event?.venue || ticket?.event?.venue || null;
    let crowdZones = [], gates = [];
    if (venue?.id) {
      try {
        const crowdRes = await getCrowdData(venue.id);
        crowdZones = crowdRes.data?.zones || [];
        gates = crowdRes.data?.gates || [];
      } catch { /* fallback */ }
    }

    // 5. Fetch food vendors + queues
    let vendors = [], queueStatuses = [];
    try {
      const vendorsRes = await getVendors(venue?.id);
      vendors = vendorsRes.data || [];
    } catch { /* fallback */ }
    if (event?.id) {
      try {
        const queueRes = await getQueueStatus(event.id);
        queueStatuses = queueRes.data || [];
      } catch { /* fallback */ }
    }

    // 6. Dispatch everything at once
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      sport, user, event, venue, ticket,
      crowdZones, gates, vendors, queueStatuses,
    });

    return { user, event, ticket, venue };
  };

  const logout = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    dispatch({ type: 'RESET_PORTAL' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, completeOnboarding, logout }}>
      {children}
    </AppContext.Provider>
  );
}
