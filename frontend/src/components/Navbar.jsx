import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

export default function Navbar({ currentTab, onNavigate }) {
  const { currentUser, logout, demoMode, setDemoMode, token } = useAuth();

  const handleLogoClick = () => {
    onNavigate('home');
  };

  const linkStyle = (tabName) => ({
    background: 'none',
    border: 'none',
    color: currentTab === tabName ? '#4f46e5' : 'var(--text-light)', // Highlight active page like in the image
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '0.4rem 0.8rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  });

  return (
    <header className="glass-panel" style={{ margin: '1rem 1rem 0 1rem', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--card-shadow)', border: 'none', background: '#fff' }}>
      
      {/* TaskHub Logo */}
      <div 
        onClick={handleLogoClick}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
      >
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #f97316 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.2)' }}>
          🚀
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center' }}>
          TASK<span style={{ color: '#f97316' }}>HUB</span>
        </h1>
      </div>

      {/* Center Links navigation */}
      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => onNavigate('home')} style={linkStyle('home')}>Home</button>
        <button onClick={() => onNavigate('plans')} style={linkStyle('plans')}>Plans</button>
        <button onClick={() => onNavigate('features')} style={linkStyle('features')}>Features</button>
        <button onClick={() => onNavigate('resources')} style={linkStyle('resources')}>Resources</button>
        <button onClick={() => onNavigate('contact')} style={linkStyle('contact')}>Contact us</button>
        <button onClick={() => onNavigate('legal')} style={linkStyle('legal')}>Legal</button>
        {token && (
          <button onClick={() => onNavigate('dashboard')} style={linkStyle('dashboard')}>Dashboard</button>
        )}
        {token && currentUser?.role === 'admin' && (
          <button onClick={() => onNavigate('admin')} style={linkStyle('admin')}>Admin Dashboard</button>
        )}
      </nav>

      {/* Far Right Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Toggle Mode indicator */}
        <button 
          onClick={() => setDemoMode(!demoMode)} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-color)', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', transition: 'all 0.2s' }}
          title="Toggle connections mode"
        >
          <span style={{ width: '6px', height: '6px', background: demoMode ? '#f59e0b' : '#10b981', borderRadius: '50%' }}></span>
          <span style={{ color: demoMode ? '#b45309' : '#047857' }}>
            {demoMode ? 'Mock Mode' : 'Live Mode'}
          </span>
        </button>

        {token && currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Roadmap Checkpoint button */}
            <button
              onClick={() => onNavigate('onboarding')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: currentTab === 'onboarding' ? 'var(--primary)' : 'var(--primary-light)',
                color: currentTab === 'onboarding' ? 'white' : 'var(--primary-dark)',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Roadmap
            </button>

            {/* Profile Avatar click leads to profile settings */}
            <div 
              onClick={() => onNavigate('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: currentTab === 'profile' ? 'var(--primary-light)' : '#f8fafc', padding: '0.3rem 0.75rem', borderRadius: '99px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
              title="Edit Profile"
            >
              <span style={{ fontSize: '1.1rem' }}>{currentUser.avatar_url || '🦊'}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--dark-slate)' }}>{currentUser.full_name.split(' ')[0]}</span>
            </div>

            <button 
              onClick={logout} 
              style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              title="Log out"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('register')}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '0.5rem',
              border: '1px solid #4f46e5',
              background: 'white',
              color: '#4f46e5',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.1)',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.025em'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#4f46e5';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#4f46e5';
            }}
          >
            Get Started
          </button>
        )}
      </div>

    </header>
  );
}
