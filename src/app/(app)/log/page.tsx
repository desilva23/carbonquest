'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CATEGORIES, getFactorsByCategory, getCO2Comparison, type Category } from '@/lib/carbon-data';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogPage() {
  const router = useRouter();
  const { user, addActivity } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const factors = useMemo(
    () => (selectedCategory ? getFactorsByCategory(selectedCategory) : []),
    [selectedCategory]
  );

  const factor = useMemo(
    () => factors.find((f) => f.id === selectedFactor),
    [factors, selectedFactor]
  );

  const co2Amount = useMemo(() => {
    if (!factor || !quantity) return 0;
    return factor.kgCO2PerUnit * parseFloat(quantity);
  }, [factor, quantity]);

  const comparison = useMemo(() => getCO2Comparison(co2Amount), [co2Amount]);

  const handleLog = () => {
    if (!factor || !quantity || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const xp = addActivity({
      factorId: factor.id,
      category: factor.category,
      name: factor.name,
      icon: factor.icon,
      quantity: parseFloat(quantity),
      unit: factor.unit,
      kgCO2: co2Amount,
    });

    setEarnedXP(xp);
    setShowResult(true);
    toast.success(`Activity logged! +${xp} XP 🌟`);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedFactor(null);
    setQuantity('');
    setShowResult(false);
  };

  if (!user) return null;

  // Result screen
  if (showResult && factor) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="glass-card animate-bounce-in" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{factor.icon}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '8px' }}>
            Activity Logged!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
            {factor.name} — {quantity} {factor.unit}
          </p>

          <div
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: co2Amount > 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${co2Amount > 3 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
              marginBottom: '20px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: co2Amount > 3 ? '#ef4444' : '#10b981' }}>
              {co2Amount.toFixed(2)} kg CO₂
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
              {comparison.icon} That&apos;s {comparison.text}
            </p>
          </div>

          {/* XP Earned */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              fontWeight: 700,
              fontSize: '1rem',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={18} /> +{earnedXP} XP
          </div>

          {/* Tips */}
          {factor.tips.length > 0 && (
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                textAlign: 'left',
                marginBottom: '24px',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, marginBottom: '6px' }}>💡 Tip</p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{factor.tips[0]}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleReset} className="btn-secondary" style={{ flex: 1 }}>
              Log Another
            </button>
            <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ flex: 1 }}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 0 16px', position: 'static', background: 'transparent', border: 'none' }}>
        {(selectedCategory || selectedFactor) && (
          <button
            onClick={() => {
              if (selectedFactor) setSelectedFactor(null);
              else setSelectedCategory(null);
            }}
            className="btn-ghost"
            style={{ padding: '8px' }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem' }}>
            Log Activity
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {!selectedCategory
              ? 'Choose a category'
              : !selectedFactor
              ? 'Select an activity'
              : 'Enter details'}
          </p>
        </div>
      </div>

      {/* Step 1: Category */}
      {!selectedCategory && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as Category)}
              className="glass-card animate-fade-in-up"
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)',
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
              id={`cat-${cat.id}`}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cat.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                {getFactorsByCategory(cat.id as Category).length} activities
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Activity */}
      {selectedCategory && !selectedFactor && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {factors.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setSelectedFactor(f.id)}
              className="glass-card animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                border: '1px solid rgba(255,255,255,0.08)',
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
              }}
              id={`factor-${f.id}`}
            >
              <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{f.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: f.kgCO2PerUnit > 1 ? '#ef4444' : '#10b981' }}>
                  {f.kgCO2PerUnit} kg
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>per {f.unit}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Quantity */}
      {selectedFactor && factor && (
        <div className="animate-scale-in">
          <div className="glass-card" style={{ padding: '28px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.5rem' }}>{factor.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{factor.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{factor.description}</div>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
              How many {factor.unit}s?
            </label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <input
                type="number"
                className="input"
                placeholder={`Enter ${factor.unit}s...`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.1"
                autoFocus
                id="quantity-input"
                style={{ fontSize: '1.2rem', flex: 1 }}
              />
            </div>

            {/* Quick select buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[1, 2, 5, 10, 20, 50].map((val) => (
                <button
                  key={val}
                  onClick={() => setQuantity(val.toString())}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: quantity === val.toString() ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: quantity === val.toString() ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: '#e2e8f0',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Live CO2 preview */}
            {quantity && parseFloat(quantity) > 0 && (
              <div
                className="animate-fade-in"
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: co2Amount > 3 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${co2Amount > 3 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Carbon Impact</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: co2Amount > 3 ? '#ef4444' : '#10b981' }}>
                    {co2Amount.toFixed(2)} kg CO₂
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {comparison.icon} {comparison.text}
                </p>
              </div>
            )}

            <button
              onClick={handleLog}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              disabled={!quantity || parseFloat(quantity) <= 0}
            >
              <Check size={20} /> Log Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
