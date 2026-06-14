import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';

const AVATAR_PRESETS = ['🦊', '🐼', '🐨', '🦄', '🤖', '🦁', '🦖', '🐙'];

export default function Profile({ onNavigate }) {
  const { currentUser, updateProfile, error, setError } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.full_name || '');
      setAvatar(currentUser.avatar_url || '🦊');
      setPhoneNumber(currentUser.phone_number || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const ok = await updateProfile(name, avatar, phoneNumber);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', maxWidth: '560px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => onNavigate('onboarding')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', alignItems: 'center', padding: '0.4rem' }}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-slate)' }}>Profile Settings</h2>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <CheckCircle size={16} />
          <span>Profile updated successfully! ✓</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Avatar Picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Change Avatar</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.5rem', marginTop: '0.25rem' }}>
            {AVATAR_PRESETS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                style={{
                  fontSize: '1.75rem',
                  padding: '0.4rem 0',
                  borderRadius: '0.75rem',
                  border: avatar === emoji ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: avatar === emoji ? 'var(--primary-light)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        {/* Phone Number input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        {/* Email display (Read only) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Email Address (Read-Only)</label>
          <input
            type="text"
            readOnly
            disabled
            value={currentUser?.email || 'user@example.com'}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', background: '#f8fafc', color: 'var(--text-light)', cursor: 'not-allowed' }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
          }}
        >
          Save profile modifications
        </button>

      </form>
    </div>
  );
}
