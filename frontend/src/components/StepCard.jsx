import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Info,
  ArrowRight,
  ChevronRight,
  MailOpen,
  X,
  Check,
  Mail,
  Bell,
  Plug,
  HelpCircle
} from 'lucide-react';

const AVATAR_PRESETS = ['🦊', '🐼', '🐨', '🦄', '🤖', '🦁', '🦖', '🐙'];

export default function StepCard({ onTriggerConfetti, onNavigate }) {
  const {
    currentUser,
    steps,
    totalSteps,
    activeStep,
    setActiveStep,
    updateStepProgress,
    updateProfile,
    auditLogs
  } = useAuth();

  // Custom step interaction state
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('🦊');
  const [simulatedInbox, setSimulatedInbox] = useState(false);
  const [tourClicks, setTourClicks] = useState({ sidebar: false, analytics: false, settings: false });
  const [notificationConfig, setNotificationConfig] = useState({ email: true, app: true, slack: false });
  const [teamEmails, setTeamEmails] = useState([]);
  const [currentTeamEmail, setCurrentTeamEmail] = useState('');
  const [connectedApps, setConnectedApps] = useState({ slack: false, jira: false, google: false });
  const [connectingApp, setConnectingApp] = useState(null);

  // Sync profile edits with currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.full_name || '');
      setProfileAvatar(currentUser.avatar_url || '🦊');
    }
  }, [currentUser]);

  if (!activeStep) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--text-light)', padding: '2rem' }}>
        <HelpCircle size={48} className="animate-float" />
        <p>Select a step on the roadmap to get started.</p>
      </div>
    );
  }

  const completeActiveStep = async (status = 'completed', notes = '') => {
    const ok = await updateStepProgress(activeStep.id, status, notes);
    if (ok) {
      if (status === 'completed') {
        onTriggerConfetti();
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const ok = await updateProfile(profileName, profileAvatar);
    if (ok) {
      await completeActiveStep('completed', 'Profile configuration finished.');
    }
  };

  const handleSimulateEmailVerification = async () => {
    await completeActiveStep('completed', 'Email verification confirmed.');
    setSimulatedInbox(false);
  };

  const handleTourClick = (area) => {
    setTourClicks(prev => ({ ...prev, [area]: true }));
  };

  const handleAddTeamEmail = (e) => {
    e.preventDefault();
    if (currentTeamEmail && !teamEmails.includes(currentTeamEmail)) {
      setTeamEmails(prev => [...prev, currentTeamEmail]);
      setCurrentTeamEmail('');
    }
  };

  const handleConnectApp = (appName) => {
    setConnectingApp(appName);
    setTimeout(() => {
      setConnectedApps(prev => ({ ...prev, [appName]: true }));
      setConnectingApp(null);
    }, 1200);
  };

  return (
    <>
      {/* Step Info Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: '0.4rem' }}>
              Step {activeStep.step_order} of {totalSteps}
            </span>
            {activeStep.is_required ? (
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--secondary)', background: 'var(--secondary-light)', padding: '0.2rem 0.6rem', borderRadius: '0.4rem' }}>Required</span>
            ) : (
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '0.4rem' }}>Optional</span>
            )}
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--dark-slate)', marginTop: '0.4rem' }}>{activeStep.title}</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{activeStep.description}</p>
        </div>
        
        {activeStep.help_text && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--info-light)', color: 'var(--info)', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: '600' }}>
            <Info size={14} />
            <span>{activeStep.help_text}</span>
          </div>
        )}
      </div>

      {/* Step Content Area */}
      <div style={{ flex: 1, minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '1.5rem 0' }}>
        
        {/* ---- STEP 1: WELCOME ---- */}
        {activeStep.step_order === 1 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ fontSize: '4rem', animation: 'float 3.5s ease-in-out infinite' }}>👋</div>
            <h3 style={{ fontSize: '1.35rem' }}>Let's kickstart your FlowGuide experience!</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              FlowGuide helps you set up workspace environments, invite team collaboration, connect communication tools, and get fully automated notification reminders. Let's take a quick run through to get you fully set up!
            </p>
            <button
              onClick={() => completeActiveStep('completed', 'Finished welcome tour.')}
              className="animate-pulse-soft"
              style={{
                alignSelf: 'center',
                padding: '0.8rem 2rem',
                borderRadius: '99px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              Let's Get Started <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ---- STEP 2: PROFILE ---- */}
        {activeStep.step_order === 2 && (
          <form onSubmit={handleProfileSubmit} style={{ maxWidth: '460px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Select Avatar Buddy</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.5rem', marginTop: '0.25rem' }}>
                {AVATAR_PRESETS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setProfileAvatar(emoji)}
                    style={{
                      fontSize: '1.75rem',
                      padding: '0.5rem 0',
                      borderRadius: '0.75rem',
                      border: profileAvatar === emoji ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: profileAvatar === emoji ? 'var(--primary-light)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder="Your name"
                style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.8rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              Save Profile Details ✨
            </button>
          </form>
        )}

        {/* ---- STEP 3: EMAIL VERIFICATION ---- */}
        {activeStep.step_order === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              A verification email was sent to <strong>{currentUser?.email || 'your@email.com'}</strong>. Open the email to verify.
            </p>
            
            {!simulatedInbox ? (
              <button
                onClick={() => setSimulatedInbox(true)}
                style={{
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px dashed var(--primary)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <MailOpen size={16} />
                Open Simulated Inbox Simulator
              </button>
            ) : (
              <div className="glass-panel" style={{ border: '1px solid #cbd5e1', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ background: '#f1f5f9', padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Simulated Inbox (1 Unread)</span>
                  <button onClick={() => setSimulatedInbox(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><X size={14} /></button>
                </div>

                <div style={{ padding: '1.5rem', background: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', fontSize: '0.8rem' }}>
                    <div><strong>From:</strong> system@flowguide.com</div>
                    <div><strong>To:</strong> {currentUser?.email || 'user@example.com'}</div>
                    <div style={{ marginTop: '0.25rem' }}><strong>Subject:</strong> Verify your FlowGuide account</div>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Hi {currentUser?.full_name || 'there'}, <br />
                      Thanks for signing up for FlowGuide! Please click the button below to confirm your email and activate your account.
                    </p>
                    <button
                      onClick={handleSimulateEmailVerification}
                      style={{
                        display: 'block',
                        margin: '1.25rem auto 0.5rem auto',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: '#16a34a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)'
                      }}
                    >
                      Verify Email Address ✓
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- STEP 4: TOUR ---- */}
        {activeStep.step_order === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Click each highlighted section in the mock interface below to learn what it does.
            </p>

            <div style={{ border: '2px solid var(--primary-light)', borderRadius: '1rem', display: 'grid', gridTemplateColumns: '140px 1fr', overflow: 'hidden', height: '220px', background: '#fff' }}>
              <div 
                onClick={() => handleTourClick('sidebar')}
                style={{
                  background: '#f8fafc',
                  borderRight: '1px solid var(--border-color)',
                  padding: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {!tourClicks.sidebar && <div style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse-soft 1s infinite' }}></div>}
                <div style={{ height: '12px', width: '80%', background: '#e2e8f0', borderRadius: '4px' }}></div>
                <div style={{ height: '8px', width: '60%', background: tourClicks.sidebar ? 'var(--primary-light)' : '#e2e8f0', borderRadius: '4px' }}></div>
                <div style={{ height: '8px', width: '70%', background: '#e2e8f0', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: 'auto', textAlign: 'center', background: tourClicks.sidebar ? '#d1fae5' : '#f1f5f9', padding: '0.2rem', borderRadius: '4px' }}>
                  {tourClicks.sidebar ? '✓ Navigation' : '⚡ Sidebar'}
                </span>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '40%', height: '12px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                  <div 
                    onClick={() => handleTourClick('settings')}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: tourClicks.settings ? '#d1fae5' : 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      fontSize: '0.7rem'
                    }}
                  >
                    ⚙️
                    {!tourClicks.settings && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse-soft 1s infinite' }}></span>}
                  </div>
                </div>

                <div 
                  onClick={() => handleTourClick('analytics')}
                  style={{
                    flex: 1,
                    border: '1px dashed #cbd5e1',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {!tourClicks.analytics && <div style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse-soft 1s infinite' }}></div>}
                  
                  {tourClicks.analytics ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '40px' }}>
                      <div style={{ height: '20px', width: '8px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                      <div style={{ height: '35px', width: '8px', background: 'var(--secondary)', borderRadius: '2px' }}></div>
                      <div style={{ height: '15px', width: '8px', background: 'var(--info)', borderRadius: '2px' }}></div>
                      <div style={{ height: '28px', width: '8px', background: 'var(--success)', borderRadius: '2px' }}></div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 'bold' }}>📈 Click for Chart</span>
                  )}
                </div>
              </div>
            </div>

            {tourClicks.sidebar && tourClicks.analytics && tourClicks.settings ? (
              <button
                onClick={() => completeActiveStep('completed', 'Finished dashboard tour.')}
                style={{
                  alignSelf: 'center',
                  padding: '0.6rem 1.8rem',
                  borderRadius: '99px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                Finish Dashboard Tour <Check size={16} />
              </button>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                Explore all 3 sections to unlock next step!
              </div>
            )}
          </div>
        )}

        {/* ---- STEP 5: NOTIFICATIONS ---- */}
        {activeStep.step_order === 5 && (
          <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Configure your preferred channels to receive real-time notifications about workspace events.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Email Summaries</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Receive daily workspace updates.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationConfig.email}
                  onChange={e => setNotificationConfig(prev => ({ ...prev, email: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Bell size={18} style={{ color: 'var(--secondary)' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>In-App Alerts</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Instant bells for updates.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationConfig.app}
                  onChange={e => setNotificationConfig(prev => ({ ...prev, app: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Plug size={18} style={{ color: 'var(--info)' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Slack Reminders</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Get Slack DM alerts.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationConfig.slack}
                  onChange={e => setNotificationConfig(prev => ({ ...prev, slack: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>

            <button
              onClick={() => completeActiveStep('completed', 'Customized notifications configuration.')}
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              Save Preferences ✓
            </button>
          </div>
        )}

        {/* ---- STEP 6: INVITE TEAM ---- */}
        {activeStep.step_order === 6 && (
          <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Add colleagues to join you in FlowGuide. They will receive an email invite link.
            </p>

            <form onSubmit={handleAddTeamEmail} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                value={currentTeamEmail}
                onChange={e => setCurrentTeamEmail(e.target.value)}
                placeholder="colleague@company.com"
                style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }}
              />
              <button
                type="submit"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Add
              </button>
            </form>

            {teamEmails.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '0.5rem', background: '#f8fafc' }}>
                {teamEmails.map(email => (
                  <span key={email} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '99px', fontWeight: '600' }}>
                    {email}
                    <button 
                      onClick={() => setTeamEmails(prev => prev.filter(e => e !== email))} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => completeActiveStep('skipped', 'Skipped team invitation.')}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: '#fff', color: 'var(--text-light)', fontWeight: '700', cursor: 'pointer' }}
              >
                Skip for Now
              </button>
              <button
                onClick={() => completeActiveStep('completed', `Invited ${teamEmails.length} teammates.`)}
                disabled={teamEmails.length === 0}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: teamEmails.length > 0 ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : '#cbd5e1',
                  color: 'white',
                  fontWeight: '700',
                  cursor: teamEmails.length > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: teamEmails.length > 0 ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
                }}
              >
                Send Invitations 🚀
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 7: CONNECT INTEGRATIONS ---- */}
        {activeStep.step_order === 7 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '1rem', background: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>💬</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>Slack</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Sync channels & alerts.</p>
                </div>
                <button
                  onClick={() => handleConnectApp('slack')}
                  disabled={connectedApps.slack || connectingApp === 'slack'}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: connectedApps.slack ? '#d1fae5' : '#f1f5f9',
                    color: connectedApps.slack ? '#047857' : 'var(--text-main)',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: connectedApps.slack ? 'default' : 'pointer'
                  }}
                >
                  {connectingApp === 'slack' ? 'Connecting...' : connectedApps.slack ? '✓ Connected' : 'Connect'}
                </button>
              </div>

              <div style={{ border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '1rem', background: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🎯</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>Jira</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Create issues & tasks.</p>
                </div>
                <button
                  onClick={() => handleConnectApp('jira')}
                  disabled={connectedApps.jira || connectingApp === 'jira'}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: connectedApps.jira ? '#d1fae5' : '#f1f5f9',
                    color: connectedApps.jira ? '#047857' : 'var(--text-main)',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: connectedApps.jira ? 'default' : 'pointer'
                  }}
                >
                  {connectingApp === 'jira' ? 'Connecting...' : connectedApps.jira ? '✓ Connected' : 'Connect'}
                </button>
              </div>

              <div style={{ border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '1rem', background: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>📅</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>Google Calendar</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Auto schedule events.</p>
                </div>
                <button
                  onClick={() => handleConnectApp('google')}
                  disabled={connectedApps.google || connectingApp === 'google'}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: connectedApps.google ? '#d1fae5' : '#f1f5f9',
                    color: connectedApps.google ? '#047857' : 'var(--text-main)',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: connectedApps.google ? 'default' : 'pointer'
                  }}
                >
                  {connectingApp === 'google' ? 'Connecting...' : connectedApps.google ? '✓ Connected' : 'Connect'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={() => completeActiveStep('completed', 'Finished integrations step.')}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                }}
              >
                Save and Continue ✓
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 8: CELEBRATION ---- */}
        {activeStep.step_order === 8 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '4.5rem', animation: 'float 3s ease-in-out infinite' }}>🎉🏆</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--success)' }}>You are fully onboarded!</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Outstanding! You have completed all onboarding stages. The system database is fully initialized with your profile settings. You're ready to step into the dashboard.
            </p>

            {auditLogs.length > 0 && (
              <div style={{ textAlign: 'left', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Onboarding Action History Logs:</h4>
                {auditLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                    <span>⚡ {log.action}</span>
                    <span style={{ color: 'var(--text-light)' }}>{log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                completeActiveStep('completed', 'Onboarding completed fully.');
                onNavigate('dashboard');
              }}
              style={{
                alignSelf: 'center',
                padding: '0.8rem 2.2rem',
                borderRadius: '99px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                marginTop: '0.5rem'
              }}
            >
              Launch FlowGuide Dashboard ✨
            </button>
          </div>
        )}

      </div>

      {/* Navigation Footer Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: 'auto' }}>
        {activeStep.step_order > 1 && (
          <button
            onClick={() => {
              const prev = steps.find(s => s.step_order === activeStep.step_order - 1);
              if (prev) setActiveStep(prev);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            ← Back
          </button>
        )}
        
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          {!activeStep.is_required && activeStep.status !== 'completed' && activeStep.status !== 'skipped' && (
            <button
              onClick={() => completeActiveStep('skipped', 'Skipped step.')}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: '#fff', color: 'var(--text-light)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Skip Step
            </button>
          )}
          
          {activeStep.status !== 'completed' && activeStep.step_order !== 2 && activeStep.step_order !== 3 && activeStep.step_order !== 4 && activeStep.step_order !== 8 && (
            <button
              onClick={() => completeActiveStep('completed', 'Completed.')}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Mark Completed ✓
            </button>
          )}

          {activeStep.status === 'completed' && activeStep.step_order < totalSteps && (
            <button
              onClick={() => {
                const next = steps.find(s => s.step_order === activeStep.step_order + 1);
                if (next) setActiveStep(next);
              }}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
