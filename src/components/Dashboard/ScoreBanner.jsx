import { SPORTS, EVENTS_BY_SPORT } from '../../data/mockEvent';
import { useApp } from '../../context/useApp';

export default function ScoreBanner() {
  const { state } = useApp();
  const sport = SPORTS[state.selectedSport];
  const event = EVENTS_BY_SPORT[state.selectedSport];
  if (!sport || !event) return null;

  const idx = state.scoreIdx;
  const homeScore = event.scores.home[idx] ?? 0;
  const awayScore = event.scores.away[idx] ?? 0;
  const period = event.periods[idx] ?? '';
  const extras = event.extras;

  return (
    <div className="score-banner">
      <div className="score-match-info">
        <div className="score-sport-badge">
          <span>{sport.icon}</span>
          <span>{sport.name.toUpperCase()}</span>
        </div>
        <div className="score-live-badge">
          <div className="live-dot" />
          LIVE
        </div>
      </div>

      <div className="score-teams">
        <div className="score-team">
          <div className="score-team-logo">{event.home.emoji}</div>
          <div className="score-team-name">{event.home.shortName}</div>
        </div>

        <div className="score-vs-block">
          <div className="score-value">{homeScore}–{awayScore}</div>
          <div className="score-time">
            {period} · {event.periodLabel}
          </div>
        </div>

        <div className="score-team">
          <div className="score-team-logo">{event.away.emoji}</div>
          <div className="score-team-name">{event.away.shortName}</div>
        </div>
      </div>

      <div className="score-details-row">
        {extras.map((ex, i) => (
          <div className="score-detail-item" key={i}>
            <div className="score-detail-label">{ex.label}</div>
            <div className="score-detail-value">{ex.vals[idx] ?? '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
