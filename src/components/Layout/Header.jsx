import { useApp } from '../../context/useApp';
import { EVENTS_BY_SPORT, SPORTS } from '../../data/mockEvent';

export default function Header() {
  const { state, dispatch } = useApp();
  const event = EVENTS_BY_SPORT[state.selectedSport];
  const sport = SPORTS[state.selectedSport];

  const alertCount = state.alerts.length;

  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="header-logo-icon">🏟️</div>
        <span className="header-logo-text">Venue<span>IQ</span></span>
      </div>

      {event && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 12px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
          }}>
            <span>{sport?.icon}</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {event.home.shortName} vs {event.away.shortName}
            </span>
          </div>
        </div>
      )}

      <div className="header-badge">
        <button
          className="header-icon-btn"
          onClick={() => dispatch({ type: 'SET_PAGE', page: 'home' })}
          title="Alerts"
        >
          🔔
        </button>
        {alertCount > 0 && <div className="notif-dot" />}
      </div>

      <button
        className="header-icon-btn"
        title="Profile"
        onClick={() => {}}
      >
        👤
      </button>
    </header>
  );
}
