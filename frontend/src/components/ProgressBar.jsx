import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProgressBar() {
  const { percentComplete, completedSteps, totalSteps } = useAuth();

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', border: 'none', boxShadow: 'var(--card-shadow)', background: '#fff', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Progress</h3>
        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>{percentComplete}%</span>
      </div>
      
      {/* Animated progress bar fill */}
      <div style={{ background: 'var(--border-color)', height: '12px', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', width: `${percentComplete}%`, height: '100%', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)' }}>
        <span>{completedSteps} of {totalSteps} steps completed</span>
        {percentComplete === 100 && <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>🎉 Perfect! Onboarding Complete</span>}
      </div>
    </div>
  );
}
