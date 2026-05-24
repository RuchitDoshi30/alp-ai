import { useApp } from '../../context/useApp';

const ACTIONS = [
  { icon: '🎫', label: 'My Ticket', page: 'ticket', bg: '#EFF6FF' },
  { icon: '🗺️', label: 'Navigate', page: 'navigate', bg: '#D1FAE5' },
  { icon: '🍽️', label: 'Order Food', page: 'food', bg: '#FEF3C7' },
  { icon: '🤖', label: 'AI Help', page: 'assistant', bg: '#EDE9FE' },
];

export default function QuickActions() {
  const { dispatch } = useApp();

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Quick Actions</span>
      </div>
      <div className="quick-actions">
        {ACTIONS.map(action => (
          <button
            key={action.page}
            className="quick-action-btn"
            onClick={() => dispatch({ type: 'SET_PAGE', page: action.page === 'ticket' ? 'ticket' : action.page })}
          >
            <div className="quick-action-icon" style={{ background: action.bg }}>
              {action.icon}
            </div>
            <span className="quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
