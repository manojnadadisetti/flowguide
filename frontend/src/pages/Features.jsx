import React from 'react';
import { Sparkles, Users, MessageSquare, Layers, Mail, Compass } from 'lucide-react';

const FEATURES = [
  {
    icon: Compass,
    title: 'Smart Roadmap Checklist',
    desc: 'An engaging, ordered checklist displaying required and optional milestones to guide users through initial setup stages step-by-step.',
    color: 'var(--primary)'
  },
  {
    icon: Layers,
    title: 'Multi-App Integrations',
    desc: 'Toggle integrations for Slack alerts, Jira issues creation, or Google Calendar syncing in just a single button click.',
    color: 'var(--secondary)'
  },
  {
    icon: Sparkles,
    title: 'Interactive Simulations',
    desc: 'Learn workspace tools interactively through live simulators like our mock email client and dashboard analytics tooltip guides.',
    color: 'var(--warning)'
  },
  {
    icon: MessageSquare,
    title: 'Conversational AI Assistant',
    desc: 'Ask Sparky (the chat widget) questions. Sparky gives keyword-mapped replies and recommended buttons that open active steps instantly.',
    color: 'var(--info)'
  },
  {
    icon: Users,
    title: 'Team Invitations & Audits',
    desc: 'Invite multiple teammates and monitor logs documenting who completed what setup step and when.',
    color: '#a855f7'
  },
  {
    icon: Mail,
    title: 'Automated Email Notifier',
    desc: 'Spring Boot integrated SMTP notifier sending welcome alerts, step completion stats, and onboarding completion certificates.',
    color: 'var(--success)'
  }
];

export default function Features({ onNavigate }) {
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 0' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--dark-slate)' }}>Built for Seamless Teams</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Discover how FlowGuide guides workspace workflows and boosts user engagement.</p>
      </div>

      {/* Grid of features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {FEATURES.map((feat, i) => {
          const IconComponent = feat.icon;
          return (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '1.25rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: 'var(--card-shadow)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = feat.color;
                e.currentTarget.style.boxShadow = `0 10px 25px rgba(0,0,0,0.05)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '0.75rem',
                background: feat.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 10px rgba(0,0,0,0.1)`
              }}>
                <IconComponent size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-slate)' }}>{feat.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: '1.6' }}>{feat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Hero CTA section */}
      <div className="glass-panel" style={{ padding: '3rem', border: 'none', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--info-light) 100%)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', borderRadius: '1.5rem', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)' }}>Ready to experience these features?</h3>
        <p style={{ color: 'var(--text-main)', maxWidth: '520px', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Get started with our standard interactive onboarding and see how easily you can customize your workspace environments.
        </p>
        <button
          onClick={() => onNavigate('register')}
          style={{
            padding: '0.8rem 2rem',
            borderRadius: '99px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)',
            marginTop: '0.5rem'
          }}
        >
          Sign Up Now
        </button>
      </div>

    </div>
  );
}
