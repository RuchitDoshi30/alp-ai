import CrowdIntelligence from '../components/Crowd/CrowdIntelligence';
import { AdBanner, AdGrid } from '../components/Ads/AdComponents';

export default function CrowdPage() {
  return (
    <div className="page-enter">
      <div style={{ padding: '16px 16px 12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>👥 Crowd Intel</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time density heatmap · Gate congestion · Smart routing
        </p>
      </div>

      <CrowdIntelligence />

      {/* Betting/Sports Ad */}
      <div style={{ paddingTop: '4px' }}>
        <AdBanner adId="ad5" />
      </div>

      {/* Betting + Fantasy grid */}
      <AdGrid startIdx={4} title="📊 Live Betting & Fantasy" style={{ paddingTop: '8px', paddingBottom: '16px' }} />
    </div>
  );
}
