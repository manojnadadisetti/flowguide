import React from 'react';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import StepCard from '../components/StepCard';

export default function Onboarding({ onTriggerConfetti, onNavigate }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '2rem', minHeight: 0 }}>
      {/* Left Column: Progress status + roadmap checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <ProgressBar />
        <Sidebar />
      </div>

      {/* Right Column: Interaction view card */}
      <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: 'none', boxShadow: 'var(--card-shadow)', background: '#fff', borderRadius: '1.25rem' }}>
        <StepCard onTriggerConfetti={onTriggerConfetti} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
