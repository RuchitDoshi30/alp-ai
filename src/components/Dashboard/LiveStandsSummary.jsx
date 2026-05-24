import { STANDS } from '../../data/mockMenu';
import { useApp } from '../../context/useApp';
import { getWaitLevel, getWaitBarWidth } from '../../data/mockCrowd';

export default function LiveStandsSummary({ onNavigateFood }) {
  const { state, dispatch } = useApp();

  // Show the 3 stands with shortest wait times
  const sorted = [...STANDS]
    .map(s => ({ ...s, wait: state.liveWaitTimes[s.id] ?? s.baseWait }))
    .sort((a, b) => a.wait - b.wait)
    .slice(0, 3);

  return (
    <div className="section" style={{ paddingBottom: '8px' }}>
      <div className="section-header">
        <span className="section-title">🍽️ Shortest Food Queues</span>
        <span className="see-all" onClick={onNavigateFood}>See all →</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map((stand, i) => {
          const level = getWaitLevel(stand.wait);
          const barW = getWaitBarWidth(stand.wait);
          return (
            <div
              key={stand.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: i === 0 ? 'var(--success-light)' : 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${i === 0 ? '#A7F3D0' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onClick={() => {
                dispatch({ type: 'SET_POI_FILTER', filter: 'food' });
                dispatch({ type: 'SET_PAGE', page: 'navigate' });
              }}
            >
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{stand.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {stand.name}
                  {i === 0 && <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '99px', fontWeight: '700' }}>Fastest</span>}
                </div>
                <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="wait-bar-wrap" style={{ flex: 1 }}>
                    <div className={`wait-bar ${level}`} style={{ width: `${barW}%` }} />
                  </div>
                  <span className={`wait-time-label ${level}`}>{stand.wait} min</span>
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>📍 {stand.location}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
