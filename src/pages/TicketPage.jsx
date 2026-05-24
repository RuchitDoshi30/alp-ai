import TicketCard from '../components/Ticket/TicketCard';
import { AdBanner, AdGrid } from '../components/Ads/AdComponents';

export default function TicketPage() {
  return (
    <div className="page-enter" style={{ padding: '0 0 0' }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>🎫 My Ticket</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Present this QR at the gate entrance
        </p>
      </div>

      <TicketCard />

      {/* Fantasy ad below ticket */}
      <AdBanner adId="ad2" style={{ marginBottom: '8px' }} />

      {/* Gaming grid */}
      <AdGrid startIdx={6} title="🎮 Play & Win" style={{ paddingBottom: '16px' }} />
    </div>
  );
}
