import { useApp } from '../../context/useApp';

export default function SmartAlerts() {
  const { state } = useApp();
  const alerts = state.alerts;

  if (!alerts || alerts.length === 0) {
    return (
      <div className="section">
        <div className="section-header">
          <span className="section-title">⚡ Smart Alerts</span>
        </div>
        <div style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          All clear — no alerts right now
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header" style={{ padding: '20px 16px 8px' }}>
        <span className="section-title">⚡ Smart Alerts</span>
        <span className="see-all">{alerts.length} active</span>
      </div>
      <div className="alerts-scroll">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.type}`}>
            <div className="alert-icon">{alert.icon}</div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-desc">{alert.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
