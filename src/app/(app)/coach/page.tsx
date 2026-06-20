'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Bot, Send, User, Sparkles, AlertCircle, Key } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'How do I reduce my food emissions?',
  'Give me 3 easy actions for today.',
  'What is my current carbon score?',
  'Explain carbon offsets simply.',
];

export default function AICoachPage() {
  const { user, chatHistory, addChatMessage, todayCO2, weekCO2 } = useStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Check if API key exists (runs on client side by querying a dummy request or checking a flag)
  const verifyApiKey = (keyToTest: string) => {
    fetch('/api/ai-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'ping',
        customApiKey: keyToTest,
        userContext: {
          name: 'Explorer',
          level: 1,
          xp: 0,
          streak: 0,
          todayCO2: 0,
          totalCO2Saved: 0,
          diet: 'Standard',
          transport: 'Car',
          energySource: 'Grid'
        },
        chatHistory: []
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.isConfigured) {
          setHasApiKey(true);
        } else {
          setHasApiKey(false);
        }
      })
      .catch(() => setHasApiKey(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('groq_api_key') || '';
      setCustomApiKey(storedKey);
      verifyApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = (newKey: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('groq_api_key', newKey);
      setCustomApiKey(newKey);
      verifyApiKey(newKey);
      setShowKeyModal(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setInputMessage('');
    
    // Add user message to local state store
    addChatMessage({
      role: 'user',
      content: userMsg,
    });

    setIsLoading(true);

    try {
      const storedKey = typeof window !== 'undefined' ? localStorage.getItem('groq_api_key') || '' : '';
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          customApiKey: storedKey,
          userContext: {
            name: user?.name || 'Explorer',
            level: user?.level || 1,
            xp: user?.xp || 0,
            streak: user?.streak || 0,
            todayCO2,
            weekCO2,
            totalCO2Saved: user?.totalCO2Saved || 0,
            diet: user?.diet || 'Standard',
            transport: user?.transport || 'Car',
            energySource: user?.energySource || 'Grid',
          },
          chatHistory: [...chatHistory, { role: 'user', content: userMsg }],
        }),
      });

      const data = await response.json();
      
      addChatMessage({
        role: 'assistant',
        content: data.content,
      });
    } catch (error) {
      console.error('Failed to get response:', error);
      addChatMessage({
        role: 'assistant',
        content: "Oops! I encountered an error. Try saving power and trying again shortly!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div
      className="page-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        maxHeight: '850px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot color="#10b981" /> AI Carbon Coach
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Get direct sustainability insights and actions tailored for you.
          </p>
        </div>
        {hasApiKey === false && (
          <button
            onClick={() => setShowKeyModal(true)}
            className="btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              color: '#f1f5f9',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Key size={14} color="#10b981" />
            Configure API Key
          </button>
        )}
      </div>

      {/* API Key missing banner */}
      {hasApiKey === false && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '0.8rem',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>
            Running in <strong>Demo Sandbox Mode</strong>. Add `GROQ_API_KEY` to your environment for real-time Llama 3 coach responses.
          </span>
        </div>
      )}

      {/* Chat Display Container */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Welcome Message */}
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'rgba(16,185,129,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <Bot size={18} color="#10b981" />
            </div>
            <div
              className="chat-bubble assistant"
              style={{ margin: 0, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              Hi {user?.name || 'Eco Warrior'}! I&apos;m <strong>Eco</strong>, your AI Carbon Coach. 🌍
              <br />
              <br />
              I can help you build simple habits to cut down your footprint. Ask me anything, or select a prompt below!
            </div>
          </div>

          {/* Chat Messages */}
          {chatHistory.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: isUser ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: isUser ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(16,185,129,0.2)',
                    fontSize: '1rem',
                  }}
                >
                  {isUser ? <User size={18} color="#3b82f6" /> : <Bot size={18} color="#10b981" />}
                </div>
                <div
                  className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    background: isUser ? 'var(--primary-600)' : 'rgba(255,255,255,0.02)',
                    borderColor: isUser ? 'transparent' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'rgba(16,185,129,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot size={18} color="#10b981" />
              </div>
              <div className="chat-bubble assistant" style={{ margin: 0, padding: '12px 20px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8' }}></span>
                <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animationDelay: '0.2s' }}></span>
                <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Block */}
        {chatHistory.length === 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(2,6,23,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '10px' }}>
              <Sparkles size={12} color="#10b981" /> SUGGESTED TOPICS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    e.currentTarget.style.color = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            className="input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Eco anything about saving carbon..."
            disabled={isLoading}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={!inputMessage.trim() || isLoading}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="glass-card animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '450px',
              padding: '28px 24px',
              position: 'relative',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key color="#10b981" size={20} /> Configure Groq API Key
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px' }}>
              To enable real-time Llama 3 responses directly in your browser, enter your Groq API key below. The key is stored locally in your browser and never sent anywhere else.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Groq API Key
              </label>
              <input
                type="password"
                className="input"
                placeholder="gsk_..."
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
                Don't have a key? Get one for free at the{' '}
                <a
                  href="https://console.groq.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#10b981', textDecoration: 'underline' }}
                >
                  Groq Console
                </a>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  handleSaveApiKey('');
                }}
                style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444' }}
              >
                Clear Key
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowKeyModal(false)}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleSaveApiKey(customApiKey)}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
