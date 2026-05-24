import { useState, useEffect, useRef } from 'react';
import { SPORTS, detectSportFromRef, EVENTS_BY_SPORT } from '../data/mockEvent';
import { useApp } from '../context/useApp';

const ALL_SPORTS = Object.values(SPORTS);
const FLOATING_ICONS = ['🏏', '⚽', '🏀', '🏑', '🎾', '🤼', '🏟️', '🎯', '🏆', '🎽'];

function FloatingIcon({ icon, style }) {
  return <div className="floating-icon" style={style}>{icon}</div>;
}

function StepDots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', margin: '16px 0 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? '20px' : '7px', height: '7px',
          borderRadius: '99px',
          background: i === current ? 'var(--primary)' : 'var(--border)',
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const { state, dispatch } = useApp();
  // Start on step 1 directly if sport is pre-selected (via sport switching inside portal)
  const [step, setStep] = useState(state.selectedSport ? 1 : 0);
  const [ticketData, setTicketData] = useState({ bookingRef: '', name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [detectingMsg, setDetectingMsg] = useState('');
  const [detectedSport, setDetectedSport] = useState(state.selectedSport || null);
  const [detectedEvent, setDetectedEvent] = useState(state.selectedSport ? EVENTS_BY_SPORT[state.selectedSport] : null);
  const [selectedSport, setSelectedSport] = useState(state.selectedSport || null);
  const firstInputRef = useRef(null);

  const getDemoTicket = (sportId) => {
    const demoRefs = {
      cricket: 'IPL-2025-MI04',
      football: 'FBL-2025-ISL',
      basketball: 'BBL-2025-01',
      hockey: 'HOC-FIH-25',
      tennis: 'TEN-ATP-25',
      kabaddi: 'KBD-PKL-25',
    };
    return {
      bookingRef: demoRefs[sportId] || 'IPL-2025-MI04',
      name: 'Ruchit Shah',
      email: 'ruchit@email.com',
      phone: '9876543210',
    };
  };

  const DEMO_TICKET = getDemoTicket(state.selectedSport || detectedSport || 'cricket');

  useEffect(() => {
    if (step === 1) setTimeout(() => firstInputRef.current?.focus(), 300);
  }, [step]);

  // Live detect sport as user types booking ref
  useEffect(() => {
    if (ticketData.bookingRef.length >= 3) {
      const sport = detectSportFromRef(ticketData.bookingRef);
      setDetectedSport(sport);
      setDetectedEvent(sport ? EVENTS_BY_SPORT[sport] : null);
    } else {
      setDetectedSport(null);
      setDetectedEvent(null);
    }
  }, [ticketData.bookingRef]);

  const handleDemoFill = () => {
    setTicketData(DEMO_TICKET);
    setErrors({});
  };

  const validateTicket = () => {
    const errs = {};
    if (!ticketData.bookingRef.trim()) errs.bookingRef = 'Booking reference is required';
    if (!ticketData.name.trim()) errs.name = 'Your name is required';
    if (!ticketData.email.trim() || !ticketData.email.includes('@')) errs.email = 'Valid email required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleVerify = async () => {
    if (!validateTicket()) return;
    setIsVerifying(true);

    const sport = detectSportFromRef(ticketData.bookingRef);
    const event = sport ? EVENTS_BY_SPORT[sport] : null;

    const steps = [
      'Reading ticket barcode...',
      event ? `Detected: ${SPORTS[sport]?.icon} ${event.matchTitle}` : 'Identifying match...',
      `Locating venue: ${event?.venue ?? 'Stadium'}...`,
      `Seat ${event?.section ?? 'P'}${event?.row ?? '14'} · ${event?.city ?? 'India'} confirmed!`,
      'Loading live match data...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setDetectingMsg(steps[i]);
      await new Promise(r => setTimeout(r, 700));
    }

    setIsVerifying(false);
    setDetectingMsg('');
    setDetectedSport(sport);
    setSelectedSport(sport); // auto-select detected sport
    
    // Bypasses confirmation screen and takes ticket holders directly to portal
    const finalSport = sport || 'cricket';
    dispatch({ type: 'COMPLETE_ONBOARDING', sport: finalSport });
  };

  const handleEnter = () => {
    const finalSport = selectedSport || detectedSport || 'cricket';
    dispatch({ type: 'COMPLETE_ONBOARDING', sport: finalSport });
  };

  // ─── STEP 0: HERO ───────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="hero-screen">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        {FLOATING_ICONS.map((icon, i) => (
          <FloatingIcon key={i} icon={icon} style={{
            top: `${8 + (i * 9) % 80}%`,
            left: `${5 + (i * 17) % 88}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${5 + (i % 4)}s`,
            fontSize: i % 3 === 0 ? '1.8rem' : i % 3 === 1 ? '1.3rem' : '1rem',
            opacity: 0.1 + (i % 3) * 0.04,
          }} />
        ))}

        <div className="hero-content">
          <div className="hero-logo-wrap">
            <div className="hero-logo-ring" />
            <div className="hero-logo-icon">🏟️</div>
          </div>

          <div className="hero-wordmark">Venue<span>IQ</span></div>
          <div className="hero-tagline">Smart Stadium Companion</div>

          <div className="hero-headline">
            Your Game Day,<br />
            <span className="hero-headline-accent">Perfectly Guided</span>
          </div>

          <p className="hero-subtext">
            Real-time crowd intelligence, zero-friction food ordering,
            indoor navigation & Gemini AI — all in one place.
          </p>

          <div className="hero-pills">
            {['⚡ Live Crowds', '🍽️ Order Food', '🗺️ Navigate', '🤖 AI Help'].map(pill => (
              <div key={pill} className="hero-pill">{pill}</div>
            ))}
          </div>

          <div className="hero-stats">
            {[
              { val: '6+', label: 'Sports' },
              { val: '<3', label: 'Taps to order' },
              { val: 'Live', label: 'Crowd data' },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <button className="hero-cta" onClick={() => setStep(1)}>
            <span>Enter with Ticket</span>
            <span className="hero-cta-arrow">→</span>
          </button>

          <button className="hero-guest-btn" onClick={() => setStep(2)}>
            Browse as Guest
          </button>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 430 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,30 C80,60 180,0 280,30 C360,55 410,20 430,30 L430,60 L0,60 Z" fill="var(--surface-2)" />
          </svg>
        </div>
      </div>
    );
  }

  // ─── STEP 1: TICKET ENTRY ────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="onboarding-flow-screen">
        <div className="flow-header">
          <button className="flow-back-btn" onClick={() => setStep(0)}>←</button>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Enter Ticket Details</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>We'll auto-detect your match</div>
          </div>
          <div style={{ width: '36px' }} />
        </div>

        <StepDots total={2} current={0} />

        {/* Ticket illustration */}
        <div className="ticket-illus">
          <div className="ticket-illus-inner">
            <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🎫</div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--primary)' }}>Auto-detect your match</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              We read your booking ref to find your game & venue
            </div>
          </div>
          <button className="demo-fill-btn" onClick={handleDemoFill}>
            ✨ Demo ticket
          </button>
        </div>

        {/* Live detection preview */}
        {detectedSport && detectedEvent && (
          <div style={{
            margin: '12px 20px 0',
            padding: '12px 14px',
            background: 'var(--success-light)',
            borderRadius: 'var(--radius)',
            border: '1.5px solid #A7F3D0',
            animation: 'fadeSlideIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{SPORTS[detectedSport].icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#065F46' }}>
                  ✅ Match detected!
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#047857', marginTop: '1px' }}>
                  {detectedEvent.matchTitle}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '1px' }}>
                  📍 {detectedEvent.venue} · {detectedEvent.city}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verifying loader */}
        {isVerifying && (
          <div style={{
            margin: '12px 20px 0',
            padding: '14px',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius)',
            border: '1.5px solid var(--primary-mid)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="btn-spinner" style={{ borderColor: 'rgba(37,99,235,0.3)', borderTopColor: 'var(--primary)', width: '20px', height: '20px' }} />
              <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--primary)' }}>
                {detectingMsg}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: '4px', background: 'var(--primary-mid)', borderRadius: '99px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '99px', animation: 'verifyProgress 3.5s ease forwards' }} />
            </div>
          </div>
        )}

        {/* Form */}
        <div className="ticket-form">
          <div className="form-field">
            <label className="form-label">Booking Reference <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Try: IPL-2025-MI04, FBL-2025-ISL, BBL-2025-01, HOC-FIH-25, TEN-ATP-25, KBD-PKL-25
            </div>
            <div className={`form-input-wrap ${errors.bookingRef ? 'error' : ticketData.bookingRef ? 'success' : ''}`}>
              <span className="form-input-icon">🎟️</span>
              <input
                ref={firstInputRef}
                className="form-input"
                type="text"
                placeholder="e.g. IPL-2025-MI04"
                value={ticketData.bookingRef}
                onChange={e => setTicketData(d => ({ ...d, bookingRef: e.target.value.toUpperCase() }))}
              />
              {ticketData.bookingRef && !errors.bookingRef && (
                <span style={{ color: detectedSport ? 'var(--success)' : 'var(--text-tertiary)', fontSize: '1rem', flexShrink: 0 }}>
                  {detectedSport ? SPORTS[detectedSport].icon : '?'}
                </span>
              )}
            </div>
            {errors.bookingRef && <div className="form-error">{errors.bookingRef}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className={`form-input-wrap ${errors.name ? 'error' : ticketData.name ? 'success' : ''}`}>
              <span className="form-input-icon">👤</span>
              <input className="form-input" type="text" placeholder="As on your ticket" value={ticketData.name}
                onChange={e => setTicketData(d => ({ ...d, name: e.target.value }))} />
            </div>
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className={`form-input-wrap ${errors.email ? 'error' : ticketData.email ? 'success' : ''}`}>
              <span className="form-input-icon">✉️</span>
              <input className="form-input" type="email" placeholder="Booking confirmation email" value={ticketData.email}
                onChange={e => setTicketData(d => ({ ...d, email: e.target.value }))} />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">Phone <span style={{ color: 'var(--text-tertiary)', fontWeight: '400' }}>— optional</span></label>
            <div className={`form-input-wrap ${ticketData.phone ? 'success' : ''}`}>
              <span className="form-input-icon">📱</span>
              <input className="form-input" type="tel" placeholder="For real-time SMS alerts" value={ticketData.phone}
                onChange={e => setTicketData(d => ({ ...d, phone: e.target.value }))} />
            </div>
          </div>

          <div className="privacy-note">
            🔒 Details are used only to personalize your experience. Never shared.
          </div>

          <button className="btn-primary verify-btn" onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span className="btn-spinner" />
                Verifying...
              </span>
            ) : 'Verify & Auto-Detect Match →'}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 2: CONFIRM + SPORT SELECT ─────────────────────────────────
  const event = detectedSport ? EVENTS_BY_SPORT[detectedSport] : null;

  return (
    <div className="onboarding-flow-screen">
      <div className="flow-header">
        <button className="flow-back-btn" onClick={() => setStep(ticketData.bookingRef ? 1 : 0)}>←</button>
        <div>
          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            {detectedSport ? 'Match Confirmed!' : 'Pick Your Sport'}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {ticketData.name ? `Welcome, ${ticketData.name.split(' ')[0]}!` : 'Step 2 of 2'}
          </div>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {ticketData.bookingRef && <StepDots total={2} current={1} />}

      {/* Auto-detected match card */}
      {detectedSport && event && (
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{
            background: `linear-gradient(135deg, ${SPORTS[detectedSport].color}18 0%, ${SPORTS[detectedSport].color}08 100%)`,
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${SPORTS[detectedSport].color}30`,
            overflow: 'hidden',
          }}>
            {/* Match header */}
            <div style={{ background: SPORTS[detectedSport].color, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{SPORTS[detectedSport].icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'white' }}>{event.matchTitle}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', marginTop: '1px' }}>{event.league}</div>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '99px', fontSize: '0.6875rem', color: 'white', fontWeight: '700' }}>AUTO-DETECTED</span>
            </div>
            {/* Match details */}
            <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: '📍 Venue', value: event.venue },
                { label: '🌆 City', value: event.city },
                { label: '🗓️ Date', value: event.eventDate.split('·')[0].trim() },
                { label: '⏰ Time', value: event.eventDate.split('·')[1]?.trim() ?? '7:30 PM' },
                { label: '🎟️ Section', value: event.section },
                { label: '💺 Seat', value: `Row ${event.row}, Seat ${event.seat}` },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>
            {/* Teams */}
            <div style={{ margin: '0 16px 14px', padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem' }}>{event.home.emoji}</div>
                <div style={{ fontWeight: '800', fontSize: '0.875rem' }}>{event.home.shortName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{event.home.name}</div>
              </div>
              <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--text-tertiary)' }}>VS</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem' }}>{event.away.emoji}</div>
                <div style={{ fontWeight: '800', fontSize: '0.875rem' }}>{event.away.shortName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{event.away.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome banner */}
      {ticketData.name && (
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary-mid)' }}>
            <span style={{ fontSize: '1.3rem' }}>👋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>Hi, {ticketData.name.split(' ')[0]}!</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '1px' }}>Ref: {ticketData.bookingRef}</div>
            </div>
            <span style={{ color: 'var(--success)', fontSize: '1.1rem' }}>✅</span>
          </div>
        </div>
      )}

      {/* Sport override grid — show if no detection or allow manual override */}
      <div style={{ padding: '14px 20px 4px' }}>
        <div style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
          {detectedSport ? '🔄 Or switch sport:' : '🏅 Select your sport:'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {ALL_SPORTS.map(sport => (
            <button key={sport.id} onClick={() => setSelectedSport(sport.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '12px 6px',
              background: (selectedSport || detectedSport) === sport.id ? sport.color : 'var(--surface)',
              border: `2px solid ${(selectedSport || detectedSport) === sport.id ? sport.color : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              transform: (selectedSport || detectedSport) === sport.id ? 'translateY(-2px)' : 'none',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{sport.icon}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: (selectedSport || detectedSport) === sport.id ? 'white' : 'var(--text-primary)' }}>{sport.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enter button */}
      <div style={{ padding: '16px 20px 32px' }}>
        <button className="btn-primary" onClick={handleEnter}
          style={{ fontSize: '1rem' }}
          disabled={!selectedSport && !detectedSport}
        >
          {(selectedSport || detectedSport)
            ? `🎉 Enter as ${SPORTS[selectedSport || detectedSport].name} Fan ${SPORTS[selectedSport || detectedSport].icon}`
            : 'Select a sport to enter'}
        </button>
      </div>
    </div>
  );
}
