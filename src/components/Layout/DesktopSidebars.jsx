import { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import { ADS } from '../../data/mockAds';

// ─── LEFT SIDEBAR: LIVE EVENT DATA & commentary ─────────────────────
export function LeftSidebar() {
  const { state } = useApp();
  const [commentaryIdx, setCommentaryIdx] = useState(0);
  const [previewSportIdx, setPreviewSportIdx] = useState(0);

  // Auto rotate commentary
  useEffect(() => {
    const timer = setInterval(() => {
      setCommentaryIdx(c => (c + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate preview sport for pre-onboarding LeftSidebar (random games / stadiums)
  useEffect(() => {
    if (state.onboarded) return;
    const timer = setInterval(() => {
      setPreviewSportIdx(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(timer);
  }, [state.onboarded]);

  if (!state.onboarded) {
    const previewSports = [
      { id: 'cricket', icon: '🏏', name: 'Cricket', color: '#2563EB' },
      { id: 'football', icon: '⚽', name: 'Football', color: '#16A34A' },
      { id: 'basketball', icon: '🏀', name: 'Basketball', color: '#EA580C' },
      { id: 'hockey', icon: '🏑', name: 'Hockey', color: '#7C3AED' },
      { id: 'tennis', icon: '🎾', name: 'Tennis', color: '#CA8A04' },
      { id: 'kabaddi', icon: '🤼', name: 'Kabaddi', color: '#DC2626' },
    ];
    const previewSport = previewSports[previewSportIdx % previewSports.length];

    return (
      <div className="desktop-sidebar left-sidebar">
        {/* Welcome branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', color: 'white', fontSize: '2rem',
            boxShadow: 'var(--shadow-primary)',
          }}>
            🏟️
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            Venue<span style={{ color: 'var(--primary)' }}>IQ</span> Portal
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Smart Stadium Fan Companion
          </p>
        </div>

        {/* Informative Welcome Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🎟️ Ticket Holder Portal
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Welcome to the venue! Please enter your booking reference in the central screen to unlock real-time match tracking and customized stadium guides.
          </p>

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { text: 'Live Match & Score Tracker', icon: '⚡' },
              { text: 'Shortest Restroom & Food Queues', icon: '⏱️' },
              { text: 'Interactive Arena Maps', icon: '🗺️' },
              { text: 'Gemini AI In-Seat Assistant', icon: '🤖' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rotating Games and Stadiums Previews */}
        {previewSport && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(16,185,129,0.06) 100%)',
            border: '1.5px dashed var(--primary-mid)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.5s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>{previewSport.icon}</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: previewSport.color }}>
                {previewSport.name} Preview
              </span>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)', animation: 'pulse-dot 1.2s infinite' }} />
            </div>

            <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: '900', margin: '4px 0' }}>
              VenueIQ Stadium
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              📍 Mumbai, India
            </p>

            <div style={{ 
              background: 'white', padding: '10px', borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)', display: 'flex',
              justifyContent: 'space-around', alignItems: 'center', marginBottom: '10px'
            }}>
              <div style={{ fontWeight: '800', fontSize: '0.8125rem' }}>
                Home {previewSport.icon}
              </div>
              <div style={{ background: 'var(--surface-3)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.6875rem', fontWeight: '800', color: 'var(--primary)' }}>
                PREVIEW
              </div>
              <div style={{ fontWeight: '800', fontSize: '0.8125rem' }}>
                {previewSport.icon} Away
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.5625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Capacity</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)' }}>33,000</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.5625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Gate Status</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--success)' }}>OPEN</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const event = state.event;
  const venue = state.venue;
  const sportIcon = event?.sport === 'cricket' ? '🏏' : event?.sport === 'football' ? '⚽' : '🏆';

  if (!event) return null;

  // Real-time data from API
  const homeScore = event.homeScore ?? 0;
  const awayScore = event.awayScore ?? 0;
  const currentPeriod = event.period ?? '';

  return (
    <div className="desktop-sidebar left-sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '1.75rem' }}>🏟️</span>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            Venue<span style={{ color: 'var(--primary)' }}>IQ</span>
          </h2>
          <span style={{ fontSize: '0.6875rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>
            CONNECTED PORTAL
          </span>
        </div>
      </div>

      {/* NOW PLAYING CARD */}
      <div style={{
        background: `linear-gradient(135deg, ${sport.color}15 0%, #FFFFFF 100%)`,
        border: `1.5px solid ${sport.color}25`,
        borderRadius: 'var(--radius)',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, background: sport.color, color: 'white', fontSize: '0.5625rem', padding: '3px 8px', borderBottomLeftRadius: '10px', fontWeight: '800', letterSpacing: '0.5px' }}>
          LIVE COMPANION
        </div>

        <div style={{ fontSize: '0.6875rem', fontWeight: '800', color: sport.color, textTransform: 'uppercase', marginBottom: '8px' }}>
          {event.league}
        </div>

        {/* Team Matchup */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', margin: '8px 0' }}>
          {/* Home team */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '2rem' }}>{event.homeTeamLogo || '🏠'}</div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {event.homeTeamShort}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
              {homeScore}
            </div>
          </div>

          {/* VS Divider */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-tertiary)', background: 'var(--surface-3)', padding: '4px 8px', borderRadius: '99px' }}>
              VS
            </span>
            <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {event.periodLabel}: <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{currentPeriod}</span>
            </div>
          </div>

          {/* Away team */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '2rem' }}>{event.awayTeamLogo || '🏟️'}</div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {event.awayTeamShort}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
              {awayScore}
            </div>
          </div>
        </div>

        {/* Stadium description */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>📍 {event.venue}</span>
          <span style={{ fontWeight: '600' }}>Gate: {event.gate}</span>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      {event.extras && event.extras.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '14px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '0.8125rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.5px' }}>
            📊 Live Match Statistics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {event.extras.map(stat => {
              const curVal = stat.vals[state.scoreIdx] ?? stat.vals[stat.vals.length - 1];
              return (
                <div key={stat.label} style={{ display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</span>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{curVal}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIVE COMMENTARY FEED */}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{ fontSize: '0.8125rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.5px' }}>
          🎙️ Live Event Stream
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {event.recentEvents && event.recentEvents.map((evt, idx) => (
            <div key={idx} style={{
              display: 'flex', gap: '10px',
              padding: '8px 10px',
              background: idx === commentaryIdx ? `${sport.color}08` : 'transparent',
              borderLeft: `3px solid ${idx === commentaryIdx ? sport.color : 'transparent'}`,
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{evt.icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {evt.text}
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>
                  {evt.time} ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT SIDEBAR: ADS & SPONSORS & INTERACTIVE prediction ────────
export function RightSidebar() {
  const { state, dispatch } = useApp();
  const [adIdx, setAdIdx] = useState(0);
  const [userPrediction, setUserPrediction] = useState(null);
  const [predictionFeedback, setPredictionFeedback] = useState(null);

  // Rotate sponsors
  useEffect(() => {
    const timer = setInterval(() => {
      setAdIdx(prev => (prev + 1) % ADS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentAd = ADS[adIdx];

  const handlePredict = (team) => {
    setUserPrediction(team);
    const couponCode = currentAd.brand === 'Dream11' ? 'D11VENUE50' : 'INSTAFAST20';
    const rewardName = currentAd.brand === 'Dream11' ? '₹50 Free Play Bonus' : 'Swiggy Instamart 20% Off Code';

    // Log prediction to notification history center
    dispatch({
      type: 'SUBMIT_PREDICTION',
      team: team,
      coupon: couponCode,
      reward: rewardName
    });

    setTimeout(() => {
      setPredictionFeedback({
        title: '🎯 Prediction Locked!',
        desc: `You predicted ${team}! Here is a sponsor reward:`,
        coupon: couponCode,
        reward: rewardName,
      });
    }, 400);
  };

  const handleResetPrediction = () => {
    setUserPrediction(null);
    setPredictionFeedback(null);
  };

  // Select 2 hot food deals from stands
  const hotDeals = [
    { stand: 'Arena Grill', item: 'Double Cheese Burger Combo', price: '₹220', oldPrice: '₹280', discount: '20% OFF' },
    { stand: 'Royal Zaika', item: 'Butter Chicken Roll', price: '₹180', oldPrice: '₹220', discount: 'BOGO Offer' }
  ];

  const sportColor = 'var(--primary)';
  const activeEvent = state.onboarded ? state.event : null;

  return (
    <div className="desktop-sidebar right-sidebar">
      {/* Sponsor Branding */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
          💎 Sponsored Segment
        </h2>
        <span style={{ fontSize: '0.5625rem', padding: '2px 6px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', color: 'var(--text-tertiary)', fontWeight: '700' }}>
          ADS
        </span>
      </div>

      {/* ROTATING SPONSOR CARD */}
      <div style={{
        borderRadius: 'var(--radius)',
        background: currentAd.gradient,
        color: 'white',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s ease',
      }}>
        {/* Shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          animation: 'adShimmer 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <span style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '0.625rem', color: currentAd.accentColor, fontWeight: '800', textTransform: 'uppercase' }}>
          {currentAd.badge}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.75rem' }}>{currentAd.icon}</span>
          <span style={{ fontWeight: '900', fontSize: '1.125rem' }}>{currentAd.brand}</span>
        </div>

        <p style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '4px', color: '#FFF' }}>
          {currentAd.tagline}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
          {currentAd.desc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: currentAd.accentColor }}>{currentAd.prize}</div>
            <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '700' }}>{currentAd.prizeLabel}</div>
          </div>
          <button style={{
            padding: '8px 16px',
            background: currentAd.accentColor,
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontWeight: '800',
            fontSize: '0.75rem',
            color: '#000',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {currentAd.cta}
          </button>
        </div>
      </div>

      {/* INTERACTIVE MATCH PREDICT & WIN */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🎯 Predict & Win!
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Lock in your play prediction & unlock discount vouchers from {currentAd.brand}!
        </p>

        {!userPrediction ? (
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {activeEvent ? 'Who will score next?' : 'Who will win the toss/match?'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => handlePredict(activeEvent?.home?.shortName ?? 'HOME TEAM')}
                style={{
                  padding: '10px 8px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sportColor; e.currentTarget.style.background = `${sportColor}05`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
              >
                {activeEvent ? activeEvent.home.name : 'Home Team'}
              </button>
              <button
                onClick={() => handlePredict(activeEvent?.away?.shortName ?? 'AWAY TEAM')}
                style={{
                  padding: '10px 8px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sportColor; e.currentTarget.style.background = `${sportColor}05`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
              >
                {activeEvent ? activeEvent.away.name : 'Away Team'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--success-light)',
            border: '1.5px solid #A7F3D0',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#065F46' }}>
              {predictionFeedback?.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>
              {predictionFeedback?.desc}
            </div>
            <div style={{
              margin: '8px auto',
              background: '#047857',
              color: 'white',
              fontFamily: 'monospace',
              padding: '6px 12px',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: '900',
              fontSize: '0.875rem',
              letterSpacing: '1px',
            }}>
              {predictionFeedback?.coupon}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#059669', fontWeight: '600' }}>
              🎁 Reward: {predictionFeedback?.reward}
            </div>
            <button
              onClick={handleResetPrediction}
              style={{
                marginTop: '10px',
                background: 'transparent',
                border: 'none',
                color: '#065F46',
                fontWeight: '700',
                fontSize: '0.6875rem',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Predict Again
            </button>
          </div>
        )}
      </div>

      {/* LIVE IN-STADIUM FOOD DEALS */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px',
      }}>
        <h3 style={{ fontSize: '0.8125rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🔥 Flash Food Offers
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {hotDeals.map((deal, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}>
              <div>
                <span style={{ fontSize: '0.5625rem', color: 'var(--warning)', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>
                  {deal.discount} · {deal.stand}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {deal.item}
                </span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textDecoration: 'line-through', marginRight: '4px' }}>
                  {deal.oldPrice}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '900', color: 'var(--success)' }}>
                  {deal.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
