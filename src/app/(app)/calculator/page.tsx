'use client';

import { useState, useMemo } from 'react';
import { EMISSION_FACTORS, getCO2Comparison, NATIONAL_AVERAGES } from '@/lib/carbon-data';
import { Calculator, Plane, Utensils, Lightbulb, RefreshCw, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'travel' | 'food' | 'energy' | 'scenario'>('travel');

  // --- Travel Calculator State ---
  const [travelDistance, setTravelDistance] = useState(10);
  const [selectedTransport, setSelectedTransport] = useState('car_petrol');

  const travelCO2 = useMemo(() => {
    const factor = EMISSION_FACTORS.find((f) => f.id === selectedTransport);
    if (!factor) return 0;
    return travelDistance * factor.kgCO2PerUnit;
  }, [travelDistance, selectedTransport]);

  const travelComparison = useMemo(() => getCO2Comparison(travelCO2), [travelCO2]);

  // --- Food Calculator State ---
  const [mealItems, setMealItems] = useState<{ id: string; servings: number }[]>([
    { id: 'chicken_meal', servings: 1 },
    { id: 'dairy_milk', servings: 1 },
    { id: 'coffee', servings: 1 },
  ]);

  const foodCO2 = useMemo(() => {
    return mealItems.reduce((sum, item) => {
      const factor = EMISSION_FACTORS.find((f) => f.id === item.id);
      return sum + (factor?.kgCO2PerUnit || 0) * item.servings;
    }, 0);
  }, [mealItems]);

  const foodComparison = useMemo(() => getCO2Comparison(foodCO2), [foodCO2]);

  const addMealItem = (id: string) => {
    setMealItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, servings: item.servings + 1 } : item));
      }
      return [...prev, { id, servings: 1 }];
    });
  };

  const removeMealItem = (id: string) => {
    setMealItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateMealServings = (id: string, val: number) => {
    setMealItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, servings: Math.max(1, val) } : item))
    );
  };

  // --- Energy Calculator State ---
  const [kwhUsed, setKwhUsed] = useState(100); // monthly electricity
  const [gasUsed, setGasUsed] = useState(10);  // cooking gas kg
  const [acHours, setAcHours] = useState(24);   // AC hours

  const energyCO2 = useMemo(() => {
    const electFactor = EMISSION_FACTORS.find((f) => f.id === 'electricity')?.kgCO2PerUnit || 0.82;
    const gasFactor = EMISSION_FACTORS.find((f) => f.id === 'natural_gas')?.kgCO2PerUnit || 2.75;
    const acFactor = EMISSION_FACTORS.find((f) => f.id === 'ac_usage')?.kgCO2PerUnit || 1.23;

    return kwhUsed * electFactor + gasUsed * gasFactor + acHours * acFactor;
  }, [kwhUsed, gasUsed, acHours]);

  const energyComparison = useMemo(() => getCO2Comparison(energyCO2), [energyCO2]);

  // --- What-If Scenario Builder State ---
  const [scenWeeklyCarKm, setScenWeeklyCarKm] = useState(150);
  const [scenMeatMeals, setScenMeatMeals] = useState(14); // out of 21 weekly meals
  const [scenSolarPercent, setScenSolarPercent] = useState(0); // solar energy share

  const scenarioData = useMemo(() => {
    // CURRENT
    const carFactor = EMISSION_FACTORS.find((f) => f.id === 'car_petrol')?.kgCO2PerUnit || 0.192;
    const metroFactor = EMISSION_FACTORS.find((f) => f.id === 'metro')?.kgCO2PerUnit || 0.033;
    const beefFactor = EMISSION_FACTORS.find((f) => f.id === 'beef_meal')?.kgCO2PerUnit || 6.61;
    const veganFactor = EMISSION_FACTORS.find((f) => f.id === 'vegan_meal')?.kgCO2PerUnit || 0.45;
    const gridElectFactor = EMISSION_FACTORS.find((f) => f.id === 'electricity')?.kgCO2PerUnit || 0.82;
    const solarElectFactor = EMISSION_FACTORS.find((f) => f.id === 'solar_energy')?.kgCO2PerUnit || 0.05;

    // Fixed baseline energy of 50 kWh weekly
    const currentWeeklyEnergy = 50 * gridElectFactor;
    const targetWeeklyEnergy = 50 * ((scenSolarPercent / 100) * solarElectFactor + ((100 - scenSolarPercent) / 100) * gridElectFactor);

    // Current Transport (car)
    const currentTransport = scenWeeklyCarKm * carFactor;
    // Assume switching 50% of travel to Metro/train/walking in the "Eco Swap"
    const targetTransport = (scenWeeklyCarKm * 0.5 * metroFactor) + (scenWeeklyCarKm * 0.5 * 0); // half metro, half bicycle/walk

    // Diet: Swap meat meals for vegan meals
    const currentFood = (scenMeatMeals * beefFactor) + ((21 - scenMeatMeals) * veganFactor);
    // In target scenario, we replace meat meals entirely with vegan meals
    const targetFood = 21 * veganFactor;

    const currentTotal = currentTransport + currentFood + currentWeeklyEnergy;
    const targetTotal = targetTransport + targetFood + targetWeeklyEnergy;

    return {
      current: Math.round(currentTotal),
      eco: Math.round(targetTotal),
      reduction: Math.round(currentTotal - targetTotal),
      percent: Math.round(((currentTotal - targetTotal) / currentTotal) * 100) || 0,
    };
  }, [scenWeeklyCarKm, scenMeatMeals, scenSolarPercent]);

  const scenarioChartData = [
    { name: 'Current Habits', CO2: scenarioData.current, color: '#ef4444' },
    { name: 'Eco Habits Swap', CO2: scenarioData.eco, color: '#10b981' },
  ];

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '4px' }}>
          Impact Calculators
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Estimate carbon numbers, configure interactive scenarios, and visualize your saving potential.
        </p>
      </div>

      {/* Main navigation tabs */}
      <div className="tab-nav" style={{ marginBottom: '24px' }}>
        <button className={activeTab === 'travel' ? 'active' : ''} onClick={() => setActiveTab('travel')}>
          🚗 Travel Route
        </button>
        <button className={activeTab === 'food' ? 'active' : ''} onClick={() => setActiveTab('food')}>
          🥗 Meal Builder
        </button>
        <button className={activeTab === 'energy' ? 'active' : ''} onClick={() => setActiveTab('energy')}>
          💡 Home Energy
        </button>
        <button className={activeTab === 'scenario' ? 'active' : ''} onClick={() => setActiveTab('scenario')}>
          🔄 What-If Builder
        </button>
      </div>

      {/* TRAVEL SECTION */}
      {activeTab === 'travel' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plane size={18} color="#3b82f6" /> Calculate Travel Impact
            </h2>

            {/* Distance Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                Trip Distance: <strong>{travelDistance} km</strong>
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                value={travelDistance}
                onChange={(e) => setTravelDistance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                <span>1 km</span>
                <span>100 km</span>
                <span>500 km</span>
                <span>1000 km</span>
              </div>
            </div>

            {/* Transport type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                Mode of Transportation
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {EMISSION_FACTORS.filter((f) => f.category === 'transport').map((trans) => (
                  <button
                    key={trans.id}
                    onClick={() => setSelectedTransport(trans.id)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: selectedTransport === trans.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.05)',
                      background: selectedTransport === trans.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      color: selectedTransport === trans.id ? '#60a5fa' : '#94a3b8',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{trans.icon}</span>
                    <span style={{ fontWeight: 600, textAlign: 'center' }}>{trans.name}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{trans.kgCO2PerUnit} kg/km</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Travel Output Card */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🛫</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Total Carbon Emissions</h3>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#60a5fa', lineHeight: '1.2', marginBottom: '6px' }}>
              {travelCO2.toFixed(1)} <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>kg CO₂e</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{travelComparison.icon}</span>
              That is {travelComparison.text}
            </p>
          </div>
        </div>
      )}

      {/* FOOD SECTION (Meal Builder) */}
      {activeTab === 'food' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} color="#f59e0b" /> Meal Builder Impact
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Click to add ingredients or meal components to calculate your plate&apos;s footprint.
            </p>

            {/* List of Addable Items */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {EMISSION_FACTORS.filter((f) => f.category === 'food').map((food) => (
                <button
                  key={food.id}
                  onClick={() => addMealItem(food.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
                >
                  <span>{food.icon}</span>
                  <span>{food.name}</span>
                </button>
              ))}
            </div>

            {/* Custom builder list */}
            <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>Your Plate Ingredients</h4>
            {mealItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                Your plate is empty. Select ingredients above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mealItems.map((item) => {
                  const factor = EMISSION_FACTORS.find((f) => f.id === item.id);
                  if (!factor) return null;

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{factor.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{factor.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {(factor.kgCO2PerUnit * item.servings).toFixed(2)} kg CO₂
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => updateMealServings(item.id, item.servings - 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: 'none',
                              background: 'rgba(255,255,255,0.08)',
                              color: '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.85rem', width: '20px', textAlign: 'center' }}>
                            {item.servings}
                          </span>
                          <button
                            onClick={() => updateMealServings(item.id, item.servings + 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: 'none',
                              background: 'rgba(255,255,255,0.08)',
                              color: '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeMealItem(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Food Output Card */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🥘</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Total Meal Carbon</h3>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#f59e0b', lineHeight: '1.2', marginBottom: '6px' }}>
              {foodCO2.toFixed(1)} <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>kg CO₂e</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{foodComparison.icon}</span>
              That is {foodComparison.text}
            </p>
          </div>
        </div>
      )}

      {/* HOME ENERGY SECTION */}
      {activeTab === 'energy' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={18} color="#ef4444" /> Home Energy Footprint
            </h2>

            {/* Slider 1: Electricity */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Monthly Electricity Use:</span>
                <span><strong>{kwhUsed} kWh</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={kwhUsed}
                onChange={(e) => setKwhUsed(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                <span>0 kWh (Solar/Off-Grid)</span>
                <span>250 kWh</span>
                <span>500 kWh</span>
              </div>
            </div>

            {/* Slider 2: AC Hours */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Weekly AC Usage:</span>
                <span><strong>{acHours} hours</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="168" // 24 * 7
                value={acHours}
                onChange={(e) => setAcHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                <span>0 hours</span>
                <span>84 hours (12h/day)</span>
                <span>168 hours (24/7)</span>
              </div>
            </div>

            {/* Slider 3: Cooking Gas */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Cooking LPG Gas:</span>
                <span><strong>{gasUsed} kg</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={gasUsed}
                onChange={(e) => setGasUsed(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                <span>0 kg</span>
                <span>15 kg</span>
                <span>30 kg</span>
              </div>
            </div>
          </div>

          {/* Energy Output Card */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🔌</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Total Energy Emissions</h3>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#fca5a5', lineHeight: '1.2', marginBottom: '6px' }}>
              {energyCO2.toFixed(1)} <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>kg CO₂e</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{energyComparison.icon}</span>
              That is {energyComparison.text}
            </p>
          </div>
        </div>
      )}

      {/* WHAT-IF SCENARIO BUILDER SECTION */}
      {activeTab === 'scenario' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} color="#10b981" /> "What-If" Scenario Builder
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>
              Simulate swaps in your lifestyle to see how much carbon you can eliminate in real time.
            </p>

            {/* Slider 1: Travel Swap */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f8fafc', marginBottom: '6px' }}>
                <span>Weekly Commute:</span>
                <span><strong>{scenWeeklyCarKm} km by car</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={scenWeeklyCarKm}
                onChange={(e) => setScenWeeklyCarKm(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                <span>0 km (WFH)</span>
                <span>250 km</span>
                <span>500 km</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Swap 50% of this with public transit and walking in Eco Swap.
              </p>
            </div>

            {/* Slider 2: Beef Meals Swap */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f8fafc', marginBottom: '6px' }}>
                <span>Meat Meals (out of 21 weekly):</span>
                <span><strong>{scenMeatMeals} meals</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="21"
                value={scenMeatMeals}
                onChange={(e) => setScenMeatMeals(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                <span>0 meals</span>
                <span>10 meals</span>
                <span>21 meals</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Swap meat meals for 100% plant-based food in Eco Swap.
              </p>
            </div>

            {/* Slider 3: Solar Panels Energy share */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f8fafc', marginBottom: '6px' }}>
                <span>Solar Panels Energy Share:</span>
                <span><strong>{scenSolarPercent}% solar</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scenSolarPercent}
                onChange={(e) => setScenSolarPercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                <span>0% Grid</span>
                <span>50% Solar</span>
                <span>100% Solar</span>
              </div>
            </div>
          </div>

          {/* Comparison Output Block with Recharts */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
              Weekly CO₂ Comparison (kg)
            </h3>

            <div style={{ height: '200px', marginBottom: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                      fontSize: '0.8rem',
                    }}
                  />
                  <Bar dataKey="CO2" barSize={24} radius={[0, 6, 6, 0]}>
                    {scenarioChartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Savings Insight */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>
                Save {scenarioData.reduction} kg CO₂ / week
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                That is a <strong>{scenarioData.percent}% reduction</strong> in carbon emissions!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
