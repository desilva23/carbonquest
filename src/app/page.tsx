'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Leaf, Target, Trophy, Bot, BarChart3, Users, Zap } from 'lucide-react';

const STATS = [
  { label: 'Active Users', value: 12847, suffix: '+', icon: '👥' },
  { label: 'CO₂ Saved (kg)', value: 48293, suffix: '+', icon: '🌿' },
  { label: 'Trees Equivalent', value: 2300, suffix: '+', icon: '🌳' },
  { label: 'Missions Done', value: 95420, suffix: '+', icon: '✅' },
];

const FEATURES = [
  {
    icon: <Leaf size={28} />,
    title: 'Smart Tracking',
    desc: 'Log activities across transport, food, energy & lifestyle with real-time CO₂ calculations',
    color: '#10b981',
  },
  {
    icon: <Bot size={28} />,
    title: 'AI Carbon Coach',
    desc: 'Get personalized tips and actionable recommendations powered by AI',
    color: '#3b82f6',
  },
  {
    icon: <Target size={28} />,
    title: 'Daily Missions',
    desc: 'Complete eco-friendly missions to earn XP and build sustainable habits',
    color: '#f59e0b',
  },
  {
    icon: <Trophy size={28} />,
    title: 'Achievements',
    desc: '24+ badges to unlock — from Seedling to Eco Legend',
    color: '#a855f7',
  },
  {
    icon: <Users size={28} />,
    title: 'Leaderboard',
    desc: 'Compete with the community and climb the carbon-saving ranks',
    color: '#ef4444',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Deep Insights',
    desc: 'Weekly reports with trends, comparisons, and AI-driven recommendations',
    color: '#06b6d4',
  },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

function Particle({ index }: { index: number }) {
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 10 + 8;

  return (
    <div
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: index % 3 === 0 ? '#10b981' : index % 3 === 1 ? '#34d399' : '#3b82f6',
        borderRadius: '50%',
        left: `${left}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.3,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="hero-bg">
      {/* Particles */}
      <div className="particles">
        {mounted && Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          background: 'rgba(2, 6, 23, 0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🌍</span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.4rem',
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CarbonQuest
          </span>
        </div>
        <Link href="/onboarding" className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
          Get Started <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '100px 24px 60px',
          }}
        >
          {/* Badge */}
          <div
            className="animate-fade-in stagger-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              color: '#34d399',
              marginBottom: '24px',
            }}
          >
            <Zap size={14} />
            AI-Powered Carbon Awareness
          </div>

          {/* Animated Earth */}
          <div
            className="animate-fade-in stagger-2"
            style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              margin: '0 auto 32px',
            }}
          >
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #34d399, #065f46 70%, #064e3b)',
                boxShadow: '0 0 60px rgba(16, 185, 129, 0.3), inset -20px -20px 40px rgba(0,0,0,0.3)',
                animation: 'spin-slow 20s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                animation: 'spin-slow 30s linear infinite reverse',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '1.5rem',
                animation: 'orbit 8s linear infinite',
              }}
            >
              🌱
            </div>
          </div>

          {/* Title */}
          <h1
            className="animate-fade-in-up stagger-3"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '800px',
            }}
          >
            Track.{' '}
            <span className="gradient-text">Reduce.</span>{' '}
            <span className="gradient-text-accent">Impact.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up stagger-4"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#94a3b8',
              maxWidth: '600px',
              lineHeight: 1.7,
              marginBottom: '36px',
            }}
          >
            Turn your daily choices into climate action. AI-powered coaching, gamified missions,
            and real-time insights to help you build a sustainable lifestyle.
          </p>

          {/* CTA */}
          <div
            className="animate-fade-in-up stagger-5"
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link
              href="/onboarding"
              className="btn-primary"
              style={{ padding: '14px 36px', fontSize: '1.05rem' }}
            >
              Start Your Quest <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
              View Demo
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up stagger-6"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginTop: '60px',
              width: '100%',
              maxWidth: '700px',
            }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass-card"
                style={{ padding: '20px 16px', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{stat.icon}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: '#10b981',
                  }}
                >
                  {mounted ? <AnimatedCounter target={stat.value} /> : '0'}
                  {stat.suffix}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section
          style={{
            padding: '80px 24px',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                marginBottom: '12px',
              }}
            >
              Everything You Need to{' '}
              <span className="gradient-text">Go Green</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              A complete platform to understand, track, and reduce your carbon footprint
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card animate-fade-in-up"
                style={{
                  padding: '28px 24px',
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0,
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${feature.color}15`,
                    color: feature.color,
                    marginBottom: '16px',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    marginBottom: '8px',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: '60px 24px 100px', maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            How It <span className="gradient-text-accent">Works</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { step: '01', title: 'Take the Quiz', desc: 'Quick onboarding to understand your lifestyle and habits', icon: '📋' },
              { step: '02', title: 'Track Your Impact', desc: 'Log daily activities and see your real-time carbon footprint', icon: '📊' },
              { step: '03', title: 'Complete Missions', desc: 'Daily eco challenges that turn green actions into a game', icon: '🎯' },
              { step: '04', title: 'Get AI Coaching', desc: 'Personalized tips and insights from your AI Carbon Coach', icon: '🤖' },
            ].map((step, i) => (
              <div
                key={step.step}
                className="glass-card animate-fade-in-up"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '24px',
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0,
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#10b981',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      marginBottom: '4px',
                    }}
                  >
                    STEP {step.step}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link
              href="/onboarding"
              className="btn-primary"
              style={{ padding: '16px 48px', fontSize: '1.1rem' }}
            >
              Begin Your Carbon Quest <ArrowRight size={20} />
            </Link>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '12px' }}>
              Free forever • No signup required • Works offline
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: '24px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
            color: '#475569',
            fontSize: '0.8rem',
          }}
        >
          Built with 💚 for a greener planet • CarbonQuest © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
