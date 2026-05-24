import StadiumMap from '../components/Navigate/StadiumMap';
import { AdBanner, AdGrid } from '../components/Ads/AdComponents';

export default function NavigatePage() {
  return (
    <div className="page-enter">
      <div style={{ padding: '16px 16px 12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>🗺️ Navigate</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Live crowd density · Find anything in seconds
        </p>
      </div>

      <StadiumMap />

      {/* Travel Ad */}
      <div style={{ paddingTop: '8px' }}>
        <AdBanner adId="ad8" />
      </div>

      {/* Gaming Ads grid */}
      <AdGrid startIdx={2} title="🎮 Games & Offers" style={{ paddingTop: '8px', paddingBottom: '16px' }} />
    </div>
  );
}
