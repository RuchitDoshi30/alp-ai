import { useState } from 'react';
import { useApp } from '../../context/useApp';

// Simple QR code as SVG pattern
function QRCode({ value }) {
  const cells = [];
  const size = 15;
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= size - 7;
      const inBottomLeft = r >= size - 7 && c < 7;
      if (inTopLeft || inTopRight || inBottomLeft) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
          (inTopRight && (r === 0 || r === 6 || c === size - 7 || c === size - 1 || (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3))) ||
          (inBottomLeft && (r === size - 7 || r === size - 1 || c === 0 || c === 6 || (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4)));
        cells.push({ r, c, filled: isBorder });
      } else {
        const hash = (seed * (r + 1) * 31 + c * 17 + r * 13) % 100;
        cells.push({ r, c, filled: hash > 40 });
      }
    }
  }
  const cell = 9;
  const total = size * cell;
  return (
    <svg viewBox={`0 0 ${total} ${total}`} className="qr-code-svg" style={{ borderRadius: '8px', background: 'white' }}>
      <rect width={total} height={total} fill="white" />
      {cells.map(({ r, c, filled }) =>
        filled ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0F172A" rx="1" /> : null
      )}
    </svg>
  );
}

export default function TicketCard() {
  const { state, dispatch } = useApp();
  const [showGateGuide, setShowGateGuide] = useState(false);

  const event = state.event;
  const ticket = state.ticket;
  const venue = state.venue;

  if (!event) return null;

  const section = ticket?.section || 'B2';
  const row = ticket?.row || 'R12';
  const seat = ticket?.seat || '18';
  const gate = ticket?.gate || 'Gate D';
  const bookingRef = ticket?.bookingRef || 'VIQ-GUEST';
  const sportIcon = event.sport === 'cricket' ? '🏏' : event.sport === 'football' ? '⚽' : '🏆';

  return (
    <div style={{ padding: '0 0 16px' }}>
      <div className="ticket-card">
        {/* Header */}
        <div className="ticket-header">
          <div className="ticket-sport-badge">{sportIcon} {event.sport.toUpperCase()}</div>
          <div className="ticket-match-title">{event.title}</div>
          <div className="ticket-venue-info">
            <span>📍</span> {venue?.name || 'Stadium'}
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.8125rem', opacity: 0.75 }}>
            🗓️ {new Date(event.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>

        {/* Seat Info */}
        <div className="ticket-body">
          <div className="ticket-seat-grid">
            <div className="ticket-seat-item">
              <div className="ticket-seat-label">Section</div>
              <div className="ticket-seat-value">{section}</div>
            </div>
            <div className="ticket-seat-item">
              <div className="ticket-seat-label">Row</div>
              <div className="ticket-seat-value">{row}</div>
            </div>
            <div className="ticket-seat-item">
              <div className="ticket-seat-label">Seat</div>
              <div className="ticket-seat-value">{seat}</div>
            </div>
          </div>

          {/* QR Code */}
          <div className="ticket-qr-wrap">
            <QRCode value={bookingRef} />
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '2px' }}>
              {bookingRef}
            </div>
            <div className="ticket-scan-hint">Present this QR code at the gate scanner</div>
          </div>

          {/* Info rows */}
          <div style={{ marginTop: '16px' }}>
            <div className="ticket-info-row">
              <span className="ticket-info-label">🚪 Entry Gate</span>
              <span className="ticket-info-value" style={{ color: 'var(--primary)', fontWeight: '800' }}>{gate}</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-info-label">🏟️ Venue</span>
              <span className="ticket-info-value">{venue?.name || '—'}, {venue?.city || ''}</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-info-label">📋 Bag Policy</span>
              <span className="ticket-info-value">Max 15L bag allowed</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-info-label">🎟️ Status</span>
              <span className="ticket-info-value" style={{ color: ticket?.status === 'valid' ? 'var(--success)' : 'var(--danger)', fontWeight: '700' }}>
                {(ticket?.status || 'valid').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Gate Status alert */}
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'var(--success-light)',
            borderRadius: 'var(--radius)',
            border: '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#065F46' }}>{gate} is open & ready</div>
              <div style={{ fontSize: '0.8125rem', color: '#047857', marginTop: '2px' }}>Low congestion · ~2 min wait time</div>
            </div>
          </div>

          {/* Collapsable Gate Guidance feature */}
          <div style={{ marginTop: '14px' }}>
            <button
              onClick={() => setShowGateGuide(!showGateGuide)}
              style={{
                width: '100%', padding: '10px 14px', background: 'var(--surface-2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontWeight: '700', fontSize: '0.8125rem', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                outline: 'none', transition: 'all 0.25s ease',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🚪 Visual Entry Gate Directions</span>
              <span>{showGateGuide ? '▲' : '▼'}</span>
            </button>

            {showGateGuide && (
              <div style={{
                marginTop: '8px', padding: '12px 14px', background: 'var(--surface-2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontSize: '0.8125rem', color: 'var(--text-secondary)', animation: 'pageEnter 0.3s ease',
              }}>
                <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Step-by-step Turnstile Routing:
                </div>
                <ol style={{ paddingLeft: '14px', margin: 0, lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Arrive at the stadium outer perimeter near **{gate}**</li>
                  <li>Proceed through designated **security lanes & bag scanning**</li>
                  <li>Tap your digital barcode at **Turnstile {section}0{row}**</li>
                  <li>Walk up the ramp & follow signs for **Section {section} · Row {row}**</li>
                </ol>
              </div>
            )}
          </div>

          {/* Reset Ticket */}
          <div style={{ marginTop: '18px', textAlign: 'center', borderTop: '1px dashed var(--border)', paddingTop: '14px' }}>
            <button
              onClick={() => dispatch({ type: 'RESET_PORTAL' })}
              style={{
                background: 'rgba(239, 68, 68, 0.08)', border: '1.5px solid rgba(239, 68, 68, 0.15)',
                borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.8125rem',
                fontWeight: '700', cursor: 'pointer', padding: '8px 16px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
            >
              🔄 Clear Session / Exit Active Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
