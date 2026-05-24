// =====================
// SPORTS CONFIG
// =====================
export const SPORTS = {
  cricket:    { id: 'cricket',    name: 'Cricket',    icon: '🏏', color: '#2563EB', details: ['Run Rate','Wickets','Extras'] },
  football:   { id: 'football',   name: 'Football',   icon: '⚽', color: '#10B981', details: ['Possession','Shots','Fouls'] },
  basketball: { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#F97316', details: ['Rebounds','Assists','Fouls'] },
  hockey:     { id: 'hockey',     name: 'Hockey',     icon: '🏑', color: '#8B5CF6', details: ['Possession','Shots','PCs'] },
  tennis:     { id: 'tennis',     name: 'Tennis',     icon: '🎾', color: '#F59E0B', details: ['Aces','Faults','Break Pts'] },
  kabaddi:    { id: 'kabaddi',    name: 'Kabaddi',    icon: '🤼', color: '#EF4444', details: ['Raids','Tackles','All-Outs'] },
};

// =====================
// TICKET PREFIX → SPORT MAPPING
// =====================
export const TICKET_PREFIXES = {
  'CRI': 'cricket',  'IPL': 'cricket',  'T20': 'cricket',  'ODI': 'cricket',
  'FBL': 'football', 'ISL': 'football', 'EPL': 'football', 'FCB': 'football',
  'BBL': 'basketball','NBA': 'basketball','BAL': 'basketball',
  'HOC': 'hockey',   'FIH': 'hockey',   'HIL': 'hockey',
  'TEN': 'tennis',   'ATP': 'tennis',   'WTA': 'tennis',
  'KBD': 'kabaddi',  'PKL': 'kabaddi',
  // Generic / Demo
  'VIQ': 'cricket',  'STD': 'football', 'ARP': 'basketball',
};

// Smart detect sport from booking reference string
export function detectSportFromRef(ref) {
  if (!ref) return null;
  const upper = ref.toUpperCase().replace(/[-\s]/g, '');
  for (const [prefix, sport] of Object.entries(TICKET_PREFIXES)) {
    if (upper.startsWith(prefix)) return sport;
  }
  // Fallback: checksum-based
  const sum = upper.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const sports = Object.keys(SPORTS);
  return sports[sum % sports.length];
}

// =====================
// EVENTS BY SPORT  (richer data)
// =====================
export const EVENTS_BY_SPORT = {
  cricket: {
    home: { name: 'Mumbai Indians', emoji: '🦁', shortName: 'MI', color: '#004BA0' },
    away: { name: 'Chennai Super Kings', emoji: '🦅', shortName: 'CSK', color: '#FFC72C' },
    venue: 'Wankhede Stadium', city: 'Mumbai, Maharashtra',
    gate: 'Gate D', totalCapacity: 33000, currentAttendance: 31200,
    matchTitle: 'MI vs CSK — IPL 2025', league: 'Indian Premier League',
    eventDate: 'Sat, 24 May 2025 · 7:30 PM',
    section: 'P', row: '14', seat: '23',
    scores: { home: [0,45,78,112,156,189,210,234], away: [0,38,71,105,142,178,198,221] },
    periods: ['PP1','PP2','Mid','Mid2','Death','Inn2','Inn2-2','Inn2-3'],
    periodLabel: 'Overs',
    extras: [
      { label: 'Run Rate',  vals: ['—','9.0','9.75','9.33','9.75','10.5','10.5','10.45'] },
      { label: 'Wickets',   vals: ['0','1','1','2','2','3','4','5'] },
      { label: 'Extras',    vals: ['0','4','8','10','12','14','14','16'] },
    ],
    recentEvents: [
      { time: '2s', icon: '🏏', text: 'Rohit hits SIX off Bumrah!' },
      { time: '45s', icon: '🎯', text: 'Wicket! Kohli caught at mid-off' },
      { time: '2m', icon: '🏏', text: 'FOUR! Hardik punishes the short ball' },
      { time: '4m', icon: '⚡', text: 'Wide ball — 1 extra to CSK' },
    ],
  },
  football: {
    home: { name: 'Mumbai City FC', emoji: '🔵', shortName: 'MCFC', color: '#1A85FF' },
    away: { name: 'Bengaluru FC', emoji: '🔴', shortName: 'BFC', color: '#D9000D' },
    venue: 'Mumbai Football Arena', city: 'Mumbai, Maharashtra',
    gate: 'Gate A', totalCapacity: 8000, currentAttendance: 7600,
    matchTitle: 'Mumbai City vs Bengaluru FC', league: 'Indian Super League',
    eventDate: 'Sat, 24 May 2025 · 8:00 PM',
    section: 'D', row: '8', seat: '41',
    scores: { home: [0,0,1,1,2,2,2,3], away: [0,0,0,1,1,1,2,2] },
    periods: ["0'","15'","30'","45'","60'","75'","85'","90'"],
    periodLabel: 'Minute',
    extras: [
      { label: 'Possession', vals: ['50%','54%','56%','52%','58%','60%','57%','55%'] },
      { label: 'Shots',      vals: ['0','3','6','8','11','14','16','19'] },
      { label: 'Fouls',      vals: ['0','2','4','6','7','9','11','13'] },
    ],
    recentEvents: [
      { time: '1m', icon: '⚽', text: 'GOAL! Chhangte scores for MCFC 2-1!' },
      { time: '3m', icon: '🟨', text: 'Yellow card — Harmanjot Khabra' },
      { time: '6m', icon: '🥅', text: 'Shot on target saved by keeper' },
      { time: '9m', icon: '⚽', text: 'Corner kick — BFC defend well' },
    ],
  },
  basketball: {
    home: { name: 'Mumbai Dragons', emoji: '🐉', shortName: 'MBD', color: '#FF6B35' },
    away: { name: 'Delhi Capitals', emoji: '🦁', shortName: 'DC', color: '#1A1A2E' },
    venue: 'NSCI Dome', city: 'Mumbai, Maharashtra',
    gate: 'Gate B', totalCapacity: 12000, currentAttendance: 10800,
    matchTitle: 'Mumbai Dragons vs Delhi Capitals', league: 'Basketball League India',
    eventDate: 'Sat, 24 May 2025 · 6:30 PM',
    section: 'A', row: '3', seat: '17',
    scores: { home: [0,22,54,81,110], away: [0,18,49,75,102] },
    periods: ['Pre','Q1','Q2','Q3','Q4'],
    periodLabel: 'Quarter',
    extras: [
      { label: 'Rebounds', vals: ['0','12','24','37','45'] },
      { label: 'Assists',  vals: ['0','6','14','20','27'] },
      { label: 'Fouls',    vals: ['0','4','10','15','18'] },
    ],
    recentEvents: [
      { time: '30s', icon: '🏀', text: '3-pointer! Mumbai Dragons lead by 8' },
      { time: '2m', icon: '🎯', text: 'Free throws x2 — Delhi Capitals' },
      { time: '4m', icon: '🏀', text: 'Fast break! Lay-up for Mumbai' },
      { time: '6m', icon: '⚠️', text: 'Timeout called — Delhi Capitals' },
    ],
  },
  hockey: {
    home: { name: 'India', emoji: '🇮🇳', shortName: 'IND', color: '#FF9933' },
    away: { name: 'Australia', emoji: '🇦🇺', shortName: 'AUS', color: '#00843D' },
    venue: 'Maj. Dhyan Chand Stadium', city: 'New Delhi',
    gate: 'Gate C', totalCapacity: 16000, currentAttendance: 15400,
    matchTitle: 'India vs Australia — FIH Pro League', league: 'FIH Pro League',
    eventDate: 'Sat, 24 May 2025 · 7:00 PM',
    section: 'B', row: '11', seat: '5',
    scores: { home: [0,1,1,2,3], away: [0,0,1,2,2] },
    periods: ['Pre','Q1','Q2','Q3','Q4'],
    periodLabel: 'Quarter',
    extras: [
      { label: 'Possession', vals: ['50%','48%','52%','56%','53%'] },
      { label: 'Shots',      vals: ['0','5','9','14','18'] },
      { label: 'PCs',        vals: ['0','2','3','5','7'] },
    ],
    recentEvents: [
      { time: '1m', icon: '🏑', text: 'GOAL! Harmanpreet penalty corner!' },
      { time: '3m', icon: '🟥', text: 'Video referral — goal stands!' },
      { time: '5m', icon: '🏑', text: 'Penalty corner awarded to India' },
      { time: '8m', icon: '🛡️', text: 'PR Sreejesh brilliant save!' },
    ],
  },
  tennis: {
    home: { name: 'Sumit Nagal', emoji: '🎾', shortName: 'NAG', color: '#2563EB' },
    away: { name: 'Carlos Alcaraz', emoji: '🎾', shortName: 'ALC', color: '#DC2626' },
    venue: 'KSLTA Stadium', city: 'Bengaluru, Karnataka',
    gate: 'Gate E', totalCapacity: 5000, currentAttendance: 4800,
    matchTitle: 'Nagal vs Alcaraz — Exhibition', league: 'India Open Exhibition',
    eventDate: 'Sat, 24 May 2025 · 5:00 PM',
    section: 'C', row: '6', seat: '12',
    scores: { home: [0,6,3,5], away: [0,4,6,7] },
    periods: ['Pre','Set 1','Set 2','Set 3'],
    periodLabel: 'Set',
    extras: [
      { label: 'Aces',      vals: ['0','4','6','9'] },
      { label: 'Faults',    vals: ['0','3','5','7'] },
      { label: 'Break Pts', vals: ['0','2','4','5'] },
    ],
    recentEvents: [
      { time: '30s', icon: '🎾', text: 'ACE! Alcaraz 140 km/h serve' },
      { time: '2m', icon: '🏆', text: 'Break point — Nagal fights back!' },
      { time: '5m', icon: '🎾', text: 'Rally 28 shots — Alcaraz wins' },
      { time: '8m', icon: '📢', text: 'Medical timeout — 3 minutes' },
    ],
  },
  kabaddi: {
    home: { name: 'Patna Pirates', emoji: '⚓', shortName: 'PAT', color: '#F59E0B' },
    away: { name: 'Jaipur Pink Panthers', emoji: '🐆', shortName: 'JPP', color: '#EC4899' },
    venue: 'Patna Indoor Stadium', city: 'Patna, Bihar',
    gate: 'Gate F', totalCapacity: 6000, currentAttendance: 5700,
    matchTitle: 'Patna Pirates vs Jaipur Panthers — PKL', league: 'Pro Kabaddi League',
    eventDate: 'Sat, 24 May 2025 · 8:30 PM',
    section: 'G', row: '2', seat: '7',
    scores: { home: [0,12,24,38], away: [0,9,20,34] },
    periods: ['Pre','H1-Early','H1-End','H2'],
    periodLabel: 'Half',
    extras: [
      { label: 'Raids',    vals: ['0','10','20','32'] },
      { label: 'Tackles',  vals: ['0','8','15','22'] },
      { label: 'All-Outs', vals: ['0','1','2','3'] },
    ],
    recentEvents: [
      { time: '20s', icon: '🤼', text: 'Super Raid! Sachin T scores 3 pts' },
      { time: '2m', icon: '🚫', text: 'All-Out! Patna Pirates ahead by 8' },
      { time: '4m', icon: '🤼', text: 'Tackle! Jaipur stops the raider' },
      { time: '6m', icon: '⚡', text: 'Bonus point for Patna Pirates' },
    ],
  },
};
