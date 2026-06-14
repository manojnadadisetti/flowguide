import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Users, Layers, Bell, ChevronLeft } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { currentUser, completedSteps, totalSteps, logout } = useAuth();

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dashboard Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '3.5rem' }}>🚀</span>
          <div>
            <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Welcome to your Workspace! <Sparkles size={24} style={{ color: 'var(--secondary)' }} />
            </h2>
            <p style={{ color: 'var(--text-light)', marginTop: '0.2rem' }}>
              Onboarding checklist fully completed: <strong>{completedSteps} / {totalSteps} items</strong>.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('onboarding')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: '99px',
            border: '1px solid var(--border-color)',
            background: 'none',
            color: 'var(--text-light)',
            fontWeight: '600',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <ChevronLeft size={16} /> Revisit Roadmap
        </button>
      </div>

      {/* Grid of Interactive Analytics/Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        
        {/* Card 1: Team members */}
        <div style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Users size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Teammates</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            Collaborate and share dashboard metrics with invited workspace members.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '-8px', marginTop: '0.5rem', overflow: 'hidden' }}>
            {['🦊', '🐼', '🐨', '🦄'].map((emoji, index) => (
              <div key={index} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem' }}>
                {emoji}
              </div>
            ))}
            <div style={{ paddingLeft: '1.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>+4 invited</div>
          </div>
        </div>

        {/* Card 2: Connected Apps */}
        <div style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
            <Layers size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Active Connectors</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            External integrations synced to listen to webhook events.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--success-light)', color: 'var(--success)', padding: '0.25rem 0.6rem', borderRadius: '99px' }}>💬 Slack connected</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: '#f1f5f9', color: 'var(--text-light)', padding: '0.25rem 0.6rem', borderRadius: '99px' }}>🎯 Jira</span>
          </div>
        </div>

        {/* Card 3: Notifications settings */}
        <div style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info)' }}>
            <Bell size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Alert Preferences</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            Configured notification alerts: <strong>Email Summaries</strong> and <strong>In-App Alerts</strong> enabled.
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', cursor: 'pointer', textDecoration: 'underline', marginTop: 'auto' }} onClick={() => onNavigate('profile')}>
            Edit settings
          </span>
        </div>

      </div>

      {/* Analytics Graph representation */}
      <div style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem' }}>Workspace Activity Analytics</h3>
        <div style={{ height: '180px', background: '#f8fafc', border: '1px dashed var(--border-color)', borderRadius: '0.75rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem 2rem' }}>
          {[35, 60, 45, 80, 50, 95, 75, 110, 85, 120].map((val, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '30px' }}>
              <div style={{ height: `${val}px`, width: '12px', background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)', borderRadius: '4px', animation: 'slide-up 0.5s ease-out' }}></div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>W{i+1}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
