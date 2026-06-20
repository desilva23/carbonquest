'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  {
    title: "Welcome to CarbonQuest! 🌍",
    subtitle: "Let's personalize your carbon journey",
    field: 'name',
  },
  {
    title: "How do you usually commute? 🚗",
    subtitle: "Your primary mode of transport",
    field: 'transport',
    options: [
      { value: 'car', label: 'Car (Petrol/Diesel)', icon: '🚗', desc: 'Private car commute' },
      { value: 'electric_car', label: 'Electric Car', icon: '⚡', desc: 'EV or hybrid' },
      { value: 'public', label: 'Public Transport', icon: '🚌', desc: 'Bus, metro, train' },
      { value: 'bike', label: 'Bicycle / Walk', icon: '🚲', desc: 'Zero emissions!' },
      { value: 'rideshare', label: 'Ride Share', icon: '📱', desc: 'Uber, Ola, etc.' },
      { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️', desc: 'Two-wheeler' },
    ],
  },
  {
    title: "What's your diet like? 🍽️",
    subtitle: "Food makes up ~25% of carbon footprint",
    field: 'diet',
    options: [
      { value: 'heavy_meat', label: 'Heavy Meat Eater', icon: '🥩', desc: 'Meat most meals' },
      { value: 'moderate_meat', label: 'Moderate Meat', icon: '🍗', desc: 'Meat a few times/week' },
      { value: 'flexitarian', label: 'Flexitarian', icon: '🥗', desc: 'Mostly plant-based' },
      { value: 'vegetarian', label: 'Vegetarian', icon: '🥬', desc: 'No meat, some dairy' },
      { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'Fully plant-based' },
    ],
  },
  {
    title: "Your primary energy source? ⚡",
    subtitle: "How your home is powered",
    field: 'energySource',
    options: [
      { value: 'grid', label: 'Grid Electricity', icon: '🔌', desc: 'Standard power grid' },
      { value: 'solar', label: 'Solar Panels', icon: '☀️', desc: 'Rooftop solar' },
      { value: 'mixed', label: 'Mixed / Green Plan', icon: '🌿', desc: 'Partly renewable' },
      { value: 'gas', label: 'Gas / Generator', icon: '🔥', desc: 'Gas-heavy usage' },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { createUser } = useStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    transport: '',
    diet: '',
    energySource: '',
  });

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    const field = currentStep.field as keyof typeof formData;
    return formData[field].trim() !== '';
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please make a selection to continue');
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      createUser(formData.name, formData.transport, formData.diet, formData.energySource);
      toast.success('Welcome to CarbonQuest! 🌱');
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent 70%)',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Step {step + 1} of {STEPS.length}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: '6px' }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="glass-card animate-scale-in"
        key={step}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '40px 32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.6rem',
              marginBottom: '8px',
            }}
          >
            {currentStep.title}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{currentStep.subtitle}</p>
        </div>

        {/* Name Input */}
        {step === 0 && (
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              className="input"
              placeholder="Enter your name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              autoFocus
              style={{ fontSize: '1.1rem', padding: '16px', textAlign: 'center' }}
              id="onboarding-name"
            />
            <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: '12px' }}>
              This helps us personalize your experience
            </p>
          </div>
        )}

        {/* Option Selection */}
        {currentStep.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {currentStep.options.map((option) => {
              const field = currentStep.field as keyof typeof formData;
              const isSelected = formData[field] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, [field]: option.value })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: isSelected
                      ? '2px solid #10b981'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(15, 23, 42, 0.4)',
                    color: '#f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                  }}
                  id={`option-${option.value}`}
                >
                  <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{option.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{option.desc}</div>
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={14} color="white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {step > 0 && (
            <button onClick={handleBack} className="btn-ghost" style={{ flex: 1 }}>
              <ArrowLeft size={18} /> Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="btn-primary"
            style={{
              flex: step > 0 ? 2 : 1,
              width: step === 0 ? '100%' : undefined,
              opacity: canProceed() ? 1 : 0.5,
            }}
          >
            {step === STEPS.length - 1 ? (
              <>Start Your Quest <Sparkles size={18} /></>
            ) : (
              <>Continue <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
