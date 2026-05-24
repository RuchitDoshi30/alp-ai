import { useApp } from '../../context/useApp';

function getDensityColor(density, opacity = 0.85) {
  if (density < 0.4) return `rgba(16,185,129,${opacity})`;
  if (density < 0.6) return `rgba(245,158,11,${opacity})`;
  if (density < 0.85) return `rgba(249,115,22,${opacity})`;
  return `rgba(239,68,68,${opacity})`;
}

// Stadium heatmap using real crowd zones from API
function CrowdHeatmapSVG({ zones }) {
  const viewW = 398;
  const viewH = 310;

  // Map zone names to fixed positions for the stadium SVG
  const zonePositions = {
    A1: { x: 14, y: 20, w: 85, h: 55 },
    A2: { x: 109, y: 20, w: 85, h: 55 },
    B1: { x: 204, y: 20, w: 85, h: 55 },
    B2: { x: 299, y: 20, w: 85, h: 55 },
    C1: { x: 14, y: 235, w: 85, h: 55 },
    C2: { x: 109, y: 235, w: 85, h: 55 },
    D1: { x: 204, y: 235, w: 85, h: 55 },
    D2: { x: 299, y: 235, w: 85, h: 55 },
  };

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} style={{ width: '100%', display: 'block' }}>
      <rect width={viewW} height={viewH} fill="#ECF3FF" />
      <ellipse cx={199} cy={155} rx={185} ry={145} fill="#D8E8FF" stroke="#B0C8F0" strokeWidth={2} />
      <ellipse cx={199} cy={155} rx={145} ry={108} fill="#C8DDF8" stroke="#90B8E8" strokeWidth={1} />
      <ellipse cx={199} cy={155} rx={110} ry={82} fill="#C8E6B0" stroke="#7CB87C" strokeWidth={1.5} />

      {zones.map(zone => {
        const pos = zonePositions[zone.zoneName] || { x: 50, y: 50, w: 70, h: 45 };
        const pct = Math.round(zone.density * 100);
        return (
          <g key={zone.id}>
            <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={6}
              fill={getDensityColor(zone.density, 0.85)}
              stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
            <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 - 5}
              textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="700">
              {zone.zoneName}
            </text>
            <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 7}
              textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.9)" fontSize={8} fontWeight="600">
              {pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function GateCard({ gate }) {
  const pct = Math.round(gate.congestion * 100);
  const level = gate.congestion < 0.5 ? 'low' : gate.congestion < 0.75 ? 'medium' : 'high';
  const wait = level === 'low' ? Math.round(gate.congestion * 5) : level === 'medium' ? Math.round(gate.congestion * 12) : Math.round(gate.congestion * 20);

  return (
    <div className="gate-card">
      <div className="gate-header">
        <span className="gate-name">{gate.name}</span>
        <span className={`status-badge ${level === 'low' ? 'green' : level === 'medium' ? 'yellow' : 'red'}`}>
          <span className="status-dot" />
          {level === 'low' ? 'Clear' : level === 'medium' ? 'Busy' : 'Congested'}
        </span>
      </div>
      <div className="gate-meter-wrap">
        <div className={`gate-meter ${level}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="gate-details">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{gate.direction}</span>
        <span className="gate-wait">~{wait} min wait</span>
      </div>
    </div>
  );
}

export default function CrowdIntelligence() {
  const { state } = useApp();
  const zones = state.crowdZones || [];
  const gates = state.gates || [];

  const sorted = [...zones].sort((a, b) => a.density - b.density);
  const bestSections = sorted.slice(0, 3);
  const worstSections = sorted.slice(-3).reverse();
  const bestGate = [...gates].sort((a, b) => a.congestion - b.congestion)[0];

  if (zones.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📡</div>
        <div style={{ fontWeight: '700' }}>Loading crowd data...</div>
        <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Real-time crowd density data is being fetched from sensors.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '16px' }}>
      {/* Heatmap */}
      <div className="heatmap-container">
        <CrowdHeatmapSVG zones={zones} />
        <div style={{ padding: '10px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          {[
            { color: 'rgba(16,185,129,0.85)', label: 'Low (<40%)' },
            { color: 'rgba(245,158,11,0.85)', label: 'Moderate' },
            { color: 'rgba(249,115,22,0.85)', label: 'Busy' },
            { color: 'rgba(239,68,68,0.85)', label: 'Full (>85%)' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div style={{ margin: '0 16px', padding: '14px', background: 'linear-gradient(135deg, var(--primary-light), var(--primary-mid))', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary-mid)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--primary-dark)', marginBottom: '4px' }}>AI Recommendation</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {bestGate && <>Best entry/exit right now is <strong>{bestGate.name}</strong> ({bestGate.direction}) — only {Math.round(bestGate.congestion * 100)}% congested. </>}
              Zones {bestSections.map(s => s.zoneName).join(', ')} are the least crowded — consider routes via those areas.
            </div>
          </div>
        </div>
      </div>

      {/* Gate Status */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">🚪 Gate Status</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Live</span>
        </div>
        <div className="gate-grid">
          {gates.map(gate => (
            <GateCard key={gate.id} gate={gate} />
          ))}
        </div>
      </div>

      {/* Section Recommendations */}
      <div className="section" style={{ paddingBottom: '16px' }}>
        <div className="section-header">
          <span className="section-title">✅ Least Crowded</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bestSections.map((zone, i) => (
            <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--success-light)', borderRadius: 'var(--radius)', border: '1px solid #A7F3D0' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.875rem', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>Zone {zone.zoneName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{Math.round(zone.density * 100)}% full</div>
              </div>
              <div style={{ width: '60px', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${zone.density * 100}%`, height: '100%', background: getDensityColor(zone.density, 1), borderRadius: '99px', transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="section-header" style={{ marginTop: '16px' }}>
          <span className="section-title">🔴 Avoid These Zones</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {worstSections.map(zone => (
            <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--danger-light)', borderRadius: 'var(--radius)', border: '1px solid #FECACA' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.875rem', flexShrink: 0 }}>⚠</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>Zone {zone.zoneName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{Math.round(zone.density * 100)}% full — very crowded</div>
              </div>
              <div style={{ width: '60px', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${zone.density * 100}%`, height: '100%', background: getDensityColor(zone.density, 1), borderRadius: '99px', transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
