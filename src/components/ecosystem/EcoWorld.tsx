'use client';

import { useMemo } from 'react';
import { Leaf, Sun, Cloud, TreePine, CloudRain, Flame } from 'lucide-react';

interface EcoWorldProps {
  score: number; // 0 to 100
}

export default function EcoWorld({ score }: EcoWorldProps) {
  // Determine state of the ecosystem
  const state = useMemo(() => {
    if (score >= 70) {
      return {
        skyColor: 'linear-gradient(to bottom, #0ea5e9, #38bdf8, #e0f2fe)',
        groundColor: 'linear-gradient(to bottom, #4ade80, #22c55e, #15803d)',
        status: 'Healthy & Vibrant',
        description: 'Your low carbon footprint is keeping the air pure and nature thriving!',
        trees: 5,
        leaves: true,
        smog: false,
        birds: true,
        textColor: '#15803d',
        borderColor: 'rgba(34, 197, 94, 0.3)',
      };
    } else if (score >= 40) {
      return {
        skyColor: 'linear-gradient(to bottom, #0284c7, #bae6fd, #fed7aa)',
        groundColor: 'linear-gradient(to bottom, #a3e635, #84cc16, #4d7c0f)',
        status: 'Recovering Ecosystem',
        description: 'Moderate impact. A few green changes can clear up the remaining haze.',
        trees: 3,
        leaves: true,
        smog: false,
        birds: false,
        textColor: '#b45309',
        borderColor: 'rgba(245, 158, 11, 0.3)',
      };
    } else {
      return {
        skyColor: 'linear-gradient(to bottom, #475569, #64748b, #cbd5e1)',
        groundColor: 'linear-gradient(to bottom, #ca8a04, #a16207, #713f12)',
        status: 'Industrial Heavy / Endangered',
        description: 'High carbon output. The sky is hazy and the landscape is becoming barren.',
        trees: 1,
        leaves: false,
        smog: true,
        birds: false,
        textColor: '#ef4444',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      };
    }
  }, [score]);

  // Generate trees array
  const treePositions = useMemo(() => {
    // Return relative X positions and scales
    if (state.trees === 5) {
      return [
        { left: '15%', scale: 1.1, delay: '0s' },
        { left: '30%', scale: 0.9, delay: '0.2s' },
        { left: '50%', scale: 1.2, delay: '0.4s' },
        { left: '70%', scale: 0.8, delay: '0.1s' },
        { left: '82%', scale: 1.0, delay: '0.3s' },
      ];
    } else if (state.trees === 3) {
      return [
        { left: '20%', scale: 1.0, delay: '0s' },
        { left: '50%', scale: 0.85, delay: '0.3s' },
        { left: '80%', scale: 1.05, delay: '0.1s' },
      ];
    } else {
      return [
        { left: '50%', scale: 0.9, delay: '0s' }, // Just one lonely barren tree
      ];
    }
  }, [state.trees]);

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        overflow: 'hidden',
        border: `1px solid ${state.borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        height: '350px',
      }}
    >
      {/* Title / Status Bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(2, 6, 23, 0.4)',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Your Personal Eco-World
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: state.textColor,
            background: 'rgba(255,255,255,0.03)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {state.status}
        </span>
      </div>

      {/* Visual Workspace Canvas */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          background: state.skyColor,
          overflow: 'hidden',
          transition: 'background 1s ease',
        }}
      >
        {/* Animated Sun / Haziness */}
        {score >= 40 ? (
          <div
            style={{
              position: 'absolute',
              top: '30px',
              right: '40px',
              animation: 'spin-slow 20s linear infinite',
              opacity: score >= 70 ? 1 : 0.6,
              transition: 'opacity 1s ease',
            }}
          >
            <Sun size={48} color="#f59e0b" fill="#fbbf24" />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '50px',
              opacity: 0.8,
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', color: '#475569' }}>
              <Cloud size={32} fill="#475569" />
              <Cloud size={24} fill="#475569" style={{ marginTop: '10px' }} />
            </div>
          </div>
        )}

        {/* Smog Layer (for low score) */}
        {state.smog && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(71, 85, 105, 0.4)',
              backdropFilter: 'blur(1px)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        {/* Flying Birds (Healthy sky) */}
        {state.birds && (
          <div className="particles">
            <span
              style={{
                position: 'absolute',
                top: '60px',
                left: '25%',
                fontSize: '1rem',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              🕊️
            </span>
            <span
              style={{
                position: 'absolute',
                top: '90px',
                left: '60%',
                fontSize: '0.85rem',
                animation: 'float 5s ease-in-out infinite',
                animationDelay: '1s',
              }}
            >
              🕊️
            </span>
          </div>
        )}

        {/* Clouds */}
        {score >= 70 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '10%',
                color: 'rgba(255,255,255,0.7)',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              <Cloud size={36} fill="#ffffff" stroke="none" />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '70px',
                left: '45%',
                color: 'rgba(255,255,255,0.5)',
                animation: 'float 5s ease-in-out infinite',
                animationDelay: '2s',
              }}
            >
              <Cloud size={28} fill="#ffffff" stroke="none" />
            </div>
          </>
        )}

        {/* Ground */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: state.groundColor,
            borderRadius: '40% 40% 0 0 / 25% 25% 0 0',
            transition: 'background 1s ease',
            zIndex: 5,
          }}
        />

        {/* Trees Placement */}
        <div
          style={{
            position: 'absolute',
            bottom: '22%',
            left: 0,
            right: 0,
            height: '80px',
            zIndex: 6,
            display: 'flex',
          }}
        >
          {treePositions.map((pos, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: pos.left,
                transform: `scale(${pos.scale})`,
                animation: 'fadeIn 0.5s ease-out forwards, float 4s ease-in-out infinite',
                animationDelay: pos.delay,
                transformOrigin: 'bottom center',
              }}
            >
              {state.leaves ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      background: '#15803d',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      boxShadow: '0 4px 10px rgba(21,128,61,0.3)',
                    }}
                  />
                  <div
                    style={{
                      background: '#78350f',
                      width: '4px',
                      height: '14px',
                    }}
                  />
                </div>
              ) : (
                // Barren tree structure
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                  <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>🪵</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description / Caption */}
      <div
        style={{
          padding: '16px',
          background: 'rgba(15, 23, 42, 0.95)',
          fontSize: '0.85rem',
          color: '#94a3b8',
          lineHeight: '1.4',
        }}
      >
        {state.description}
      </div>
    </div>
  );
}
