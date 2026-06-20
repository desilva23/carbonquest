'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore, getLevelTitle } from '@/lib/store';
import { calculateEcoScore, NATIONAL_AVERAGES } from '@/lib/carbon-data';
import { getDailyMissions } from '@/lib/missions';
import EcoWorld from '@/components/ecosystem/EcoWorld';
import {
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Flame,
  Target,
  Trophy,
  Zap,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

function EcoScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="eco-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      <span className="score-value" style={{ color }}>{score}</span>
      <span className="score-label">Eco Score</span>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6',
  food: '#f59e0b',
  energy: '#ef4444',
  shopping: '#8b5cf6',
  lifestyle: '#10b981',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded, todayActivities, todayCO2, weekActivities, weekCO2, activities, missionProgress } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/onboarding');
    }
  }, [isLoaded, user, router]);

  const ecoScore = useMemo(() => calculateEcoScore(todayCO2), [todayCO2]);

  // Last 7 days trend data
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayActivities = activities.filter(
        (a) => a.timestamp.split('T')[0] === dateStr
      );
      const co2 = dayActivities.reduce((sum, a) => sum + a.kgCO2, 0);
      days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        co2: Math.round(co2 * 100) / 100,
        avg: NATIONAL_AVERAGES.global,
      });
    }
    return days;
  }, [activities]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    todayActivities.forEach((a) => {
      cats[a.category] = (cats[a.category] || 0) + a.kgCO2;
    });
    return Object.entries(cats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value * 100) / 100,
      color: CATEGORY_COLORS[name] || '#6b7280',
    }));
  }, [todayActivities]);

  // Today's missions
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMissions = useMemo(() => getDailyMissions(todayStr, 3), [todayStr]);

  if (!mounted || !isLoaded || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse-glow" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)' }} />
      </div>
    );
  }

  const xpProgress = user.xp > 0 ? Math.min(100, ((user.xp % user.xpToNextLevel) / user.xpToNextLevel) * 100) : 0;

  return (
    <div className="page-content">
      {/* Header */}
      <div
        className="animate-fade-in"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '4px' }}>
            Hello, {user.name}! 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Level {user.level} • {getLevelTitle(user.level)}
          </p>
        </div>
        <div className="streak-flame">
          <Flame size={18} />
          {user.streak} day{user.streak !== 1 ? 's' : ''}
        </div>
      </div>

      {/* XP Bar */}
      <div className="glass-card animate-fade-in stagger-1" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="#f59e0b" />
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.xp} XP</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Level {user.level + 1} in {user.xpToNextLevel - (user.xp % user.xpToNextLevel)} XP
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
        </div>
      </div>

      {/* Eco Score + Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="glass-card animate-fade-in stagger-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EcoScoreRing score={ecoScore} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-card animate-fade-in stagger-2" style={{ padding: '16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {todayCO2 <= NATIONAL_AVERAGES.india ? (
                <TrendingDown size={16} color="#10b981" />
              ) : (
                <TrendingUp size={16} color="#ef4444" />
              )}
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Today</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
              {todayCO2.toFixed(1)}
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#94a3b8', marginLeft: '4px' }}>kg CO₂</span>
            </div>
          </div>

          <div className="glass-card animate-fade-in stagger-3" style={{ padding: '16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Leaf size={16} color="#10b981" />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>This Week</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
              {weekCO2.toFixed(1)}
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#94a3b8', marginLeft: '4px' }}>kg CO₂</span>
            </div>
          </div>

          <div className="glass-card animate-fade-in stagger-3" style={{ padding: '16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Trophy size={16} color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Saved</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#10b981' }}>
              {user.totalCO2Saved.toFixed(1)}
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#94a3b8', marginLeft: '4px' }}>kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Log */}
      <Link
        href="/log"
        className="glass-card animate-fade-in stagger-3"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '16px',
          marginBottom: '16px',
          textDecoration: 'none',
          color: '#10b981',
          fontWeight: 600,
          cursor: 'pointer',
          borderColor: 'rgba(16, 185, 129, 0.2)',
        }}
      >
        <PlusCircle size={20} />
        Log an Activity
      </Link>

      {/* Interactive Eco World Visualizer */}
      <div style={{ marginBottom: '16px' }} className="animate-fade-in stagger-3">
        <EcoWorld score={ecoScore} />
      </div>

      {/* Weekly Trend Chart */}
      <div className="glass-card animate-fade-in stagger-4" style={{ padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
          7-Day Carbon Trend
        </h3>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '0.85rem',
                }}
              />
              <Area type="monotone" dataKey="co2" stroke="#10b981" fill="url(#co2Gradient)" strokeWidth={2} name="Your CO₂ (kg)" />
              <Area type="monotone" dataKey="avg" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Global Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', background: '#10b981', borderRadius: '2px', display: 'inline-block' }} />
            Your CO₂
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', background: '#f59e0b', borderRadius: '2px', display: 'inline-block', borderTop: '1px dashed #f59e0b' }} />
            Global Avg
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="glass-card animate-fade-in stagger-4" style={{ padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
            Today&apos;s Breakdown
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '120px', height: '120px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categoryData.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: cat.color }} />
                  <span style={{ fontSize: '0.85rem', flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.value} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Missions */}
      <div className="glass-card animate-fade-in stagger-5" style={{ padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="#10b981" /> Today&apos;s Missions
          </h3>
          <Link href="/missions" style={{ fontSize: '0.8rem', color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {todayMissions.map((mission) => {
          const progress = missionProgress.find((m) => m.missionId === mission.id);
          const isCompleted = progress?.completed;
          return (
            <div
              key={mission.id}
              className={`mission-card ${isCompleted ? 'completed' : ''}`}
              style={{ marginBottom: '8px' }}
            >
              <span style={{ fontSize: '1.4rem' }}>{mission.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>
                  {mission.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{mission.description}</div>
              </div>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: isCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                  color: isCompleted ? '#22c55e' : '#f59e0b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {isCompleted ? '✓ Done' : `+${mission.xpReward} XP`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="glass-card animate-fade-in stagger-5" style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
          Recent Activities
        </h3>
        {todayActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🌿</p>
            <p style={{ fontSize: '0.9rem' }}>No activities logged today</p>
            <Link href="/log" className="btn-primary" style={{ marginTop: '12px', padding: '8px 20px', fontSize: '0.85rem' }}>
              <PlusCircle size={16} /> Log Your First Activity
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayActivities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{activity.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {activity.quantity} {activity.unit}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: activity.kgCO2 > 2 ? '#ef4444' : '#10b981' }}>
                    {activity.kgCO2.toFixed(2)} kg
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>+{activity.xpEarned} XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
