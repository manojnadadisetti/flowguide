import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request send
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '1rem 0' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--dark-slate)' }}>Get in Touch</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Have questions about plans or custom setups? Drop us a line.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'stretch' }}>
        
        {/* Left column: Contact form card */}
        <div className="glass-panel" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>Send a Message</h3>

          {success && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
              <CheckCircle size={16} />
              <span>Your message has been sent successfully! We will get back to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Subject</label>
              <input
                type="text"
                required
                placeholder="How can we help?"
                value={form.subject}
                onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                style={{ padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Message</label>
              <textarea
                required
                rows={4}
                placeholder="Write your message here..."
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                style={{ padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                alignSelf: 'flex-start',
                marginTop: '0.5rem',
                padding: '0.7rem 1.8rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {loading ? 'Sending...' : 'Send Message'} <Send size={14} />
            </button>

          </form>
        </div>

        {/* Right column: Corporate Address Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Email Support</h4>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--dark-slate)' }}>support@taskhub.com</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Call Us</h4>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--dark-slate)' }}>+1 (800) 555-TASK</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Office HQ</h4>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--dark-slate)', lineHeight: '1.4' }}>100 Innovation Way, Suite 400,<br />Tech City, CA 94016</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
