import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User,
  Mail,
  Layout,
  Bell,
  UserPlus,
  Plug,
  CheckCircle,
  HelpCircle,
  Check
} from 'lucide-react';

const getStepIconComponent = (iconName) => {
  switch (iconName) {
    case 'hand-wave': return Sparkles;
    case 'user-circle': return User;
    case 'mail-check': return Mail;
    case 'layout': return Layout;
    case 'bell': return Bell;
    case 'users-plus': return UserPlus;
    case 'plug': return Plug;
    case 'check-circle': return CheckCircle;
    default: return HelpCircle;
  }
};

export default function Sidebar() {
  const { steps, activeStep, setActiveStep } = useAuth();

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', border: 'none', boxShadow: 'var(--card-shadow)', background: '#fff', borderRadius: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '500px' }}>
      <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-slate)' }}>Setup Roadmap</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {steps.map((step) => {
          const StepIcon = getStepIconComponent(step.icon);
          const isActive = activeStep?.id === step.id;
          const isCompleted = step.status === 'completed';
          const isSkipped = step.status === 'skipped';
          const isInProgress = step.status === 'in_progress';

          let statusBadgeText = 'Pending';
          let statusBadgeStyle = { background: '#f1f5f9', color: '#64748b' };

          if (isCompleted) {
            statusBadgeText = 'Done';
            statusBadgeStyle = { background: 'var(--success-light)', color: 'var(--success)' };
          } else if (isSkipped) {
            statusBadgeText = 'Skipped';
            statusBadgeStyle = { background: '#fef3c7', color: '#d97706' };
          } else if (isInProgress) {
            statusBadgeText = 'Active';
            statusBadgeStyle = { background: 'var(--primary-light)', color: 'var(--primary-dark)' };
          }

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '1rem',
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: isActive ? 'var(--primary-light)' : '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 5px 15px rgba(99, 102, 241, 0.1)' : 'none'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.75rem',
                  background: isCompleted ? 'var(--success-light)' : isActive ? 'var(--primary)' : '#f8fafc',
                  color: isCompleted ? 'var(--success)' : isActive ? '#fff' : 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <StepIcon size={16} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: isActive ? 'var(--primary-dark)' : 'var(--dark-slate)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {step.step_order}. {step.title}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: isActive ? 'var(--primary)' : 'var(--text-light)' }}>
                    {step.is_required ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
              
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.4rem',
                ...statusBadgeStyle,
                flexShrink: 0
              }}>
                {statusBadgeText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
