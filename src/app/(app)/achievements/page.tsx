'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { ACHIEVEMENTS, RARITY_COLORS } from '@/lib/achievements';
import { Trophy, ShieldAlert, Award, Grid, Star } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Badges' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'consistency', label: 'Consistency' },
  { id: 'transport', label: 'Transport' },
  { id: 'food', label: 'Diet' },
  { id: 'energy', label: 'Energy' },
  { id: 'impact', label: 'Carbon Impact' },
  { id: 'special', label: 'Special' },
];

export default function AchievementsPage() {
  const { achievementProgress, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate stats
  const stats = useMemo(() => {
    const total = ACHIEVEMENTS.length;
    const unlockedCount = achievementProgress.filter((ap) => ap.unlocked).length;
    const percentage = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;
    
    // Calculate total points earned from achievements
    const points = achievementProgress.reduce((sum, ap) => {
      if (ap.unlocked) {
        const ach = ACHIEVEMENTS.find((a) => a.id === ap.achievementId);
        return sum + (ach?.xpReward || 0);
      }
      return sum;
    }, 0);

    return { total, unlockedCount, percentage, points };
  }, [achievementProgress]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '4px' }}>
          Eco Achievements & Badges
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Track your green accomplishments and unlock rare medals as you save the planet.
        </p>
      </div>

      {/* Progress Card */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="#fbbf24" /> Badge Progress
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              You have unlocked <strong>{stats.unlockedCount}</strong> of <strong>{stats.total}</strong> badges.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)' }}>
              {stats.percentage}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              +{stats.points} XP Earned
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: `${stats.percentage}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Category Scroll */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: selectedCategory === cat.id ? '1px solid var(--primary-500)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedCategory === cat.id ? 'var(--primary-600)' : 'rgba(15, 23, 42, 0.6)',
              color: selectedCategory === cat.id ? '#ffffff' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 200ms ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {filteredAchievements.map((achievement) => {
          const progress = achievementProgress.find((ap) => ap.achievementId === achievement.id);
          const isUnlocked = progress?.unlocked || false;
          const colors = RARITY_COLORS[achievement.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common;

          return (
            <div
              key={achievement.id}
              className={`glass-card achievement-card ${!isUnlocked ? 'locked' : ''}`}
              style={{
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '230px',
                borderColor: isUnlocked ? colors.border : 'rgba(255, 255, 255, 0.05)',
                background: isUnlocked
                  ? `linear-gradient(135deg, ${colors.bg} 0%, rgba(2, 6, 23, 0.8) 100%)`
                  : 'rgba(2, 6, 23, 0.4)',
              }}
            >
              {/* Badge Icon / Ring */}
              <div
                style={{
                  position: 'relative',
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isUnlocked ? colors.bg : 'rgba(255, 255, 255, 0.02)',
                  border: `2px dashed ${isUnlocked ? colors.border : 'rgba(255,255,255,0.05)'}`,
                  fontSize: '2.5rem',
                  marginBottom: '12px',
                }}
              >
                {achievement.icon}
                {!isUnlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      background: '#1e293b',
                      borderRadius: '50%',
                      padding: '4px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                    }}
                  >
                    <ShieldAlert size={12} color="#64748b" />
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                    color: isUnlocked ? colors.text : '#64748b',
                  }}
                >
                  {achievement.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '8px',
                    lineHeight: '1.3',
                  }}
                >
                  {achievement.description}
                </p>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: '#64748b',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  {achievement.condition}
                </div>
              </div>

              {/* Rarity and XP Badge */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  marginTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: colors.text,
                  }}
                >
                  {achievement.rarity}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>•</span>
                <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Star size={10} fill="#f59e0b" color="#f59e0b" /> +{achievement.xpReward} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
