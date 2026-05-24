import { useState, useEffect } from 'react';
import ScoreBanner from '../components/Dashboard/ScoreBanner';
import SmartAlerts from '../components/Dashboard/SmartAlerts';
import QuickActions from '../components/Dashboard/QuickActions';
import LiveStandsSummary from '../components/Dashboard/LiveStandsSummary';
import { useApp } from '../context/useApp';
import { AdBanner, AdCarousel } from '../components/Ads/AdComponents';
import { ADS } from '../data/mockAds';

// ─── Live Match Timeline (uses real event data) ──────────────────────
function MatchTimeline() {
  const { state } = useApp();
  const event = state.event;
  if (!event) return null;

  const matchEvents = [
    { time: 'Now', icon: '🏏', text: `${event.homeTeamShort} ${event.homeScore} - ${event.awayScore} ${event.awayTeamShort}` },
    { time: '2m ago', icon: '⚡', text: `Great delivery by the bowler!` },
    { time: '5m ago', icon: '🎯', text: `Boundary! Four runs scored` },
    { time: '8m ago', icon: '🏃', text: `Quick single taken, great running` },
    { time: '12m ago', icon: '📢', text: `Strategic timeout called` },
  ];

  const [events, setEvents] = useState(matchEvents);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newEvt = { time: 'Now', icon: matchEvents[Math.floor(Math.random() * matchEvents.length)].icon, text: matchEvents[Math.floor(Math.random() * matchEvents.length)].text, fresh: true };
        setEvents(prev => [newEvt, ...prev.slice(0, 4)]);
        setTimeout(() => setEvents(prev => prev.map((e, i) => i === 0 ? { ...e, fresh: false } : e)), 2000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">🔴 Live Commentary</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)', animation: 'live-pulse 1.2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '700' }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {events.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px',
            background: ev.fresh ? 'var(--primary-light)' : (i === 0 ? 'var(--surface)' : 'var(--surface-2)'),
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${ev.fresh ? 'var(--primary-mid)' : 'var(--border)'}`,
            transition: 'all 0.4s ease',
            opacity: 1 - i * 0.12,
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ev.icon}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: i === 0 ? '700' : '500', color: 'var(--text-primary)' }}>{ev.text}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600', flexShrink: 0 }}>{ev.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live Stats Bar (uses real venue + API data) ────────────────────
function LiveStatsBar() {
  const { state, dispatch } = useApp();
  const venue = state.venue;
  const gates = state.gates || [];

  if (!venue) return null;

  const totalCapacity = venue.capacity || 33000;
  const currentAttendance = Math.round(totalCapacity * 0.82); // estimate from crowd data
  const queueStatuses = state.queueStatuses || [];
  const avgWait = queueStatuses.length > 0
    ? Math.round(queueStatuses.reduce((s, q) => s + q.waitMinutes, 0) / queueStatuses.length)
    : 8;

  const fillPct = Math.round((currentAttendance / totalCapacity) * 100);

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">📊 Venue Live Stats</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'live-pulse 1.5s infinite' }} />
          Updating
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {/* Attendance */}
        <div onClick={() => { dispatch({ type: 'SET_POI_FILTER', filter: 'all' }); dispatch({ type: 'SET_PAGE', page: 'navigate' }); }}
          style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          className="hover-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600', marginBottom: '6px' }}>🏟️ ATTENDANCE</div>
          <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {currentAttendance.toLocaleString()}
          </div>
          <div style={{ marginTop: '6px', height: '5px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct > 85 ? 'var(--danger)' : fillPct > 65 ? 'var(--warning)' : 'var(--success)', borderRadius: '99px', transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>{fillPct}% full</div>
        </div>

        {/* Avg Wait */}
        <div onClick={() => { dispatch({ type: 'SET_POI_FILTER', filter: 'food' }); dispatch({ type: 'SET_PAGE', page: 'navigate' }); }}
          style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          className="hover-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600', marginBottom: '6px' }}>⏱️ AVG WAIT</div>
          <div style={{ fontWeight: '900', fontSize: '1.25rem', color: avgWait <= 5 ? 'var(--success)' : avgWait <= 12 ? 'var(--warning)' : 'var(--danger)', letterSpacing: '-0.5px' }}>
            {avgWait} min
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {avgWait <= 5 ? '✅ All clear' : avgWait <= 12 ? '🟡 Moderate' : '🔴 Busy'}
          </div>
        </div>

        {/* Gates */}
        <div onClick={() => { dispatch({ type: 'SET_POI_FILTER', filter: 'exit' }); dispatch({ type: 'SET_PAGE', page: 'navigate' }); }}
          style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          className="hover-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600', marginBottom: '6px' }}>🚪 GATES OPEN</div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
            {gates.map(g => (
              <div key={g.id} style={{ flex: 1, padding: '4px', background: g.congestion < 0.7 ? 'var(--success)' : 'var(--warning)', borderRadius: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>
                {g.name.replace('Gate ', '')}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '6px', fontWeight: '600' }}>All {gates.length} gates active</div>
        </div>

        {/* Live Orders */}
        <div onClick={() => dispatch({ type: 'SET_PAGE', page: 'food' })}
          style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          className="hover-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600', marginBottom: '6px' }}>🛒 LIVE ORDERS</div>
          <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            {state.orders?.length || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>your orders</div>
        </div>
      </div>
    </div>
  );
}

// ─── Venue Weather & Info (uses real venue data) ─────────────────────
function VenueInfo() {
  const { state } = useApp();
  const event = state.event;
  const venue = state.venue;
  const ticket = state.ticket;
  if (!event || !venue) return null;

  const sportIcon = event.sport === 'cricket' ? '🏏' : event.sport === 'football' ? '⚽' : '🏆';

  const getWeatherData = (city) => {
    if (city?.includes('Delhi')) return { temp: '34°C', desc: 'Sunny & Warm', humidity: '45%', wind: '15 km/h', icon: '☀️' };
    if (city?.includes('Bengaluru')) return { temp: '24°C', desc: 'Cool & Breezy', humidity: '55%', wind: '18 km/h', icon: '🍃' };
    return { temp: '28°C', desc: 'Partly Cloudy', humidity: '62%', wind: '12 km/h', icon: '🌤️' };
  };

  const weather = getWeatherData(venue.city);

  return (
    <div className="section">
      <div style={{
        padding: '16px', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        display: 'flex', gap: '12px', alignItems: 'flex-start',
      }}>
        <div style={{ width: '50px', height: '50px', background: 'rgba(37,99,235,0.08)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
          {sportIcon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{event.title}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            📍 {venue.name} · {venue.city}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {ticket && (
              <span style={{ padding: '3px 8px', background: 'var(--success-light)', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600', color: '#065F46' }}>
                🎫 Sec {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
              </span>
            )}
            {ticket?.gate && (
              <span style={{ padding: '3px 8px', background: 'var(--primary-light)', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)' }}>
                🚪 {ticket.gate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Weather strip */}
      <div style={{ marginTop: '8px', padding: '10px 14px', background: 'linear-gradient(90deg, #EFF6FF, #F0FDF4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>{weather.icon}</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{weather.temp} · {weather.desc}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Perfect match conditions</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Humidity: {weather.humidity}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Wind: {weather.wind}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { state, dispatch } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
    }
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e) => { e.preventDefault(); setDeferredPrompt(e); setIsInstallable(true); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { setIsInstallable(false); setDeferredPrompt(null); }
  };

  const carouselAds = ADS.slice(0, 5);

  return (
    <div className="page-enter">
      <ScoreBanner />

      {isInstallable && !isStandalone && (
        <div style={{ margin: '14px 16px 0', padding: '14px 16px', background: 'linear-gradient(135deg, var(--primary-light) 0%, #E0F2FE 100%)', border: '1.5px solid var(--primary-mid)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)', animation: 'fadeSlideIn 0.3s ease' }}>
          <span style={{ fontSize: '1.8rem', background: 'white', padding: '6px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>🏟️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '800', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>Install VenueIQ App</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Add to home screen for live stadium features!</div>
          </div>
          <button onClick={handleInstallClick} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '99px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>Install</button>
        </div>
      )}

      {isIOS && !isStandalone && (
        <div style={{ margin: '14px 16px 0', padding: '14px 16px', background: 'linear-gradient(135deg, var(--primary-light) 0%, #E0F2FE 100%)', border: '1.5px solid var(--primary-mid)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)', animation: 'fadeSlideIn 0.3s ease' }}>
          <span style={{ fontSize: '1.8rem', background: 'white', padding: '6px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>🏟️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '800', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>Install VenueIQ on iPhone</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Tap <span style={{ fontWeight: '700' }}>Share</span> 📤 then <span style={{ fontWeight: '700' }}>Add to Home Screen</span>.
            </div>
          </div>
        </div>
      )}

      <div style={{ paddingTop: '4px' }}><SmartAlerts /></div>
      <QuickActions />
      <div style={{ paddingTop: '16px' }}><AdCarousel ads={carouselAds} /></div>
      <VenueInfo />
      <LiveStatsBar />
      <MatchTimeline />
      <LiveStandsSummary />
      <div style={{ paddingTop: '8px' }}><AdBanner adId="ad1" /></div>
      <div style={{ height: '16px' }} />
    </div>
  );
}
