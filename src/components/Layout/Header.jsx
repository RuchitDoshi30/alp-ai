import { useState } from 'react';
import { useApp } from '../../context/useApp';
import { EVENTS_BY_SPORT, SPORTS } from '../../data/mockEvent';

export default function Header() {
  const { state, dispatch } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);
  
  const event = EVENTS_BY_SPORT[state.selectedSport];
  const sport = SPORTS[state.selectedSport];

  const notifs = state.notifications || [];
  const unreadCount = notifs.filter(n => !n.read).length;

  const handleToggleDrawer = () => {
    setShowDrawer(!showDrawer);
    if (!showDrawer && unreadCount > 0) {
      dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
    }
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  return (
    <>
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

        <div className="header-badge" style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            onClick={handleToggleDrawer}
            title="Alerts & Notifications"
          >
            🔔
          </button>
          {unreadCount > 0 && (
            <div className="notif-dot" style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              background: 'var(--danger)',
              border: '2.5px solid var(--surface)',
              borderRadius: '50%',
              fontSize: '0.625rem',
              fontWeight: '800',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse-dot 2s infinite'
            }}>
              {unreadCount}
            </div>
          )}
        </div>

        <button
          className="header-icon-btn"
          title="Reset Session"
          onClick={() => dispatch({ type: 'RESET_PORTAL' })}
        >
          🔄
        </button>
      </header>

      {/* NOTIFICATIONS DRAWER OVERLAY */}
      {showDrawer && (
        <div 
          onClick={handleToggleDrawer}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Drawer Body */}
          <div 
            onClick={e => e.stopPropagation()} // Stop bubble up
            style={{
              width: '80%',
              height: '100%',
              background: 'var(--surface)',
              borderLeft: '1.5px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInLeft 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  🔔 Notifications
                </h3>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  History Center
                </span>
              </div>
              <button 
                onClick={handleToggleDrawer}
                style={{
                  background: 'var(--surface-2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {notifs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📭</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700' }}>No Notifications Yet</div>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Real-time gate updates, scoreboards, and order status logs appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifs.map(n => (
                    <div 
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: n.read ? 'var(--surface-2)' : 'var(--primary-light)',
                        borderLeft: `3px solid ${n.type === 'success' ? 'var(--success)' : n.type === 'accent' ? 'var(--accent)' : 'var(--primary)'}`,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        gap: '10px',
                        position: 'relative',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', alignSelf: 'flex-start' }}>{n.icon || '📢'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                          {n.desc}
                        </div>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
                          🕒 {n.time}
                        </span>
                      </div>
                      {!n.read && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: 'var(--primary)',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '10px',
                          right: '10px'
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear history footer */}
            {notifs.length > 0 && (
              <div style={{
                padding: '12px',
                borderTop: '1px solid var(--border)',
                background: 'var(--surface-2)',
              }}>
                <button 
                  onClick={handleClear}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    border: '1.5px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--danger)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  🗑️ Clear Notification History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
