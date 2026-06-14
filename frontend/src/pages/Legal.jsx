import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', maxWidth: '720px', margin: '0 auto' }}>
      
      {/* Header Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('terms')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'terms' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'terms' ? 'var(--primary-dark)' : 'var(--text-light)',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            paddingBottom: '0.25rem',
            transition: 'all 0.2s'
          }}
        >
          Terms & Conditions
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'privacy' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'privacy' ? 'var(--primary-dark)' : 'var(--text-light)',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            paddingBottom: '0.25rem',
            transition: 'all 0.2s'
          }}
        >
          Privacy Policy
        </button>
      </div>

      {activeTab === 'terms' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>Terms of Service Agreement</h3>
          <p style={{ color: 'var(--text-light)' }}>Last updated: June 14, 2026</p>
          
          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>1. Acceptance of Terms</h4>
          <p>
            By accessing or using the TaskHub / FlowGuide services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you are prohibited from using the application.
          </p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>2. Account Responsibilities</h4>
          <p>
            You are responsible for maintaining the confidentiality of your credentials (including login JWT tokens and system configurations) and for all operations that occur under your account.
          </p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>3. Permitted Usage</h4>
          <p>
            This service is provided for guided workspace setup, team coordination, and integrations linking. You must not use this tool for unauthorized network scanning or arbitrary database injection attempts.
          </p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>4. Limitation of Liability</h4>
          <p>
            TaskHub provides services 'as is'. We are not liable for database connection failures, notification delays, or any lost data caused by third-party webhook connection issues.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>Privacy Policy Statement</h3>
          <p style={{ color: 'var(--text-light)' }}>Last updated: June 14, 2026</p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>1. Information We Collect</h4>
          <p>
            We collect profile information (such as full name and custom emoji avatar preference) and email details to trigger welcomes and updates. We also maintain checklist progress details inside localized PostgreSQL tables.
          </p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>2. How We Use Information</h4>
          <p>
            Collected details are used solely to customize the user onboarding checklists, verify account ownership, and log security audits (audit_logs table). We never sell your personal information.
          </p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>3. Cookies and Browser Storage</h4>
          <p>
            We utilize local browser storage (localStorage) to persist login tokens and maintain database progress state fallbacks when in local mock Demo Mode.
          </p>

          <h4 style={{ color: 'var(--dark-slate)', fontWeight: '700', marginTop: '0.5rem' }}>4. Data Security</h4>
          <p>
            Passwords are encrypted using standard industry hashes (bcrypt) prior to database insertion. Real-time server sockets are encrypted using secure web configurations.
          </p>
        </div>
      )}

    </div>
  );
}
