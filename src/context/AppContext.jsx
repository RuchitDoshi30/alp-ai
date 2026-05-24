import { createContext, useReducer, useEffect, useRef } from 'react';
import { SPORTS, EVENTS_BY_SPORT } from '../data/mockEvent';
import { STANDS } from '../data/mockMenu';
import { SECTIONS, GATES, POIS, addNoise } from '../data/mockCrowd';

export const AppContext = createContext(null);

const savedState = localStorage.getItem('venueiq_state');
let loadedState = null;
try {
  if (savedState) {
    loadedState = JSON.parse(savedState);
  }
} catch (e) {
  console.error('Error loading state from localStorage:', e);
}

const initialState = loadedState || {
  // Onboarding
  onboarded: false,
  selectedSport: null,

  // Navigation
  activePage: 'home',

  // Event & Score
  scoreIdx: 2, // current period index
  liveWaitTimes: {},  // standId -> minutes
  crowdDensities: {}, // sectionId -> 0-1
  gateCongestion: {}, // gateId -> 0-1
  poiWaits: {},       // poiId -> minutes

  // Orders
  cart: [],
  orders: [], // completed orders
  activeOrder: null,

  // Alerts
  alerts: [],

  // AI Chat
  chatMessages: [],
};

function buildLiveWaits(stands) {
  const w = {};
  stands.forEach(s => { w[s.id] = s.baseWait + Math.round((Math.random() - 0.5) * 4); });
  return w;
}

function buildDensities(sections) {
  const d = {};
  sections.forEach(s => { d[s.id] = addNoise(s.baseDensity, 0.15); });
  return d;
}

function buildGateCongestion(gates) {
  const g = {};
  gates.forEach(gate => { g[gate.id] = addNoise(gate.baseCongestion, 0.2); });
  return g;
}

function buildPoiWaits(pois) {
  const w = {};
  pois.forEach(p => {
    if (p.baseWait > 0) {
      w[p.id] = Math.max(1, p.baseWait + Math.round((Math.random() - 0.5) * 3));
    } else {
      w[p.id] = 0;
    }
  });
  return w;
}

function generateAlerts(state) {
  const sport = state.selectedSport;
  const event = EVENTS_BY_SPORT[sport];
  const alerts = [];

  // Crowd-based alert
  const highDensitySections = Object.entries(state.crowdDensities)
    .filter(([, d]) => d > 0.85)
    .map(([id]) => id);

  if (highDensitySections.length > 0) {
    alerts.push({
      id: 'crowd-1',
      type: 'warning',
      icon: '👥',
      title: `${highDensitySections[0]} is very crowded`,
      desc: 'Consider using alternate routes. Sections B1 & D1 are clear.',
    });
  }

  // Food alert based on wait times
  const minWaitStand = Object.entries(state.liveWaitTimes)
    .sort(([, a], [, b]) => a - b)[0];
  if (minWaitStand) {
    const stand = STANDS.find(s => s.id === minWaitStand[0]);
    if (stand) {
      alerts.push({
        id: 'food-1',
        type: 'success',
        icon: '🍽️',
        title: `Shortest queue at ${stand.name}`,
        desc: `Only ${minWaitStand[1]} min wait — Level 1 Block B`,
      });
    }
  }

  // Period-based alert
  const periodIdx = state.scoreIdx;
  if (periodIdx > 0 && event) {
    alerts.push({
      id: 'event-1',
      type: 'info',
      icon: '📢',
      title: sport === 'cricket' ? 'Strategic timeout coming up' : 'Great time for a break!',
      desc: 'Order food now to beat the halftime rush',
    });
  }

  // Gate alert
  const highGate = Object.entries(state.gateCongestion)
    .find(([, v]) => v > 0.8);
  if (highGate) {
    const gate = GATES.find(g => g.id === highGate[0]);
    if (gate) {
      alerts.push({
        id: 'gate-1',
        type: 'accent',
        icon: '🚪',
        title: `${gate.name} congestion`,
        desc: `Use ${gate.direction} alternate — save 8 min`,
      });
    }
  }

  // Parking reminder
  alerts.push({
    id: 'park-1',
    type: 'info',
    icon: '🚗',
    title: 'Plan your exit',
    desc: 'Parking lots P1 fills fast. Leave 5 min early for smooth exit.',
  });

  return alerts;
}

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboarded: true,
        selectedSport: action.sport,
        liveWaitTimes: buildLiveWaits(STANDS),
        crowdDensities: buildDensities(SECTIONS),
        gateCongestion: buildGateCongestion(GATES),
        poiWaits: buildPoiWaits(POIS),
      };

    case 'SET_PAGE':
      return { ...state, activePage: action.page };

    case 'TICK_LIVE_DATA': {
      const newWaits = {};
      STANDS.forEach(s => {
        const cur = state.liveWaitTimes[s.id] || s.baseWait;
        newWaits[s.id] = Math.max(1, Math.min(30, cur + Math.round((Math.random() - 0.5) * 2)));
      });
      const newDensities = {};
      SECTIONS.forEach(s => {
        const cur = state.crowdDensities[s.id] || s.baseDensity;
        newDensities[s.id] = addNoise(cur, 0.06);
      });
      const newGates = {};
      GATES.forEach(g => {
        const cur = state.gateCongestion[g.id] || g.baseCongestion;
        newGates[g.id] = addNoise(cur, 0.08);
      });
      const newPoiWaits = {};
      POIS.forEach(p => {
        if (p.baseWait > 0) {
          const cur = state.poiWaits[p.id] || p.baseWait;
          newPoiWaits[p.id] = Math.max(1, Math.min(20, cur + Math.round((Math.random() - 0.5) * 2)));
        } else {
          newPoiWaits[p.id] = 0;
        }
      });
      const newState = {
        ...state,
        liveWaitTimes: newWaits,
        crowdDensities: newDensities,
        gateCongestion: newGates,
        poiWaits: newPoiWaits,
      };
      return { ...newState, alerts: generateAlerts(newState) };
    }

    case 'ADVANCE_SCORE':
      return {
        ...state,
        scoreIdx: Math.min(
          state.scoreIdx + 1,
          (EVENTS_BY_SPORT[state.selectedSport]?.scores?.home?.length ?? 1) - 1
        ),
      };

    case 'ADD_TO_CART': {
      const exists = state.cart.find(i => i.id === action.item.id);
      if (exists) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.item, qty: 1 }] };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart
          .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0),
      };

    case 'PLACE_ORDER': {
      const order = {
        id: `ORD-${Date.now()}`,
        items: [...state.cart],
        total: state.cart.reduce((s, i) => s + i.price * i.qty, 0),
        status: 0, // 0=received, 1=prep, 2=ready, 3=delivered
        placedAt: new Date().toISOString(),
      };
      return { ...state, cart: [], activeOrder: order, orders: [order, ...state.orders] };
    }

    case 'ADVANCE_ORDER': {
      if (!state.activeOrder) return state;
      const updated = { ...state.activeOrder, status: Math.min(3, state.activeOrder.status + 1) };
      return {
        ...state,
        activeOrder: updated,
        orders: state.orders.map(o => o.id === updated.id ? updated : o),
      };
    }

    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };

    case 'SET_SPORT':
      return { 
        ...state, 
        selectedSport: action.sport, 
        onboarded: false, // Switching sports requires entering ticket details again!
        scoreIdx: 2 
      };

    case 'RESET_PORTAL':
      // Clear localStorage explicitly
      localStorage.removeItem('venueiq_state');
      return {
        onboarded: false,
        selectedSport: null,
        activePage: 'home',
        scoreIdx: 2,
        liveWaitTimes: {},
        crowdDensities: {},
        gateCongestion: {},
        poiWaits: {},
        cart: [],
        orders: [],
        activeOrder: null,
        alerts: [],
        chatMessages: [],
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const orderTimerRef = useRef(null);

  // Live data tick every 5 seconds
  useEffect(() => {
    if (!state.onboarded) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_LIVE_DATA' });
    }, 5000);
    return () => clearInterval(interval);
  }, [state.onboarded]);

  // Advance score periodically (every 20 seconds)
  useEffect(() => {
    if (!state.onboarded) return;
    const interval = setInterval(() => {
      dispatch({ type: 'ADVANCE_SCORE' });
    }, 20000);
    return () => clearInterval(interval);
  }, [state.onboarded]);

  // Auto-advance order status
  useEffect(() => {
    if (state.activeOrder && state.activeOrder.status < 3) {
      orderTimerRef.current = setTimeout(() => {
        dispatch({ type: 'ADVANCE_ORDER' });
      }, 8000);
    }
    return () => clearTimeout(orderTimerRef.current);
  }, [state.activeOrder?.status]);

  // Save state to localStorage on every change
  useEffect(() => {
    localStorage.setItem('venueiq_state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

