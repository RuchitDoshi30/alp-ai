import FoodStands from '../components/Food/FoodStands';
import { AdBanner, AdGrid } from '../components/Ads/AdComponents';

export default function FoodPage() {
  return (
    <div className="page-enter">
      <div style={{ padding: '16px 16px 12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>🍽️ Food & Drinks</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Live wait times · Order to your seat · ≤3 taps
        </p>
      </div>

      {/* Fantasy ad at top */}
      <AdBanner adId="ad9" style={{ marginBottom: '8px' }} />

      <FoodStands />

      {/* Delivery / Food Ad */}
      <div style={{ paddingTop: '8px' }}>
        <AdBanner adId="ad7" />
      </div>

      {/* Fantasy Sports grid */}
      <AdGrid startIdx={0} title="🏆 Fantasy Sports" style={{ paddingTop: '8px', paddingBottom: '16px' }} />
    </div>
  );
}
