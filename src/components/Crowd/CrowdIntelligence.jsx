import { SECTIONS, GATES, getDensityColor } from '../../data/mockCrowd';
import { useApp } from '../../context/useApp';

function CrowdHeatmapSVG({ densities }) {
  const viewW = 398;
  const viewH = 310;

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} style={{ width: '100%', display: 'block' }}>
      <rect width={viewW} height={viewH} fill="#ECF3FF" />

      {/* Stadium outline */}
      <ellipse cx={199} cy={155} rx={185} ry={145} fill="#D8E8FF" stroke="#B0C8F0" strokeWidth={2} />
      <ellipse cx={199} cy={155} rx={145} ry={108} fill="#C8DDF8" stroke="#90B8E8" strokeWidth={1} />
      {/* Field */}
      <ellipse cx={199} cy={155} rx={110} ry={82} fill="#C8E6B0" stroke="#7CB87C" strokeWidth={1.5} />

      {/* Heatmap sections */}
      {SECTIONS.map(sec => {
        const density = densities[sec.id] ?? sec.baseDensity;
        const fill = getDensityColor(density, 0.85);
        const pct = Math.round(density * 100);
        return (
          <g key={sec.id}>
            <rect
              x={sec.x} y={sec.y} width={sec.w} height={sec.h}
              rx={6} fill={fill}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1}
            />
            <text
              x={sec.x + sec.w / 2}
              y={sec.y + sec.h / 2 - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={8}
              fontWeight="700"
            >
              {sec.label}
            </text>
            <text
              x={sec.x + sec.w / 2}
              y={sec.y + sec.h / 2 + 7}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize={8}
              fontWeight="600"
            >
              {pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function GateCard({ gate, congestion }) {
  const pct = Math.round(congestion * 100);
  const level = congestion < 0.5 ? 'low' : congestion < 0.75 ? 'medium' : 'high';
  const wait = level === 'low' ? Math.round(congestion * 5) : level === 'medium' ? Math.round(congestion * 12) : Math.round(congestion * 20);

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

  // Find least crowded sections
  const sorted = [...SECTIONS]
    .map(s => ({ ...s, density: state.crowdDensities[s.id] ?? s.baseDensity }))
    .sort((a, b) => a.density - b.density);

  const bestSections = sorted.slice(0, 3);
  const worstSections = sorted.slice(-3).reverse();

  // Best gate
  const gatesWithData = GATES.map(g => ({
    ...g,
    congestion: state.gateCongestion[g.id] ?? g.baseCongestion,
  }));
  const bestGate = [...gatesWithData].sort((a, b) => a.congestion - b.congestion)[0];

  return (
    <div style={{ paddingBottom: '16px' }}>
      {/* Heatmap */}
      <div className="heatmap-container">
        <CrowdHeatmapSVG densities={state.crowdDensities} />
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
              Sections {bestSections.map(s => s.label).join(', ')} are the least crowded — consider routes via those areas.
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
          {gatesWithData.map(gate => (
            <GateCard key={gate.id} gate={gate} congestion={gate.congestion} />
          ))}
        </div>
      </div>

      {/* Section Recommendations */}
      <div className="section" style={{ paddingBottom: '16px' }}>
        <div className="section-header">
          <span className="section-title">✅ Least Crowded</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bestSections.map((sec, i) => (
            <div key={sec.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--success-light)', borderRadius: 'var(--radius)', border: '1px solid #A7F3D0' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.875rem', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>Section {sec.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {Math.round(sec.density * 100)}% full
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '60px', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${sec.density * 100}%`, height: '100%', background: getDensityColor(sec.density, 1), borderRadius: '99px', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-header" style={{ marginTop: '16px' }}>
          <span className="section-title">🔴 Avoid These Sections</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {worstSections.map((sec) => (
            <div key={sec.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--danger-light)', borderRadius: 'var(--radius)', border: '1px solid #FECACA' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.875rem', flexShrink: 0 }}>
                ⚠
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>Section {sec.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {Math.round(sec.density * 100)}% full — very crowded
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '60px', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${sec.density * 100}%`, height: '100%', background: getDensityColor(sec.density, 1), borderRadius: '99px', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
