'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { getLeaderboard, type LeaderboardUser } from '@/lib/leaderboard';
import { Users, Flame, Trophy, Zap, Award } from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useStore();
  const [sortBy, setSortBy] = useState<'xp' | 'co2' | 'streak'>('xp');

  const leaderboard = useMemo(() => {
    // Adapter to match format required by getLeaderboard
    const currentUserAdapter = user
      ? {
          name: user.name,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          totalCO2Saved: user.totalCO2Saved,
          streak: user.streak,
        }
      : null;
    return getLeaderboard(currentUserAdapter, sortBy);
  }, [user, sortBy]);

  // Find top 3
  const topThree = useMemo(() => {
    return leaderboard.slice(0, 3);
  }, [leaderboard]);

  // Rest of the list
  const restOfList = useMemo(() => {
    return leaderboard.slice(3);
  }, [leaderboard]);

  const sortOptions = [
    { id: 'xp' as const, label: 'XP Points', icon: Zap, color: '#fbbf24' },
    { id: 'co2' as const, label: 'CO₂ Saved', icon: Trophy, color: '#10b981' },
    { id: 'streak' as const, label: 'Streak', icon: Flame, color: '#ef4444' },
  ];

  return (
    <div className="page-content animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '4px' }}>
          Leaderboard & Ranks
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          See how your eco-saving efforts compare to other climate protectors in the community.
        </p>
      </div>

      {/* Sort Filter Tab */}
      <div
        className="tab-nav"
        style={{
          display: 'flex',
          marginBottom: '32px',
          maxWidth: '500px',
        }}
      >
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = sortBy === opt.id;
          return (
            <button
              key={opt.id}
              className={isActive ? 'active' : ''}
              onClick={() => setSortBy(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Icon size={14} color={isActive ? '#ffffff' : opt.color} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium (Visual block) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '12px',
          marginBottom: '32px',
          paddingTop: '24px',
        }}
      >
        {/* Rank 2 */}
        {topThree[1] && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              maxWidth: '120px',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '4px', position: 'relative' }}>
              {topThree[1].avatar}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#94a3b8',
                  color: '#0f172a',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  border: '2px solid #0f172a',
                }}
              >
                2
              </div>
            </div>
            <div
              style={{
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px 12px 0 0',
                padding: '16px 8px 12px',
                width: '100%',
                textAlign: 'center',
                height: '90px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                {topThree[1].name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Lvl {topThree[1].level}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#94a3b8' }}>
                {sortBy === 'co2'
                  ? `${topThree[1].totalCO2Saved.toFixed(0)} kg`
                  : sortBy === 'streak'
                  ? `${topThree[1].streak}d`
                  : `${topThree[1].xp} XP`}
              </div>
            </div>
          </div>
        )}

        {/* Rank 1 (Tallest) */}
        {topThree[0] && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              maxWidth: '130px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px', position: 'relative' }}>
              {topThree[0].avatar}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#fbbf24',
                  color: '#0f172a',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: '2px solid #0f172a',
                  boxShadow: '0 0 10px rgba(251,191,36,0.5)',
                }}
              >
                👑
              </div>
            </div>
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '16px 16px 0 0',
                padding: '20px 8px 12px',
                width: '100%',
                textAlign: 'center',
                height: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(251,191,36,0.1)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', color: '#fbbf24' }}>
                {topThree[0].name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Lvl {topThree[0].level}
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fbbf24' }}>
                {sortBy === 'co2'
                  ? `${topThree[0].totalCO2Saved.toFixed(0)} kg`
                  : sortBy === 'streak'
                  ? `${topThree[0].streak}d`
                  : `${topThree[0].xp} XP`}
              </div>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {topThree[2] && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              maxWidth: '120px',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '4px', position: 'relative' }}>
              {topThree[2].avatar}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#d97706',
                  color: '#0f172a',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  border: '2px solid #0f172a',
                }}
              >
                3
              </div>
            </div>
            <div
              style={{
                background: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                borderRadius: '12px 12px 0 0',
                padding: '16px 8px 12px',
                width: '100%',
                textAlign: 'center',
                height: '90px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                {topThree[2].name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Lvl {topThree[2].level}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706' }}>
                {sortBy === 'co2'
                  ? `${topThree[2].totalCO2Saved.toFixed(0)} kg`
                  : sortBy === 'streak'
                  ? `${topThree[2].streak}d`
                  : `${topThree[2].xp} XP`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Leaderboard List */}
      <div
        className="glass-card"
        style={{
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {leaderboard.map((item) => {
          const isMe = item.id === 'current_user';
          const rank = item.rank || 0;

          return (
            <div
              key={item.id}
              className={`leaderboard-row ${isMe ? 'current-user animate-pulse-glow' : ''}`}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: isMe ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: isMe ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: '28px',
                  display: 'flex',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color:
                    rank === 1
                      ? '#fbbf24'
                      : rank === 2
                      ? '#94a3b8'
                      : rank === 3
                      ? '#d97706'
                      : '#64748b',
                }}
              >
                #{rank}
              </div>

              {/* Avatar */}
              <div style={{ fontSize: '1.4rem', margin: '0 8px' }}>{item.avatar}</div>

              {/* Name and Level */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: isMe ? '#10b981' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {item.name}
                  {isMe && (
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        fontSize: '0.65rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      YOU
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Level {item.level}</div>
              </div>

              {/* Score Value */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {sortBy === 'co2' ? (
                    <span style={{ color: '#10b981' }}>{item.totalCO2Saved.toFixed(1)} kg</span>
                  ) : sortBy === 'streak' ? (
                    <span style={{ color: '#ef4444' }}>{item.streak} days</span>
                  ) : (
                    <span style={{ color: '#fbbf24' }}>{item.xp} XP</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
