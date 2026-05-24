import { useApp } from '../../context/useApp';

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'navigate', icon: '🗺️', label: 'Navigate' },
  { id: 'food', icon: '🍽️', label: 'Food' },
  { id: 'crowd', icon: '👥', label: 'Crowd' },
  { id: 'assistant', icon: '🤖', label: 'AI Help' },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-item ${state.activePage === item.id ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_PAGE', page: item.id })}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
