'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Target,
  Trophy,
  Users,
  Bot,
  Calculator,
  BarChart3,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/log', label: 'Log', icon: PlusCircle },
  { href: '/missions', label: 'Missions', icon: Target },
  { href: '/achievements', label: 'Badges', icon: Trophy },
  { href: '/leaderboard', label: 'Ranks', icon: Users },
  { href: '/coach', label: 'AI Coach', icon: Bot },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '6px 4px',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '6px 8px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive ? '#10b981' : '#94a3b8',
                  background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  transition: 'all 200ms ease',
                  minWidth: '56px',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 400 }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '240px',
          flexDirection: 'column',
          padding: '24px 16px',
          background: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          zIndex: 50,
          overflowY: 'auto',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            marginBottom: '32px',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>🌍</span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CarbonQuest
          </span>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive ? '#10b981' : '#94a3b8',
                  background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'all 200ms ease',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
            Every action counts 🌱
          </p>
          <Link href="/log" className="btn-primary" style={{ width: '100%', padding: '8px 16px', fontSize: '0.85rem' }}>
            <PlusCircle size={16} />
            Log Activity
          </Link>
        </div>
      </aside>
    </>
  );
}
