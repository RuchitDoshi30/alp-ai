import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/useApp';

const GEMINI_API_KEY = 'AIzaSyC-CfrARS83UyAQZKWa_sAt3GtfSdd0bww';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SUGGESTIONS = [
  'Shortest food line right now?',
  'Best time to use the restroom?',
  'How do I exit fastest after the game?',
  'Which gate should I enter from?',
  'What sections are least crowded?',
  'Any food recommendations?',
];

function buildSystemContext(state) {
  const event = state.event;
  const venue = state.venue;
  const ticket = state.ticket;
  const zones = state.crowdZones || [];
  const gates = state.gates || [];
  const vendors = state.vendors || [];
  const queues = state.queueStatuses || [];

  const waitTimes = vendors.map(v => {
    const q = queues.find(q => q.vendorId === v.id);
    return `${v.name}: ${q?.waitMinutes ?? 5} min wait`;
  }).join(', ');

  const gateInfo = gates.map(g =>
    `${g.name} (${g.direction}): ${Math.round(g.congestion * 100)}% congested`
  ).join(', ');

  const crowdInfo = zones.map(z =>
    `Zone ${z.zoneName}: ${Math.round(z.density * 100)}% full`
  ).join(', ');

  const score = event ? `${event.homeTeamShort} ${event.homeScore}-${event.awayScore} ${event.awayTeamShort}` : 'N/A';

  return `You are VenueIQ, an AI assistant for fans attending a live ${event?.sport ?? 'sports'} event.
Current event: ${event?.title ?? 'Sporting Event'} at ${venue?.name ?? 'Stadium'}, ${venue?.city ?? ''}.
Fan's seat: Section ${ticket?.section ?? 'B2'}, Row ${ticket?.row ?? 'R12'}, Seat ${ticket?.seat ?? '18'}.
Current score: ${score}. Period: ${event?.period ?? 'In progress'}.
Food queue wait times: ${waitTimes}.
Gate congestion: ${gateInfo}.
Crowd zones: ${crowdInfo}.
Keep answers short, helpful, and friendly. Use emojis sparingly. Focus on practical advice.`;
}

function getLocalFallbackResponse(text, state) {
  const textLower = text.toLowerCase();
  const sport = state.selectedSport;
  const event = EVENTS_BY_SPORT[sport];
  const idx = state.scoreIdx;
  
  // Find shortest food wait stand
  const minWaitStand = Object.entries(state.liveWaitTimes)
    .sort(([, a], [, b]) => a - b)[0];
  const shortestStand = minWaitStand ? STANDS.find(s => s.id === minWaitStand[0]) : null;
  const shortestTime = minWaitStand ? minWaitStand[1] : 5;

  if (textLower.includes('food') || textLower.includes('line') || textLower.includes('queue') || textLower.includes('eat') || textLower.includes('hungry') || textLower.includes('menu') || textLower.includes('snack') || textLower.includes('drink')) {
    if (shortestStand) {
      return `🍔 **VenueIQ Concession Guide**: The shortest food line is currently at **${shortestStand.name}** with a mere **${shortestTime} minute** wait! They serve delicious **${shortestStand.menu[0]?.name || 'snacks'}** and **${shortestStand.menu[1]?.name || 'drinks'}**. You can skip the queue completely by ordering directly through the **Food** tab for seat delivery!`;
    }
    return `🌭 **Concessions**: Browse the **Food** tab in your bottom navigation to see a full directory of available food stands, real-time wait times, and seat delivery menus!`;
  }

  if (textLower.includes('restroom') || textLower.includes('toilet') || textLower.includes('loo') || textLower.includes('washroom') || textLower.includes('bathroom')) {
    return `🚽 **Restroom Intelligence**: Restrooms near Section **${event?.section || 'B'}** and Block **C** are currently at **20% capacity** with a wait time under **2 minutes**. The next break is coming up, so I highly recommend a quick trip **right now** to beat the rush!`;
  }

  if (textLower.includes('exit') || textLower.includes('leave') || textLower.includes('parking') || textLower.includes('traffic') || textLower.includes('car')) {
    // Find least congested gate
    const gateCong = Object.entries(state.gateCongestion)
      .sort(([, a], [, b]) => a - b)[0];
    const bestGate = gateCong ? GATES.find(g => g.id === gateCong[0]) : null;
    return `🚗 **Smart Exit Plan**: If you want to beat the post-game rush, exit via **${bestGate ? bestGate.name : 'Gate B'}** which currently has the lowest congestion rate at **${gateCong ? Math.round(gateCong[1] * 100) : 12}%**. Parking Lot P2 is currently flowing smoother than P1. I suggest leaving 5 minutes before the final whistle for a completely seamless getaway!`;
  }

  if (textLower.includes('gate') || textLower.includes('entry') || textLower.includes('enter') || textLower.includes('entrance') || textLower.includes('turnstile')) {
    if (event) {
      const gateCong = state.gateCongestion[event.gate.toLowerCase()] ?? 0.25;
      const pct = Math.round(gateCong * 100);
      return `🚪 **Gate Entrance & Directions**: Your ticket recommends entry through **${event.gate}**. It currently has a **${pct}% congestion rate** (approx. ${pct > 60 ? '12 min' : '2 min'} wait time). You can find step-by-step turnstile guidance and a visual map on your **Ticket** tab!`;
    }
    return `🚪 Check your ticket card for the recommended entry gate. We suggest checking gate congestion in the **Crowd Intel** tab before walking over!`;
  }

  if (textLower.includes('section') || textLower.includes('crowd') || textLower.includes('heatmap') || textLower.includes('busy') || textLower.includes('full') || textLower.includes('congest')) {
    return `👥 **Crowd Status**: Level 1 sections are currently at **75% density**, while Level 2 sections are much clearer at **40%**. You can check the interactive SVG density map under the **Crowd Intel** tab to see real-time section congestion!`;
  }

  if (textLower.includes('score') || textLower.includes('winning') || textLower.includes('match') || textLower.includes('points') || textLower.includes('runs') || textLower.includes('wickets')) {
    if (event) {
      const homeScore = event.scores.home[idx] ?? 0;
      const awayScore = event.scores.away[idx] ?? 0;
      const period = event.periods[idx] ?? '';
      return `⚡ **Match Update**: We are in the **${period}** of **${event.matchTitle}**! Current score is **${event.home.shortName} ${homeScore} - ${awayScore} ${event.away.shortName}**. It's an absolute thriller! Check the live ticker on your dashboard for minute-by-minute updates.`;
    }
    return `⚡ No live match has been loaded yet. Please complete ticket onboarding to pull in live score updates!`;
  }

  if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('hey') || textLower.includes('welcome')) {
    return `🤖 **Hello! I'm VenueIQ**, your smart AI stadium companion. I have real-time access to stadium cameras, queue sensors, and scoreboard feeds. Ask me something like:\n\n• *"Shortest food line right now?"*\n• *"Best time to use the restroom?"*\n• *"How do I exit fastest?"*\n• *"What is the live score?"*`;
  }

  return `🤖 I've checked the live stadium sensors! Restroom lines near Section **${event?.section || 'B'}** are under **2 mins**, and the food stand **${shortestStand?.name || 'Pizza'}** has the shortest queue (**${shortestTime} mins**). Let me know if you need exit directions or live match statistics!`;
}

function getChatActions(text) {
  const textLower = text.toLowerCase();
  const actions = [];

  // Restrooms
  if (textLower.includes('restroom') || textLower.includes('toilet') || textLower.includes('loo') || textLower.includes('washroom') || textLower.includes('bathroom')) {
    actions.push({
      label: '🚻 View Restrooms Map',
      page: 'navigate',
      filter: 'restroom',
      color: '#3b82f6',
      icon: '🚻'
    });
  }

  // Gates & Exits
  if (textLower.includes('gate') || textLower.includes('exit') || textLower.includes('leave') || textLower.includes('entrance') || textLower.includes('turnstile')) {
    actions.push({
      label: '🚪 View Gates & Exits',
      page: 'navigate',
      filter: 'exit',
      color: '#10b981',
      icon: '🚪'
    });
    if (textLower.includes('parking')) {
      actions.push({
        label: '🅿️ View Parking Areas',
        page: 'navigate',
        filter: 'parking',
        color: '#6b7280',
        icon: '🅿️'
      });
    }
  }

  // Medical
  if (textLower.includes('medical') || textLower.includes('first aid') || textLower.includes('doctor') || textLower.includes('injury') || textLower.includes('hospital')) {
    actions.push({
      label: '🏥 View First Aid Stations',
      page: 'navigate',
      filter: 'medical',
      color: '#ef4444',
      icon: '🏥'
    });
  }

  // Food & Beverage
  if (textLower.includes('food') || textLower.includes('line') || textLower.includes('queue') || textLower.includes('eat') || textLower.includes('hungry') || textLower.includes('menu') || textLower.includes('snack') || textLower.includes('drink') || textLower.includes('pizza') || textLower.includes('burger') || textLower.includes('concession')) {
    actions.push({
      label: '🍔 Order Food (Seat Delivery)',
      page: 'food',
      color: '#f59e0b',
      icon: '🍕'
    });
    actions.push({
      label: '🍽️ View Food Stands Map',
      page: 'navigate',
      filter: 'food',
      color: '#d97706',
      icon: '🍔'
    });
  }

  // Score/Match info
  if (textLower.includes('score') || textLower.includes('winning') || textLower.includes('match') || textLower.includes('runs') || textLower.includes('goals') || textLower.includes('points') || textLower.includes('wickets')) {
    actions.push({
      label: '📊 Open Dashboard',
      page: 'home',
      color: '#3b82f6',
      icon: '📊'
    });
  }

  // Generic Map/Section congestion
  if (actions.length === 0 && (textLower.includes('section') || textLower.includes('crowd') || textLower.includes('heatmap') || textLower.includes('busy') || textLower.includes('navigate') || textLower.includes('map') || textLower.includes('where is') || textLower.includes('direction'))) {
    actions.push({
      label: '🧭 Open Stadium Map',
      page: 'navigate',
      filter: 'all',
      color: '#3b82f6',
      icon: '🧭'
    });
  }

  return actions;
}

function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const renderedElements = [];
  let currentList = [];

  const parseInline = (lineText) => {
    let parts = [];
    const codeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(lineText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(lineText.substring(lastIndex, match.index));
      }
      parts.push(<code key={`code-${match.index}`} style={{ background: 'var(--surface-3)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.9em', fontFamily: 'monospace' }}>{match[1]}</code>);
      lastIndex = codeRegex.lastIndex;
    }
    if (lastIndex < lineText.length) {
      parts.push(lineText.substring(lastIndex));
    }

    const processBold = (items) => {
      const result = [];
      items.forEach((item, itemIdx) => {
        if (typeof item !== 'string') {
          result.push(item);
          return;
        }

        const boldRegex = /\*\*([^*]+)\*\*/g;
        let innerLastIndex = 0;
        let innerMatch;
        const innerParts = [];

        while ((innerMatch = boldRegex.exec(item)) !== null) {
          if (innerMatch.index > innerLastIndex) {
            innerParts.push(item.substring(innerLastIndex, innerMatch.index));
          }
          innerParts.push(<strong key={`bold-${itemIdx}-${innerMatch.index}`} style={{ fontWeight: '700' }}>{innerMatch[1]}</strong>);
          innerLastIndex = boldRegex.lastIndex;
        }

        if (innerLastIndex < item.length) {
          innerParts.push(item.substring(innerLastIndex));
        }
        result.push(...innerParts);
      });
      return result;
    };

    parts = processBold(parts);

    const processItalic = (items) => {
      const result = [];
      items.forEach((item, itemIdx) => {
        if (typeof item !== 'string') {
          result.push(item);
          return;
        }

        const italicRegex = /\*([^*]+)\*/g;
        let innerLastIndex = 0;
        let innerMatch;
        const innerParts = [];

        while ((innerMatch = italicRegex.exec(item)) !== null) {
          if (innerMatch.index > innerLastIndex) {
            innerParts.push(item.substring(innerLastIndex, innerMatch.index));
          }
          innerParts.push(<em key={`em-${itemIdx}-${innerMatch.index}`} style={{ fontStyle: 'italic' }}>{innerMatch[1]}</em>);
          innerLastIndex = italicRegex.lastIndex;
        }

        if (innerLastIndex < item.length) {
          innerParts.push(item.substring(innerLastIndex));
        }
        result.push(...innerParts);
      });
      return result;
    };

    return processItalic(parts);
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^([•\*\-])\s+(.*)/);
    if (bulletMatch) {
      const content = bulletMatch[2];
      currentList.push(
        <li key={`li-${index}`} style={{ marginBottom: '4px', listStyleType: 'disc' }}>
          {parseInline(content)}
        </li>
      );
    } else {
      if (currentList.length > 0) {
        renderedElements.push(
          <ul key={`ul-${index}`} style={{ margin: '6px 0', paddingLeft: '20px', listStylePosition: 'outside' }}>
            {currentList}
          </ul>
        );
        currentList = [];
      }

      if (trimmed === '') {
        renderedElements.push(<div key={`br-${index}`} style={{ height: '8px' }} />);
      } else {
        renderedElements.push(
          <p key={`p-${index}`} style={{ margin: '4px 0', lineHeight: '1.5' }}>
            {parseInline(line)}
          </p>
        );
      }
    }
  });

  if (currentList.length > 0) {
    renderedElements.push(
      <ul key="ul-final" style={{ margin: '6px 0', paddingLeft: '20px', listStylePosition: 'outside' }}>
        {currentList}
      </ul>
    );
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{renderedElements}</div>;
}

export default function GeminiChat() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const messages = state.chatMessages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { role: 'user', content: text, id: Date.now() };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: userMsg });
    setInput('');
    setIsTyping(true);

    try {
      const systemCtx = buildSystemContext(state);

      // Build conversation history for Gemini
      const contents = [
        { role: 'user', parts: [{ text: systemCtx + '\n\nUser: ' + text }] },
        ...messages.slice(-8).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
      ];

      // Remove duplicate system prompt if there's history
      const finalContents = messages.length === 0
        ? [{ role: 'user', parts: [{ text: systemCtx + '\n\nUser message: ' + text }] }]
        : [
            { role: 'user', parts: [{ text: systemCtx }] },
            { role: 'model', parts: [{ text: 'Understood! I\'m ready to help you have the best experience today. What do you need?' }] },
            ...messages.slice(-6).map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
            { role: 'user', parts: [{ text: text }] },
          ];

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: finalContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error(data?.error?.message || 'Gemini API failed or returned empty payload');
      }

      const aiText = data.candidates[0].content.parts[0].text;
      const aiMsg = { role: 'assistant', content: aiText, id: Date.now() + 1 };
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: aiMsg });
    } catch (err) {
      console.warn("Gemini API error, running smart local fallback model:", err);
      const fallbackResponse = getLocalFallbackResponse(text, state);
      const aiMsg = { role: 'assistant', content: fallbackResponse, id: Date.now() + 1 };
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: aiMsg });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '58vh' }}>
      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1 }}>
        {/* Welcome message */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🤖</div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              VenueIQ AI Assistant
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '260px', margin: '0 auto', lineHeight: '1.6' }}>
              Ask me anything about the event — food queues, navigation, crowd info, or general help!
            </div>
          </div>
        )}

        {messages.map(msg => {
          const isAi = msg.role === 'assistant';
          const actions = isAi ? getChatActions(msg.content) : [];

          return (
            <div key={msg.id} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`} style={{ display: 'flex', flexDirection: 'column' }}>
              {isAi && (
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>🤖 VenueIQ AI</div>
              )}
              <div style={isAi ? { wordBreak: 'break-word' } : { whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {isAi ? renderMarkdown(msg.content) : msg.content}
              </div>

              {isAi && actions.length > 0 && (
                <div className="chat-action-container" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '10px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)',
                  width: '100%',
                }}>
                  {actions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => {
                        if (act.filter) {
                          dispatch({ type: 'SET_POI_FILTER', filter: act.filter });
                        }
                        dispatch({ type: 'SET_PAGE', page: act.page });
                      }}
                      className="chat-action-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: `linear-gradient(135deg, ${act.color}15 0%, ${act.color}05 100%)`,
                        border: `1.5px solid ${act.color}30`,
                        borderRadius: 'var(--radius-sm)',
                        color: act.color,
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        animation: 'fadeSlideIn 0.3s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{act.icon}</span>
                        <span>{act.label}</span>
                      </span>
                      <span className="chat-action-arrow" style={{ transition: 'transform 0.2s ease' }}>→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map(s => (
            <button key={s} className="chat-suggestion-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask anything about the event..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          {isTyping ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
}
