import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register, error, setError, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await register(email, password, fullName, phoneNumber);
    if (success) {
      onNavigate('onboarding');
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', boxShadow: 'var(--card-shadow)', border: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fff' }}>
        
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '2.5rem', animation: 'float 3s ease-in-out infinite' }}>🚀</div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--dark-slate)' }}>Get Started!</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
            Create an account to begin your guided setup route.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="jane.doe@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.1s'
            }}
          >
            {loading ? 'Creating Account...' : 'Get Started 🚀'}
          </button>
        </form>

        <div style={{ textSelf: 'center', fontSize: '0.875rem', color: 'var(--text-light)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')}
            style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
