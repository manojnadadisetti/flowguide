import React, { useState } from 'react';
import { Check, Star, ShieldAlert } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Free Starter',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for testing local workspaces and simulating guided walkthroughs.',
    features: [
      'Basic onboarding roadmap',
      'Local Storage Demo Mode',
      '1 Team Invitation',
      'Local AI chatbot buddy support',
      'Standard community forums'
    ],
    buttonText: 'Get Started Free',
    isPopular: false,
    color: 'var(--text-light)'
  },
  {
    id: 'pro',
    name: 'Growth Pro',
    price: '$29',
    period: 'per month',
    desc: 'For growing teams connecting live backends and automations.',
    features: [
      'Everything in Starter',
      'Live Backend Mode',
      'PostgreSQL database sync',
      'Spring Boot Mail notifications',
      '10 Team Invitations tag lists',
      'FastAPI AI guidance integration'
    ],
    buttonText: 'Start Pro Trial',
    isPopular: true,
    color: 'var(--primary)'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Suite',
    price: '$99',
    period: 'per month',
    desc: 'For large organizations requiring full logging and dedicated custom APIs.',
    features: [
      'Everything in Pro',
      'Unlimited Team members',
      'Developer Audit logs dashboard',
      'Custom webhook integration slots',
      'Dedicated AI Guidance engine support',
      '99.9% Service uptime SLA'
    ],
    buttonText: 'Contact Enterprise',
    isPopular: false,
    color: 'var(--secondary)'
  }
];

export default function Plans({ onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSelectPlan = (planName) => {
    setSelectedPlan(planName);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 0' }}>
      
      {/* Toast popup */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--dark-slate)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '0.75rem', zIndex: 99999, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--popover-shadow)', fontSize: '0.9rem', fontWeight: 'bold' }}>
          <Star size={16} style={{ color: 'var(--warning)' }} />
          Plan selected: {selectedPlan}! Plan set in active context.
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--dark-slate)' }}>Simple, Transparent Pricing</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Choose the tier that matches your team scale and integration needs.</p>
      </div>

      {/* Grid of pricing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'stretch' }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: '#fff',
              border: plan.isPopular ? `2.5px solid var(--primary)` : '1px solid var(--border-color)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'relative',
              boxShadow: plan.isPopular ? '0 15px 35px rgba(99, 102, 241, 0.15)' : 'var(--card-shadow)',
              transform: plan.isPopular ? 'scale(1.02)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {/* Popular Badge */}
            {plan.isPopular && (
              <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.3rem 1rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={12} fill="#fff" /> Popular Choice
              </span>
            )}

            <div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-slate)', marginBottom: '0.5rem' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4' }}>{plan.desc}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.75rem', fontWeight: '800', color: 'var(--dark-slate)' }}>{plan.price}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>/ {plan.period}</span>
            </div>

            {/* Feature lists */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {plan.features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'var(--text-main)' }}>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan(plan.name)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '0.75rem',
                border: plan.isPopular ? 'none' : '1px solid var(--border-color)',
                background: plan.isPopular ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'white',
                color: plan.isPopular ? 'white' : 'var(--dark-slate)',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: plan.isPopular ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.2s',
                marginTop: '1rem'
              }}
              onMouseEnter={e => {
                if (!plan.isPopular) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }
              }}
              onMouseLeave={e => {
                if (!plan.isPopular) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--dark-slate)';
                }
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
