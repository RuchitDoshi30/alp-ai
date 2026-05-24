import { useApp } from '../../context/useApp';

export default function LiveStandsSummary() {
  const { state, dispatch } = useApp();
  const vendors = state.vendors || [];
  const queueStatuses = state.queueStatuses || [];

  if (vendors.length === 0) return null;

  // Build vendor list with queue data
  const vendorData = vendors.map(v => {
    const queue = queueStatuses.find(q => q.vendorId === v.id);
    const wait = queue?.waitMinutes || 5;
    const level = wait < 8 ? 'low' : wait < 15 ? 'medium' : 'high';
    const barW = Math.min(100, (wait / 25) * 100);
    return { ...v, wait, level, barW };
  }).sort((a, b) => a.wait - b.wait);

  const best = vendorData[0];

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">🍽️ Food & Queues</span>
        <button className="section-more" onClick={() => dispatch({ type: 'SET_PAGE', page: 'food' })}>
          See All →
        </button>
      </div>

      {/* Quick recommendation */}
      <div style={{
        padding: '10px 12px', marginBottom: '10px',
        background: 'var(--success-light)', borderRadius: 'var(--radius)', border: '1px solid #A7F3D0',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '1.2rem' }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '0.8125rem', color: '#065F46' }}>
            Fastest: {best.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#047857' }}>
            Only {best.wait} min wait · {best.location}
          </div>
        </div>
      </div>

      {/* Vendor list */}
      {vendorData.slice(0, 4).map(v => (
        <div key={v.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <span style={{ fontSize: '1.2rem' }}>
            {v.cuisineType === 'Fast Food' ? '🍔' : v.cuisineType === 'Indian Snacks' ? '🍲' : v.cuisineType === 'Italian' ? '🍕' : '🥤'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '0.8125rem' }}>{v.name}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '40px', height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                width: `${v.barW}%`, height: '100%', borderRadius: '99px',
                background: v.level === 'low' ? 'var(--success)' : v.level === 'medium' ? 'var(--warning)' : 'var(--danger)',
                transition: 'width 1s ease',
              }} />
            </div>
            <span style={{
              fontSize: '0.75rem', fontWeight: '700',
              color: v.level === 'low' ? 'var(--success)' : v.level === 'medium' ? 'var(--warning)' : 'var(--danger)',
            }}>
              {v.wait}m
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
