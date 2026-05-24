import { useState } from 'react';
import { SECTIONS, POIS, getDensityColor, POI_TYPES } from '../../data/mockCrowd';
import { useApp } from '../../context/useApp';
import { EVENTS_BY_SPORT } from '../../data/mockEvent';

function PlayingField({ sportId }) {
  // Center is (215, 170)
  switch (sportId) {
    case 'cricket':
      return (
        <g>
          {/* Outfield ellipse */}
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="#2E7D32" stroke="#A5D6A7" strokeWidth={2} />
          {/* 30-yard circle line */}
          <ellipse cx={215} cy={170} rx={68} ry={48} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} strokeDasharray="3 3" />
          {/* Cricket Pitch in center */}
          <rect x={205} y={155} width={20} height={30} fill="#E5C290" stroke="#C39B62" strokeWidth={1} rx={1} />
          <line x1={205} y1={160} x2={225} y2={160} stroke="white" strokeWidth={0.8} /> {/* Crease */}
          <line x1={205} y1={180} x2={225} y2={180} stroke="white" strokeWidth={0.8} /> {/* Crease */}
          {/* Pitch wickets */}
          <circle cx={215} cy={156} r={1.5} fill="#D32F2F" />
          <circle cx={215} cy={184} r={1.5} fill="#D32F2F" />
        </g>
      );
    case 'football':
      return (
        <g>
          {/* Field turf stripes */}
          <mask id="football-mask">
            <ellipse cx={215} cy={170} rx={108} ry={76} fill="white" />
          </mask>
          <g mask="url(#football-mask)">
            <ellipse cx={215} cy={170} rx={108} ry={76} fill="#388E3C" />
            {/* Alternating stripes */}
            {Array.from({ length: 9 }).map((_, i) => (
              <rect
                key={i}
                x={215 - 108 + i * 24}
                y={170 - 76}
                width={12}
                height={152}
                fill="rgba(255,255,255,0.06)"
              />
            ))}
          </g>
          {/* Boundary outline */}
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="none" stroke="#71C071" strokeWidth={2} />
          {/* Football pitch rect */}
          <rect x={135} y={115} width={160} height={110} fill="none" stroke="white" strokeWidth={1.5} />
          {/* Halfway line */}
          <line x1={215} y1={115} x2={215} y2={225} stroke="white" strokeWidth={1.5} />
          {/* Center circle */}
          <circle cx={215} cy={170} r={22} fill="none" stroke="white" strokeWidth={1.5} />
          <circle cx={215} cy={170} r={2} fill="white" />
          {/* Goal boxes */}
          <rect x={135} y={142} width={16} height={56} fill="none" stroke="white" strokeWidth={1.5} />
          <rect x={264} y={142} width={16} height={56} fill="none" stroke="white" strokeWidth={1.5} />
          {/* Penalty spots */}
          <circle cx={147} cy={170} r={1.5} fill="white" />
          <circle cx={283} cy={170} r={1.5} fill="white" />
        </g>
      );
    case 'basketball':
      return (
        <g>
          {/* Basketball court surrounds */}
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="#5C4033" stroke="#4b3621" strokeWidth={2} />
          {/* Hardwood rectangle mat */}
          <rect x={140} y={115} width={150} height={110} fill="#E0A96D" stroke="#B87D3B" strokeWidth={2} rx={2} />
          {/* Court markings */}
          <line x1={215} y1={115} x2={215} y2={225} stroke="white" strokeWidth={1.5} />
          {/* Center circle */}
          <circle cx={215} cy={170} r={15} fill="none" stroke="white" strokeWidth={1.5} />
          {/* Three-point lines (left and right arcs) */}
          <path d="M 140 135 Q 185 170 140 205" fill="none" stroke="white" strokeWidth={1.5} />
          <path d="M 290 135 Q 245 170 290 205" fill="none" stroke="white" strokeWidth={1.5} />
          {/* Key areas */}
          <rect x={140} y={150} width={25} height={40} fill="none" stroke="white" strokeWidth={1.5} />
          <rect x={265} y={150} width={25} height={40} fill="none" stroke="white" strokeWidth={1.5} />
        </g>
      );
    case 'hockey':
      return (
        <g>
          {/* Electric blue turf */}
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="#0D47A1" stroke="#1565C0" strokeWidth={2} />
          {/* Field boundaries */}
          <rect x={135} y={115} width={160} height={110} fill="none" stroke="white" strokeWidth={1.5} />
          {/* Center line */}
          <line x1={215} y1={115} x2={215} y2={225} stroke="white" strokeWidth={1.5} />
          {/* Shooting circles (D-lines) */}
          <path d="M 135 140 Q 170 170 135 200" fill="none" stroke="white" strokeWidth={1.5} />
          <path d="M 295 140 Q 260 170 295 200" fill="none" stroke="white" strokeWidth={1.5} />
          {/* Center circle */}
          <circle cx={215} cy={170} r={12} fill="none" stroke="white" strokeWidth={1.2} />
        </g>
      );
    case 'tennis':
      return (
        <g>
          {/* Outer green field */}
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="#2E7D32" stroke="#1B5E20" strokeWidth={2} />
          {/* Blue court surface */}
          <rect x={145} y={120} width={140} height={100} fill="#1565C0" stroke="white" strokeWidth={2} />
          {/* Singles sidelines */}
          <rect x={145} y={130} width={140} height={80} fill="none" stroke="white" strokeWidth={1} />
          {/* Center service line */}
          <line x1={180} y1={130} x2={180} y2={210} stroke="white" strokeWidth={1} />
          <line x1={250} y1={130} x2={250} y2={210} stroke="white" strokeWidth={1} />
          <line x1={180} y1={170} x2={250} y2={170} stroke="white" strokeWidth={1} />
          {/* Tennis Net */}
          <line x1={215} y1={118} x2={215} y2={222} stroke="#37474F" strokeWidth={2} strokeDasharray="3 1.5" />
          {/* Net posts */}
          <circle cx={215} cy={118} r={2.5} fill="#78909C" />
          <circle cx={215} cy={222} r={2.5} fill="#78909C" />
        </g>
      );
    case 'kabaddi':
      return (
        <g>
          {/* Outer mat surrounds */}
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="#D84315" stroke="#BF360C" strokeWidth={2} />
          {/* Yellow/Orange court mat */}
          <rect x={145} y={125} width={140} height={90} fill="#FFB300" stroke="white" strokeWidth={2} />
          {/* Mid line */}
          <line x1={215} y1={125} x2={215} y2={215} stroke="#E65100" strokeWidth={2.5} />
          {/* Balk lines (left & right) */}
          <line x1={185} y1={125} x2={185} y2={215} stroke="white" strokeWidth={1.5} />
          <line x1={245} y1={125} x2={245} y2={215} stroke="white" strokeWidth={1.5} />
          {/* Bonus lines (left & right) */}
          <line x1={170} y1={125} x2={170} y2={215} stroke="white" strokeWidth={1.5} strokeDasharray="3 2" />
          <line x1={260} y1={125} x2={260} y2={215} stroke="white" strokeWidth={1.5} strokeDasharray="3 2" />
          {/* Lobby side strips */}
          <rect x={145} y={125} width={140} height={8} fill="#FF8F00" stroke="white" strokeWidth={1} />
          <rect x={145} y={207} width={140} height={8} fill="#FF8F00" stroke="white" strokeWidth={1} />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx={215} cy={170} rx={108} ry={76} fill="#C8E6B0" stroke="#7CB87C" strokeWidth={2} />
          <ellipse cx={215} cy={170} rx={55} ry={38} fill="none" stroke="#7CB87C" strokeWidth={1} strokeDasharray="4 3" />
          <line x1={215} y1={94} x2={215} y2={246} stroke="#7CB87C" strokeWidth={1} strokeDasharray="5 4" />
          <circle cx={215} cy={170} r={8} fill="none" stroke="#7CB87C" strokeWidth={1.5} />
        </g>
      );
  }
}

function StadiumSVGMap({ densities, activePOI, userSection, recommendedGateLetter, sportId }) {
  const viewW = 430;
  const viewH = 340;
  const trackColor = '#E8A87C';

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} style={{ width: '100%', display: 'block' }}>
      {/* Background */}
      <rect width={viewW} height={viewH} fill="#ECF3FF" />

      {/* Outer stadium ellipse */}
      <ellipse cx={215} cy={170} rx={195} ry={155} fill="#D8E8FF" stroke="#B0C8F0" strokeWidth={2} />

      {/* Running track */}
      <ellipse cx={215} cy={170} rx={155} ry={115} fill={trackColor} stroke="#CC8855" strokeWidth={1.5} />

      {/* Dynamic Playing field based on selected sport */}
      <PlayingField sportId={sportId} />

      {/* Seating sections */}
      {SECTIONS.map(sec => {
        const density = densities[sec.id] ?? sec.baseDensity;
        const fill = getDensityColor(density, 0.75);
        const isUser = sec.id === userSection;
        return (
          <g key={sec.id}>
            <rect
              x={sec.x} y={sec.y} width={sec.w} height={sec.h}
              rx={6} ry={6}
              fill={fill}
              stroke={isUser ? '#2563EB' : 'rgba(255,255,255,0.6)'}
              strokeWidth={isUser ? 2.5 : 1}
            />
            <text
              x={sec.x + sec.w / 2}
              y={sec.y + sec.h / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={9}
              fontWeight={isUser ? '800' : '600'}
              style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              {sec.label}
            </text>
            {isUser && (
              <circle
                cx={sec.x + sec.w / 2}
                cy={sec.y - 8}
                r={5}
                fill="#2563EB"
                stroke="white"
                strokeWidth={2}
              />
            )}
          </g>
        );
      })}

      {/* Pulsing entry route path from recommended gate to seating section */}
      {recommendedGateLetter && userSection && (() => {
        const GATES_COORDS = {
          'A': { x: 215, y: 12 },
          'B': { x: 410, y: 170 },
          'C': { x: 20, y: 170 },
          'D': { x: 215, y: 328 },
        };
        const gatePos = GATES_COORDS[recommendedGateLetter] || GATES_COORDS['D'];
        const sec = SECTIONS.find(s => s.id === userSection);
        if (!gatePos || !sec) return null;
        
        // Concourse walk parameters
        const cx = 215;
        const cy = 170;
        const rx = 180; // Walks along outer track corridor
        const ry = 142; // Walkway height radius

        // Gate angle
        let gateAngle = Math.PI / 2; // Gate D
        if (recommendedGateLetter === 'A') gateAngle = -Math.PI / 2;
        else if (recommendedGateLetter === 'B') gateAngle = 0;
        else if (recommendedGateLetter === 'C') gateAngle = Math.PI;

        // Target angle based on section center
        const targetX = sec.x + sec.w / 2;
        const targetY = sec.y + sec.h / 2;
        const targetAngle = Math.atan2(targetY - cy, targetX - cx);

        // Shortest angular distance
        let diff = targetAngle - gateAngle;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        while (diff > Math.PI) diff -= 2 * Math.PI;

        // Generate points along concourse loop
        const points = [];
        points.push(`${gatePos.x},${gatePos.y}`);

        const steps = 18;
        for (let i = 0; i <= steps; i++) {
          const angle = gateAngle + (diff * i) / steps;
          const px = cx + rx * Math.cos(angle);
          const py = cy + ry * Math.sin(angle);
          points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }

        // Enter section from concourse
        points.push(`${targetX.toFixed(1)},${targetY.toFixed(1)}`);
        const dAttr = `M ` + points.join(' L ');

        return (
          <path
            d={dAttr}
            fill="none"
            stroke="#2563EB"
            strokeWidth={3}
            className="entry-path-line"
            style={{ 
              strokeDasharray: '6 4',
              animation: 'mapPathDash 1.2s linear infinite',
              filter: 'drop-shadow(0 0 3px rgba(37,99,235,0.6))'
            }}
          />
        );
      })()}

      {/* Gate markers */}
      {[
        { id: 'A', x: 215, y: 12, label: 'Gate A' },
        { id: 'B', x: 410, y: 170, label: 'Gate B' },
        { id: 'C', x: 20, y: 170, label: 'Gate C' },
        { id: 'D', x: 215, y: 328, label: 'Gate D' },
      ].map(gate => {
        const isRecommended = gate.id === recommendedGateLetter;
        return (
          <g key={gate.id}>
            {isRecommended && (
              <circle 
                cx={gate.x} cy={gate.y} r={18} 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth={1.5}
                style={{ animation: 'live-pulse 1.5s infinite' }}
              />
            )}
            <circle cx={gate.x} cy={gate.y} r={12} fill={isRecommended ? '#10B981' : '#2563EB'} stroke="white" strokeWidth={2} />
            <text x={gate.x} y={gate.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="800">
              {gate.id}
            </text>
          </g>
        );
      })}

      {/* POI icons based on active filter */}
      {activePOI !== 'all' && POIS.filter(p => p.type === activePOI).map((poi, i) => {
        const positions = [
          { x: 90, y: 155 }, { x: 340, y: 155 }, { x: 215, y: 92 },
          { x: 215, y: 248 }, { x: 130, y: 200 }, { x: 300, y: 200 },
        ];
        const pos = positions[i % positions.length];
        return (
          <g key={poi.id}>
            <circle cx={pos.x} cy={pos.y} r={14} fill="white" stroke="#E2E8F0" strokeWidth={1.5} />
            <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={12}>
              {poi.icon}
            </text>
          </g>
        );
      })}

      {/* You are here label */}
      <rect x={148} y={295} width={134} height={22} rx={11} fill="rgba(37,99,235,0.85)" />
      <text x={215} y={306} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={9} fontWeight="700">
        📍 YOUR SEAT — Section {userSection}
      </text>
    </svg>
  );
}

export default function StadiumMap() {
  const { state, dispatch } = useApp();
  const event = EVENTS_BY_SPORT[state.selectedSport];
  const activePOI = state.poiFilter || 'all';

  const userSection = event?.section ? `${event.section}` : 'B2';
  // Find closest section label to user section
  const mappedSection = SECTIONS.find(s => s.label === userSection || s.label === `B2`) || SECTIONS[4];

  const filteredPOIs = activePOI === 'all' ? POIS : POIS.filter(p => p.type === activePOI);
  const recommendedGateLetter = event?.gate ? event.gate.replace('Gate ', '').trim() : 'D';

  return (
    <div>
      {/* Recommended Gate Entrance Card */}
      <div style={{
        margin: '12px 16px 8px',
        padding: '12px 14px',
        background: 'var(--primary-light)',
        border: '1.5px solid var(--primary-mid)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '1.5rem' }}>🚪</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '800', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>
            Designated Entry: {event?.gate || 'Gate D'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Follow the pulsing path from gate A-D to Section {userSection}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <StadiumSVGMap
          densities={state.crowdDensities}
          activePOI={activePOI}
          userSection={mappedSection?.id}
          recommendedGateLetter={recommendedGateLetter}
          sportId={state.selectedSport}
        />
        <div className="map-controls">
          <button className="map-ctrl-btn" title="Zoom in">＋</button>
          <button className="map-ctrl-btn" title="Zoom out">－</button>
          <button className="map-ctrl-btn" title="Center">⊙</button>
        </div>
      </div>

      {/* Density Legend */}
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
        {[
          { color: 'rgba(16,185,129,0.75)', label: 'Light' },
          { color: 'rgba(245,158,11,0.75)', label: 'Moderate' },
          { color: 'rgba(249,115,22,0.75)', label: 'Busy' },
          { color: 'rgba(239,68,68,0.75)', label: 'Crowded' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* POI Filter */}
      <div className="poi-filter-bar">
        {POI_TYPES.map(pt => (
          <button
            key={pt.key}
            className={`poi-chip ${activePOI === pt.key ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_POI_FILTER', filter: pt.key })}
          >
            {pt.icon} {pt.label}
          </button>
        ))}
      </div>

      {/* POI List */}
      <div className="poi-list" style={{ marginTop: '8px', paddingBottom: '16px' }}>
        {filteredPOIs.map(poi => {
          const wait = state.poiWaits[poi.id] ?? poi.baseWait;
          return (
            <div key={poi.id} className="poi-item">
              <div className="poi-icon" style={{
                background: poi.type === 'food' ? '#FEF3C7' :
                  poi.type === 'restroom' ? '#EFF6FF' :
                  poi.type === 'exit' ? '#D1FAE5' :
                  poi.type === 'medical' ? '#FEE2E2' : '#F3F4F6',
              }}>
                {poi.icon}
              </div>
              <div className="poi-details">
                <div className="poi-name">{poi.name}</div>
                <div className="poi-sub">📍 {poi.loc}</div>
              </div>
              <div className="poi-meta">
                <span className="poi-distance">🚶 {poi.distance}</span>
                {wait > 0 ? (
                  <span className={`status-badge ${wait <= 5 ? 'green' : wait <= 10 ? 'yellow' : 'red'}`}>
                    <span className="status-dot" />
                    {wait} min
                  </span>
                ) : (
                  <span className="status-badge green">
                    <span className="status-dot" />
                    Open
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
