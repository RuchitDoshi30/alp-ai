// Crowd & venue data simulation

export const SECTIONS = [
  { id: 'A1', label: 'A1', x: 146, y: 44, w: 52, h: 36, baseDensity: 0.85 },
  { id: 'A2', label: 'A2', x: 232, y: 44, w: 52, h: 36, baseDensity: 0.90 },
  { id: 'B2', label: 'B2', x: 82, y: 78, w: 52, h: 36, baseDensity: 0.95 },
  { id: 'B3', label: 'B3', x: 296, y: 78, w: 52, h: 36, baseDensity: 0.88 },
  { id: 'B1', label: 'B1', x: 42, y: 124, w: 52, h: 36, baseDensity: 0.70 },
  { id: 'B4', label: 'B4', x: 336, y: 124, w: 52, h: 36, baseDensity: 0.72 },
  { id: 'C1', label: 'C1', x: 42, y: 180, w: 52, h: 36, baseDensity: 0.60 },
  { id: 'C4', label: 'C4', x: 336, y: 180, w: 52, h: 36, baseDensity: 0.55 },
  { id: 'C2', label: 'C2', x: 82, y: 226, w: 52, h: 36, baseDensity: 0.78 },
  { id: 'C3', label: 'C3', x: 296, y: 226, w: 52, h: 36, baseDensity: 0.82 },
  { id: 'D1', label: 'D1', x: 146, y: 260, w: 52, h: 36, baseDensity: 0.40 },
  { id: 'D2', label: 'D2', x: 232, y: 260, w: 52, h: 36, baseDensity: 0.45 },
];

export const GATES = [
  { id: 'A', name: 'Gate A', direction: 'North Main', baseCongestion: 0.75 },
  { id: 'B', name: 'Gate B', direction: 'East VIP', baseCongestion: 0.45 },
  { id: 'C', name: 'Gate C', direction: 'West Family', baseCongestion: 0.88 },
  { id: 'D', name: 'Gate D', direction: 'South General', baseCongestion: 0.62 },
];

export const POIS = [
  { id: 'r1', type: 'restroom', name: 'Restrooms (Level 1)', icon: '🚻', loc: 'Near Gate B', distance: '45m', baseWait: 3, x: 382, y: 148 },
  { id: 'r2', type: 'restroom', name: 'Restrooms (Level 2)', icon: '🚻', loc: 'Block C Central', distance: '85m', baseWait: 7, x: 48, y: 152 },
  { id: 'r3', type: 'restroom', name: 'Restrooms (Level 3)', icon: '🚻', loc: 'VIP Section', distance: '120m', baseWait: 2, x: 215, y: 35 },
  { id: 'f1', type: 'food', name: 'Spice Bowl', icon: '🍛', loc: 'Level 2, Block A', distance: '65m', baseWait: 8, x: 180, y: 25 },
  { id: 'f2', type: 'food', name: 'Grill Zone', icon: '🍗', loc: 'Level 1, Block C', distance: '110m', baseWait: 14, x: 70, y: 222 },
  { id: 'f3', type: 'food', name: 'Sip & Go', icon: '🥤', loc: 'Level 1, Block B', distance: '40m', baseWait: 4, x: 360, y: 110 },
  { id: 'f4', type: 'food', name: 'Snack Shack', icon: '🍿', loc: 'Level 3, Block D', distance: '130m', baseWait: 6, x: 250, y: 310 },
  { id: 'e1', type: 'exit', name: 'Exit A (North)', icon: '🚪', loc: 'Gate A', distance: '180m', baseWait: 0, x: 215, y: 12 },
  { id: 'e2', type: 'exit', name: 'Exit B (East)', icon: '🚪', loc: 'Gate B', distance: '95m', baseWait: 0, x: 410, y: 170 },
  { id: 'e3', type: 'exit', name: 'Exit C (West)', icon: '🚪', loc: 'Gate C', distance: '200m', baseWait: 0, x: 20, y: 170 },
  { id: 'aid1', type: 'medical', name: 'First Aid Post', icon: '🏥', loc: 'Level 1, Gate A vicinity', distance: '75m', baseWait: 0, x: 245, y: 20 },
  { id: 'aid2', type: 'medical', name: 'Medical Room', icon: '⚕️', loc: 'Level 2, Block B', distance: '90m', baseWait: 0, x: 340, y: 230 },
  { id: 'p1', type: 'parking', name: 'Parking Lot P1', icon: '🅿️', loc: 'North Entrance', distance: '350m', baseWait: 0, x: 170, y: 15 },
  { id: 'p2', type: 'parking', name: 'Parking Lot P2', icon: '🅿️', loc: 'East Entrance', distance: '280m', baseWait: 0, x: 400, y: 210 },
];

export const POI_TYPES = [
  { key: 'all', label: 'All', icon: '📍' },
  { key: 'food', label: 'Food', icon: '🍽️' },
  { key: 'restroom', label: 'Restrooms', icon: '🚻' },
  { key: 'exit', label: 'Exits', icon: '🚪' },
  { key: 'medical', label: 'Medical', icon: '🏥' },
  { key: 'parking', label: 'Parking', icon: '🅿️' },
];

// Noise function to simulate organic variance
export function addNoise(base, factor = 0.12) {
  return Math.max(0.05, Math.min(1.0, base + (Math.random() - 0.5) * factor));
}

export function getDensityColor(density, opacity = 0.7) {
  if (density < 0.4) return `rgba(16, 185, 129, ${opacity})`;   // green
  if (density < 0.65) return `rgba(245, 158, 11, ${opacity})`;  // amber
  if (density < 0.85) return `rgba(249, 115, 22, ${opacity})`;  // orange
  return `rgba(239, 68, 68, ${opacity})`;                       // red
}

export function getWaitLevel(wait) {
  if (wait <= 5) return 'low';
  if (wait <= 12) return 'medium';
  return 'high';
}

export function getWaitBarWidth(wait) {
  return Math.min(100, (wait / 25) * 100);
}
