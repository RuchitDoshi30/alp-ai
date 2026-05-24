// =====================
// FAKE ADS DATA
// =====================

export const ADS = [
  // Fantasy Sports
  {
    id: 'ad1',
    type: 'fantasy',
    brand: 'Dream11',
    tagline: 'Create Your Fantasy Team!',
    desc: 'Win ₹10 Crore this IPL Season',
    cta: 'Play Now',
    badge: '🏆 #1 Fantasy App',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#F59E0B',
    textColor: '#FFFFFF',
    icon: '👑',
    prize: '₹10 Cr',
    prizeLabel: 'Prize Pool',
  },
  {
    id: 'ad2',
    type: 'fantasy',
    brand: 'MPL Sports',
    tagline: 'India\'s Biggest Gaming App',
    desc: 'Win real cash in Fantasy Cricket & more',
    cta: 'Join Free',
    badge: '🎮 5 Crore+ Players',
    gradient: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #2D2D2D 100%)',
    accentColor: '#00D4FF',
    textColor: '#FFFFFF',
    icon: '🎮',
    prize: '₹5 Lakh',
    prizeLabel: 'Daily Prizes',
  },
  // Gaming
  {
    id: 'ad3',
    type: 'gaming',
    brand: 'WinZO Games',
    tagline: 'Play 100+ Games, Win Cash!',
    desc: 'Ludo, Cricket, Pool & more',
    cta: 'Win Now',
    badge: '⚡ Instant Withdrawal',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)',
    accentColor: '#FCD34D',
    textColor: '#FFFFFF',
    icon: '🎯',
    prize: '₹50,000',
    prizeLabel: 'Daily Jackpot',
  },
  {
    id: 'ad4',
    type: 'gaming',
    brand: 'Paytm First Games',
    tagline: 'Games & Cashback Together!',
    desc: 'Get ₹100 bonus on first deposit',
    cta: 'Claim Bonus',
    badge: '💰 100% Safe & Secure',
    gradient: 'linear-gradient(135deg, #0A2540 0%, #00B8D4 100%)',
    accentColor: '#00CCFF',
    textColor: '#FFFFFF',
    icon: '💳',
    prize: '₹100',
    prizeLabel: 'Welcome Bonus',
  },
  // Betting / Sports Book
  {
    id: 'ad5',
    type: 'betting',
    brand: 'SportsBet Pro',
    tagline: 'Live Betting On Every Match',
    desc: 'Best odds guaranteed · 24/7 markets',
    cta: 'Bet Now',
    badge: '📊 Live Odds',
    gradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
    accentColor: '#34D399',
    textColor: '#FFFFFF',
    icon: '📈',
    prize: 'Best',
    prizeLabel: 'Odds',
  },
  {
    id: 'ad6',
    type: 'betting',
    brand: 'CricBet365',
    tagline: 'Predict & Win Big!',
    desc: 'Who will win today? Place your bet!',
    cta: 'Place Bet',
    badge: '🔒 Trusted & Licensed',
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #1E40AF 50%, #2563EB 100%)',
    accentColor: '#60A5FA',
    textColor: '#FFFFFF',
    icon: '🎲',
    prize: '10x',
    prizeLabel: 'Return',
  },
  // Other apps
  {
    id: 'ad7',
    type: 'lifestyle',
    brand: 'Swiggy Instamart',
    tagline: 'Snacks in 10 Minutes!',
    desc: 'Order drinks & snacks to your hotel',
    cta: 'Order Now',
    badge: '🚀 Super Fast Delivery',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
    accentColor: '#FED7AA',
    textColor: '#FFFFFF',
    icon: '🛵',
    prize: '10',
    prizeLabel: 'Min Delivery',
  },
  {
    id: 'ad8',
    type: 'travel',
    brand: 'RedBus',
    tagline: 'Book Your Return Ride!',
    desc: 'Buses & cabs from stadium area',
    cta: 'Book Now',
    badge: '🎟️ Stadium Special Fares',
    gradient: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)',
    accentColor: '#FCA5A5',
    textColor: '#FFFFFF',
    icon: '🚌',
    prize: '20%',
    prizeLabel: 'Off Today',
  },
  {
    id: 'ad9',
    type: 'fantasy',
    brand: 'My11Circle',
    tagline: 'Play with Sourav Ganguly!',
    desc: 'Expert curated fantasy teams',
    cta: 'Join League',
    badge: '🏏 Endorsed by Dada',
    gradient: 'linear-gradient(135deg, #1C1C2E 0%, #2E2E50 50%, #3D3D7A 100%)',
    accentColor: '#818CF8',
    textColor: '#FFFFFF',
    icon: '🏏',
    prize: '₹1 Cr',
    prizeLabel: 'Grand Prize',
  },
  {
    id: 'ad10',
    type: 'gaming',
    brand: 'GameZop',
    tagline: 'Challenge Friends. Win Cash.',
    desc: '200+ instant games in your browser',
    cta: 'Play Free',
    badge: '🆓 No Download Needed',
    gradient: 'linear-gradient(135deg, #BE185D 0%, #DB2777 100%)',
    accentColor: '#FBCFE8',
    textColor: '#FFFFFF',
    icon: '🕹️',
    prize: '₹25K',
    prizeLabel: 'Weekend Pool',
  },
];

// Smart rotate ads
let adIdx = 0;
export function getNextAd() {
  const ad = ADS[adIdx % ADS.length];
  adIdx++;
  return ad;
}

export function getAdsForSport(sportId) {
  // Fantasy/betting ads relevant to sport
  const fantasyFirst = ['ad1', 'ad2', 'ad9'].includes;
  return [...ADS].sort(() => Math.random() - 0.5).slice(0, 6);
}
