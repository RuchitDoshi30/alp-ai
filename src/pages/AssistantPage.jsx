import GeminiChat from '../components/Assistant/GeminiChat';

export default function AssistantPage() {
  return (
    <div className="page-enter" style={{ height: '100%' }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>🤖 AI Assistant</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Powered by Gemini · Context-aware · Always helpful
        </p>
      </div>
      <GeminiChat />
    </div>
  );
}
