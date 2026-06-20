'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { NATIONAL_AVERAGES, calculateEcoScore, getCO2Comparison } from '@/lib/carbon-data';
import { BarChart3, TrendingDown, Info, ShieldCheck, Share2, Award, Lightbulb } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-hot-toast';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

export default function InsightsPage() {
  const { activities, user, weekActivities, weekCO2 } = useStore();
  const [shareOpen, setShareOpen] = useState(false);

  // 1. Weekly Category Breakdown Data
  const categoryBreakdown = useMemo(() => {
    const categories: Record<string, number> = {
      transport: 0,
      food: 0,
      energy: 0,
      shopping: 0,
      lifestyle: 0,
    };

    weekActivities.forEach((act) => {
      if (act.category in categories) {
        categories[act.category] += act.kgCO2;
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.round(value * 100) / 100,
      }))
      .filter((c) => c.value > 0);
  }, [weekActivities]);

  // 2. Benchmarks comparison data (User vs National Averages)
  const averageComparisonData = useMemo(() => {
    const dailyCO2 = weekActivities.length > 0 ? (weekCO2 / 7) : 0;
    return [
      { name: 'You (Daily Avg)', CO2: Math.round(dailyCO2 * 10) / 10, fill: '#10b981' },
      { name: 'India Avg', CO2: NATIONAL_AVERAGES.india, fill: '#3b82f6' },
      { name: 'Global Avg', CO2: NATIONAL_AVERAGES.global, fill: '#94a3b8' },
      { name: 'USA Avg', CO2: NATIONAL_AVERAGES.usa, fill: '#ef4444' },
    ];
  }, [weekActivities, weekCO2]);

  // 3. Relatable comparison
  const relatableWeekComparison = useMemo(() => {
    return getCO2Comparison(weekCO2);
  }, [weekCO2]);

  // 4. Personalized Recommendations
  const recommendations = useMemo(() => {
    const recs = [];

    // Transport check
    const transportCO2 = weekActivities
      .filter((a) => a.category === 'transport')
      .reduce((sum, a) => sum + a.kgCO2, 0);

    if (transportCO2 > 10 || user?.transport?.toLowerCase() === 'car') {
      recs.push({
        title: 'Switch to Low-Carbon Commutes',
        description: 'Your transport emissions represent a major slice of your week. Swapping a 10km car drive for a metro trip cuts emissions by 83%!',
        impact: 'High',
        tag: 'Transport',
      });
    }

    // Food check
    const foodCO2 = weekActivities
      .filter((a) => a.category === 'food')
      .reduce((sum, a) => sum + a.kgCO2, 0);

    if (foodCO2 > 15 || user?.diet?.toLowerCase().includes('meat')) {
      recs.push({
        title: 'Embrace a Green Plate',
        description: 'Plant-based meals produce 90% less CO₂ than beef. Try starting with 2 meatless days a week to save up to 12.8 kg CO₂.',
        impact: 'High',
        tag: 'Food',
      });
    }

    // Energy check
    const energyCO2 = weekActivities
      .filter((a) => a.category === 'energy')
      .reduce((sum, a) => sum + a.kgCO2, 0);

    if (energyCO2 > 20 || user?.energySource?.toLowerCase() === 'grid') {
      recs.push({
        title: 'Upgrade to Smart Home Habits',
        description: 'Turn your air conditioning to 24°C instead of lower settings, and wash your clothes in cold water to save up to 2.1 kg CO₂ per cycle.',
        impact: 'Medium',
        tag: 'Energy',
      });
    }

    // Default general recommendation if list is thin
    if (recs.length < 3) {
      recs.push({
        title: 'Avoid Single-Use Products',
        description: 'Choose reusable water bottles, cotton shopping bags, and avoid fast fashion. Manufacturing a new shirt alone emits 10 kg of CO₂.',
        impact: 'Medium',
        tag: 'Shopping',
      });
    }

    return recs;
  }, [weekActivities, user]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'My CarbonQuest Stats',
          text: `I saved ${user?.totalCO2Saved.toFixed(1)}kg of CO₂ this week on CarbonQuest! Can you beat my eco score?`,
          url: window.location.origin,
        })
        .catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(
        `I saved ${user?.totalCO2Saved.toFixed(1)}kg of CO₂ this week on CarbonQuest! Join me in tracking and reducing emissions!`
      );
      toast.success('Stats copied to clipboard! Share it on your socials 🌍');
    }
  };

  const weekScore = useMemo(() => {
    const dailyAvg = weekActivities.length > 0 ? weekCO2 / 7 : 0;
    return calculateEcoScore(dailyAvg);
  }, [weekActivities, weekCO2]);

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '4px' }}>
            Weekly Insights & Report
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            In-depth analysis of your environmental impact and how you stack up globally.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <Share2 size={16} /> Share Stats
        </button>
      </div>

      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Eco Score Rank
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {weekScore} / 100
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
            Excellent! You rank above {Math.round(weekScore * 0.9)}% of users globally.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Relatable Impact
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>{relatableWeekComparison.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e2e8f0', lineHeight: '1.4' }}>
                Your weekly footprint is {relatableWeekComparison.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts comparison to Global averages */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="#10b981" /> Benchmark Comparison
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
          How your average daily carbon output (kg CO₂) compares to the national averages of other countries.
        </p>

        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '0.8rem',
                }}
              />
              <Bar dataKey="CO2" radius={[6, 6, 0, 0]} barSize={32}>
                {averageComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown donut chart */}
      {categoryBreakdown.length > 0 && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
            Weekly Footprint by Category
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ width: '130px', height: '130px', margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
              {categoryBreakdown.map((item, idx) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[idx % COLORS.length] }} />
                  <span style={{ flex: 1, color: '#94a3b8' }}>{item.name}</span>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{item.value} kg ({Math.round((item.value / weekCO2) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="#f59e0b" /> Recommended Smart Actions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                borderLeft: '4px solid #10b981',
              }}
            >
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#10b981',
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{rec.title}</h4>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: 'rgba(245,158,11,0.1)',
                      color: '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {rec.tag}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '8px' }}>
                  {rec.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                  Potential Saving Impact: {rec.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
