'use client';

import { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { getDailyMissions, getWeeklyMissions, type Mission } from '@/lib/missions';
import { Target, Trophy, Clock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MissionsPage() {
  const {
    user,
    missionProgress,
    completeMission,
    claimMissionReward,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [timeLeft, setTimeLeft] = useState('');

  // Daily refresh timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const dailyMissions = useMemo(() => getDailyMissions(todayStr), [todayStr]);
  const weeklyMissions = useMemo(() => getWeeklyMissions(), []);

  const currentMissions = activeTab === 'daily' ? dailyMissions : weeklyMissions;

  const handleComplete = (id: string) => {
    completeMission(id);
  };

  const handleClaim = (id: string, xp: number) => {
    claimMissionReward(id, xp);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '4px' }}>
          Eco Missions
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Take real-world actions, build eco-friendly habits, and earn XP to level up.
        </p>
      </div>

      {/* Tabs & Timer */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div className="tab-nav" style={{ width: '220px' }}>
          <button
            className={activeTab === 'daily' ? 'active' : ''}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </button>
          <button
            className={activeTab === 'weekly' ? 'active' : ''}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </button>
        </div>

        {activeTab === 'daily' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(245,158,11,0.15)' }}>
            <Clock size={14} />
            <span>Refreshes in: <strong>{timeLeft}</strong></span>
          </div>
        )}
      </div>

      {/* Missions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentMissions.map((mission) => {
          const progress = missionProgress.find((m) => m.missionId === mission.id);
          const isCompleted = progress?.completed || false;
          const isClaimed = progress?.claimed || false;

          return (
            <div
              key={mission.id}
              className={`glass-card`}
              style={{
                padding: '20px',
                display: 'flex',
                gap: '16px',
                borderColor: isClaimed
                  ? 'rgba(34, 197, 94, 0.15)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.4)'
                  : 'rgba(255,255,255,0.08)',
                background: isClaimed
                  ? 'rgba(34, 197, 94, 0.02)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.05)'
                  : 'var(--glass-bg)',
                transition: 'all 200ms ease',
              }}
            >
              {/* Mission Icon */}
              <div
                style={{
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: isCompleted ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                  flexShrink: 0,
                }}
              >
                {mission.icon}
              </div>

              {/* Mission Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isClaimed ? '#94a3b8' : '#f8fafc' }}>
                    {mission.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      background:
                        mission.difficulty === 'easy'
                          ? 'rgba(34, 197, 94, 0.15)'
                          : mission.difficulty === 'medium'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                      color:
                        mission.difficulty === 'easy'
                          ? '#86efac'
                          : mission.difficulty === 'medium'
                          ? '#fcd34d'
                          : '#fca5a5',
                    }}
                  >
                    {mission.difficulty}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {mission.description}
                </p>

                {/* Actions Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Reward Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} color={isClaimed ? '#64748b' : '#f59e0b'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isClaimed ? '#64748b' : '#fbbf24' }}>
                      +{mission.xpReward} XP
                    </span>
                  </div>

                  {/* Buttons */}
                  {isClaimed ? (
                    <span style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Claimed
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(mission.id, mission.xpReward)}
                      className="btn-primary"
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        animation: 'pulse-glow 2s infinite',
                      }}
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {mission.actionText.includes('Log') ? (
                        <Link
                          href="/log"
                          className="btn-secondary"
                          style={{
                            padding: '6px 16px',
                            fontSize: '0.8rem',
                          }}
                        >
                          {mission.actionText} <ChevronRight size={12} />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleComplete(mission.id)}
                          className="btn-secondary"
                          style={{
                            padding: '6px 16px',
                            fontSize: '0.8rem',
                          }}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
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
