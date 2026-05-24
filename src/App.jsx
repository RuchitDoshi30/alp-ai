import { Component } from 'react';
import './index.css';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';

// Layout
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import { LeftSidebar, RightSidebar } from './components/Layout/DesktopSidebars';

// Pages
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import TicketPage from './pages/TicketPage';
import NavigatePage from './pages/NavigatePage';
import FoodPage from './pages/FoodPage';
import CrowdPage from './pages/CrowdPage';
import AssistantPage from './pages/AssistantPage';

// Error boundary to catch HMR and runtime errors gracefully
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontWeight: '800', fontSize: '1.125rem', marginBottom: '8px', color: '#0F172A' }}>
            Something went wrong
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
            {this.state.error?.message ?? 'Unknown error'}
          </div>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ padding: '10px 24px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.9375rem', cursor: 'pointer' }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageRenderer() {
  const { state } = useApp();

  switch (state.activePage) {
    case 'home':      return <Home />;
    case 'ticket':    return <TicketPage />;
    case 'navigate':  return <NavigatePage />;
    case 'food':      return <FoodPage />;
    case 'crowd':     return <CrowdPage />;
    case 'assistant': return <AssistantPage />;
    default:          return <Home />;
  }
}

function AppShell() {
  const { state } = useApp();

  if (!state.onboarded) {
    return <Onboarding />;
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <PageRenderer />
      </main>
      <BottomNav />
    </div>
  );
}

function MainLayout() {
  return (
    <div className="desktop-layout-container">
      <LeftSidebar />
      <div className="mobile-view-wrapper">
        <AppShell />
      </div>
      <RightSidebar />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ErrorBoundary>
          <MainLayout />
        </ErrorBoundary>
      </AppProvider>
    </ErrorBoundary>
  );
}
