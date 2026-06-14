import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Clock, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { auditLogs, setDemoMode, demoMode } = useAuth();

  const handleClearLogs = () => {
    if (demoMode) {
      localStorage.setItem('demo_audit_logs', '[]');
      window.location.reload();
    } else {
      alert('Logs clearing is disabled in Live Mode.');
    }
  };

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => onNavigate('onboarding')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', alignItems: 'center', padding: '0.4rem' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-slate)' }}>Audit Logs Dashboard</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Monitor system-wide onboarding interactions and state modifications.</p>
          </div>
        </div>

        {auditLogs.length > 0 && (
          <button
            onClick={handleClearLogs}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--danger)',
              background: 'none',
              color: 'var(--danger)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Trash2 size={14} /> Clear Local Logs
          </button>
        )}
      </div>

      {/* Logs Table */}
      {auditLogs.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '1rem', color: 'var(--text-light)' }}>
          <Activity size={32} className="animate-float" />
          <p>No audit events recorded yet. Complete onboarding steps to populate logs.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {auditLogs.map((log) => (
            <div 
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1.25rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                background: '#f8fafc',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.3rem',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  background: log.action.includes('COMPLETE') ? 'var(--success-light)' : log.action.includes('IN_PROGRESS') ? 'var(--primary-light)' : '#e2e8f0',
                  color: log.action.includes('COMPLETE') ? 'var(--success)' : log.action.includes('IN_PROGRESS') ? 'var(--primary-dark)' : 'var(--text-main)'
                }}>
                  {log.action}
                </span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                  Target: {log.entity_type} {log.entity_id ? `(#${log.entity_id.substr(0,8)})` : ''}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)', fontSize: '0.75rem' }}>
                <Clock size={12} />
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
