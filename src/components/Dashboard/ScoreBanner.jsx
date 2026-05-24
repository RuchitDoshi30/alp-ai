import { useApp } from '../../context/useApp';

export default function ScoreBanner() {
  const { state } = useApp();
  const event = state.event;
  if (!event) return null;

  return (
    <div className="score-banner">
      <div className="score-match-info">
        <div className="score-sport-badge">
          <span>{event.sport === 'cricket' ? '🏏' : event.sport === 'football' ? '⚽' : '🏆'}</span>
          <span>{event.sport.toUpperCase()}</span>
        </div>
        {event.status === 'live' && (
          <div className="score-live-badge">
            <div className="live-dot" />
            LIVE
          </div>
        )}
      </div>

      <div className="score-teams">
        <div className="score-team">
          <div className="score-team-logo">{event.homeTeamLogo || '🏠'}</div>
          <div className="score-team-name">{event.homeTeamShort}</div>
        </div>

        <div className="score-vs-block">
          <div className="score-value">{event.homeScore}–{event.awayScore}</div>
          <div className="score-time">
            {event.period || 'In Progress'}
          </div>
        </div>

        <div className="score-team">
          <div className="score-team-logo">{event.awayTeamLogo || '🏟️'}</div>
          <div className="score-team-name">{event.awayTeamShort}</div>
        </div>
      </div>

      <div className="score-details-row">
        <div className="score-detail-item">
          <div className="score-detail-label">Venue</div>
          <div className="score-detail-value">{state.venue?.name || '—'}</div>
        </div>
        <div className="score-detail-item">
          <div className="score-detail-label">City</div>
          <div className="score-detail-value">{state.venue?.city || '—'}</div>
        </div>
        <div className="score-detail-item">
          <div className="score-detail-label">Status</div>
          <div className="score-detail-value">{event.status?.toUpperCase() || '—'}</div>
        </div>
      </div>
    </div>
  );
}
