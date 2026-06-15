import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home({ onNavigate }) {
  const { token } = useAuth();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4rem', padding: '2rem 0' }}>
      
      {/* HERO SECTION */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3rem', alignItems: 'center' }}>
        
        {/* Left side text contents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'slide-up 0.5s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.4rem 1rem', borderRadius: '99px', width: 'fit-content', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <Sparkles size={14} /> Smart Workspace Management
          </div>
          
          <h1 style={{ fontSize: '3.75rem', lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Student <br />
            <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Learning Path
            </span>
          </h1>

          <p style={{ color: 'var(--text-light)', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '480px' }}>
            FlowGuide is the best student learning platform to customize your study path and tracks very effectively. Its powerful features help boost your academic skills. This powerful tool also helps you manage study targets so you can increase your learning productivity.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => onNavigate(token ? 'onboarding' : 'register')}
              className="animate-pulse-soft"
              style={{
                padding: '0.9rem 2.2rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              Get Started <ArrowRight size={18} />
            </button>
            
            <button
              onClick={() => onNavigate('plans')}
              style={{
                padding: '0.9rem 2.2rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                background: 'white',
                color: 'var(--dark-slate)',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              Browse Plans
            </button>
          </div>
        </div>

        {/* Right side custom vector workspace illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: '400px' }}>
          
          {/* Background circle blobs */}
          <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '50%', filter: 'blur(30px)', zIndex: 0, top: '40px' }} />
          <div style={{ position: 'absolute', width: '220px', height: '220px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '50%', filter: 'blur(20px)', zIndex: 0, top: '100px', right: '40px' }} />

          {/* Coded Illustration container */}
          <div style={{ zIndex: 1, width: '100%', maxWidth: '420px', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Table desk desk */}
            <div style={{ position: 'absolute', bottom: '80px', width: '360px', height: '8px', background: '#cbd5e1', borderRadius: '4px' }} />

            {/* Desktop Monitor screen */}
            <div style={{ position: 'absolute', bottom: '150px', left: '130px', width: '100px', height: '70px', background: 'var(--primary-light)', border: '4px solid var(--dark-slate)', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', padding: '6px', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%' }}></span>
                <span style={{ width: '4px', height: '4px', background: '#eab308', borderRadius: '50%' }}></span>
                <span style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%' }}></span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ height: '6px', background: 'var(--primary)', borderRadius: '2px', width: '70%' }}></div>
                <div style={{ height: '4px', background: 'var(--text-light)', borderRadius: '2px', width: '50%' }}></div>
                <div style={{ height: '12px', background: '#fff', borderRadius: '2px', marginTop: 'auto', display: 'flex', gap: '2px', padding: '1px' }}>
                  <div style={{ width: '30%', height: '100%', background: 'var(--secondary)', borderRadius: '1px' }}></div>
                  <div style={{ width: '70%', height: '100%', background: 'var(--success)', borderRadius: '1px' }}></div>
                </div>
              </div>
            </div>
            {/* Monitor stand */}
            <div style={{ position: 'absolute', bottom: '100px', left: '170px', width: '20px', height: '50px', background: 'var(--dark-slate)' }} />
            <div style={{ position: 'absolute', bottom: '88px', left: '155px', width: '50px', height: '12px', background: 'var(--dark-slate)', borderRadius: '6px' }} />

            {/* Teammate 1 (Left - Orange Shirt) */}
            <div style={{ position: 'absolute', bottom: '88px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Head */}
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fed7aa', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '12px', background: '#b45309' }}></div>
              </div>
              {/* Body */}
              <div style={{ width: '40px', height: '70px', background: '#f97316', borderRadius: '15px 15px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
                <div style={{ width: '12px', height: '12px', background: '#e0f2fe', borderRadius: '50%' }}></div>
              </div>
              {/* Legs */}
              <div style={{ width: '36px', height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '14px', height: '100%', background: '#1e3a8a', borderRadius: '0 0 4px 4px' }}></div>
                <div style={{ width: '14px', height: '100%', background: '#1e3a8a', borderRadius: '0 0 4px 4px' }}></div>
              </div>
            </div>

            {/* Teammate 2 (Middle - Blue Shirt) */}
            <div style={{ position: 'absolute', bottom: '88px', left: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Head */}
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fbcfe8', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '10px', background: '#db2777' }}></div>
              </div>
              {/* Body */}
              <div style={{ width: '38px', height: '65px', background: '#3b82f6', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
                <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }}></div>
              </div>
              {/* Legs */}
              <div style={{ width: '32px', height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '13px', height: '100%', background: '#0f172a', borderRadius: '0 0 4px 4px' }}></div>
                <div style={{ width: '13px', height: '100%', background: '#0f172a', borderRadius: '0 0 4px 4px' }}></div>
              </div>
            </div>

            {/* Floating Gear elements */}
            <div className="animate-spin-slow" style={{ position: 'absolute', top: '100px', left: '80px', width: '36px', height: '36px', border: '6px dashed var(--primary)', borderRadius: '50%' }} />
            <div className="animate-spin-slow" style={{ position: 'absolute', top: '70px', left: '120px', width: '24px', height: '24px', border: '4px dashed var(--secondary)', borderRadius: '50%', animationDirection: 'reverse' }} />

            {/* Floating idea lightbulb */}
            <div className="animate-float" style={{ position: 'absolute', top: '50px', right: '80px', fontSize: '2.5rem' }}>💡</div>

          </div>
        </div>

      </section>

      {/* ADDITIONAL CONTENT / SPOTS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>⚡ Speed Integration</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Set up channels in Slack, connect issues in Jira, or coordinate events in Google Calendar in a single click.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>🤖 AI Guidance</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Our conversational companion engine navigates you through milestones, resolves blockages, and answers queries instantly.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>🎯 Milestone Rewards</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Earn checklist points, simulate features setups, test knowledge through interactive quizzes, and unlock full access.
          </p>
        </div>
      </section>

    </div>
  );
}
