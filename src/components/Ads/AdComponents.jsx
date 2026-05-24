import { useState, useEffect, useRef } from 'react';
import { ADS } from '../../data/mockAds';

// ─── BANNER AD (full width strip) ────────────────────────────────────
export function AdBanner({ adId, style }) {
  const ad = ADS.find(a => a.id === adId) || ADS[Math.floor(Math.random() * ADS.length)];
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      margin: '0 16px',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      background: ad.gradient,
      position: 'relative',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      ...style,
    }}>
      {/* Shimmer overlay */}
      <div style={{
        position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        animation: 'adShimmer 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        {/* Icon */}
        <div style={{
          width: '46px', height: '46px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', flexShrink: 0,
        }}>
          {ad.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', color: ad.accentColor, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {ad.badge}
            </span>
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: '#FFFFFF', lineHeight: '1.2' }}>{ad.tagline}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{ad.desc}</div>
        </div>

        {/* Prize + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: '900', color: ad.accentColor, lineHeight: 1 }}>{ad.prize}</div>
            <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase' }}>{ad.prizeLabel}</div>
          </div>
          <div style={{
            padding: '6px 12px', background: ad.accentColor,
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', fontWeight: '800',
            color: '#000', whiteSpace: 'nowrap',
          }}>
            {ad.cta}
          </div>
        </div>
      </div>

      {/* Ad label + dismiss */}
      <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>AD</span>
        <button
          onClick={e => { e.stopPropagation(); setDismissed(true); }}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'rgba(255,255,255,0.6)', borderRadius: '50%', width: '16px', height: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', padding: 0 }}
        >✕</button>
      </div>
    </div>
  );
}

// ─── AD CARD (smaller, for grids) ────────────────────────────────────
export function AdCard({ ad, style }) {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 400);
  };

  return (
    <div
      onClick={handleTap}
      style={{
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: ad.gradient,
        cursor: 'pointer',
        position: 'relative',
        transform: tapped ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.15s ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        ...style,
      }}
    >
      <div style={{ padding: '16px 14px' }}>
        <div style={{ fontSize: '0.5625rem', fontWeight: '700', color: ad.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          {ad.badge}
        </div>
        <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{ad.icon}</div>
        <div style={{ fontWeight: '800', fontSize: '0.875rem', color: '#FFF', lineHeight: '1.25', marginBottom: '4px' }}>
          {ad.brand}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', lineHeight: 1.4 }}>
          {ad.tagline}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: '900', color: ad.accentColor }}>{ad.prize}</div>
            <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase' }}>{ad.prizeLabel}</div>
          </div>
          <div style={{
            padding: '7px 12px', background: ad.accentColor,
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', fontWeight: '800', color: '#000',
          }}>
            {ad.cta}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '0.5625rem', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>AD</div>
    </div>
  );
}

// ─── AD CAROUSEL (auto-rotating banner) ──────────────────────────────
export function AdCarousel({ ads, style }) {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [ads.length]);

  if (dismissed) return null;

  const ad = ads[current];

  return (
    <div style={{ position: 'relative', ...style }}>
      <div style={{
        margin: '0 16px',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: ad.gradient,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        transition: 'background 0.8s ease',
      }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.7rem', flexShrink: 0,
          }}>
            {ad.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: ad.accentColor, marginBottom: '3px' }}>{ad.badge}</div>
            <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: '#FFF', lineHeight: 1.2 }}>{ad.tagline}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{ad.desc}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: ad.accentColor }}>{ad.prize}</div>
            <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.55)', fontWeight: '600', textTransform: 'uppercase' }}>{ad.prizeLabel}</div>
            <div style={{ marginTop: '6px', padding: '6px 12px', background: ad.accentColor, borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '800', color: '#000' }}>
              {ad.cta}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', paddingBottom: '10px' }}>
          {ads.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? '16px' : '5px', height: '5px',
              borderRadius: '99px',
              background: i === current ? ad.accentColor : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }} />
          ))}
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute', top: '8px', right: '22px',
          background: 'rgba(0,0,0,0.4)', border: 'none', color: 'rgba(255,255,255,0.6)',
          borderRadius: '50%', width: '18px', height: '18px',
          cursor: 'pointer', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'inherit',
        }}
      >✕</button>
      <div style={{ position: 'absolute', top: '10px', left: '22px', fontSize: '0.5625rem', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>SPONSORED</div>
    </div>
  );
}

// ─── AD SECTION (grid of 2 cards) ────────────────────────────────────
export function AdGrid({ startIdx = 0, title = '🎮 For You', style }) {
  const ads = ADS.slice(startIdx, startIdx + 2);
  return (
    <div style={style}>
      <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: 'var(--text-tertiary)', background: 'var(--surface-3)', padding: '2px 8px', borderRadius: '99px' }}>Sponsored</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 16px' }}>
        {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
      </div>
    </div>
  );
}
