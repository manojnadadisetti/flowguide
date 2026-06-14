import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Features from './pages/Features';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { MessageSquare, X, SendHorizontal } from 'lucide-react';

function AppContent() {
  const {
    token,
    steps,
    activeStep,
    setActiveStep,
    updateStepProgress,
    demoMode
  } = useAuth();

  const [page, setPage] = useState('home'); // home | plans | features | resources | contact | legal | onboarding | dashboard | profile | admin | login | register
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'ai', text: "Hey there! I'm Sparky, your onboarding assistant. Ask me anything about setting up your workspace!" }
  ]);
  const [confettiActive, setConfettiActive] = useState(false);

  const chatEndRef = useRef(null);

  // Sync page state based on authentication changes
  useEffect(() => {
    if (!token) {
      // If signed out, and they try to visit protected pages, take them to login
      if (['onboarding', 'dashboard', 'profile', 'admin'].includes(page)) {
        setPage('login');
      }
    } else {
      // If signed in, and they were on login or register, take them to onboarding roadmap
      if (['login', 'register'].includes(page)) {
        setPage('onboarding');
      }
    }
  }, [token]);

  // Scroll chat messages to bottom on update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const handleQuickQuestion = (text) => {
    setChatInput(text);
    setTimeout(() => {
      const btn = document.getElementById('chat-submit-btn');
      if (btn) btn.click();
    }, 50);
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Loader
    const loadingId = 'loading-' + Date.now();
    setChatMessages(prev => [...prev, { id: loadingId, sender: 'ai', text: 'Thinking...', loading: true }]);

    if (demoMode) {
      // Offline local AI
      setTimeout(() => {
        const queryLower = userMsg.text.toLowerCase();
        let answer = "I couldn't find an exact match for that question, but I can help you complete your onboarding road map! Let me know if you need help with your profile, email verification, notifications, or team invites.";
        let suggestedId = null;
        let suggestedTitle = "";

        if (queryLower.includes('profile') || queryLower.includes('avatar') || queryLower.includes('name')) {
          answer = "Complete your profile in Step 2! You can pick a custom emoji avatar buddy and enter your full name.";
          suggestedId = "step-2";
          suggestedTitle = "Complete Your Profile";
        } else if (queryLower.includes('email') || queryLower.includes('verify')) {
          answer = "Verify your email in Step 3! We simulate this with an interactive email client layout inside the step panel.";
          suggestedId = "step-3";
          suggestedTitle = "Verify Your Email";
        } else if (queryLower.includes('dashboard') || queryLower.includes('tour') || queryLower.includes('explore')) {
          answer = "Take an interactive tour of the workspace in Step 4. Click the highlighted areas to unlock the next step!";
          suggestedId = "step-4";
          suggestedTitle = "Explore the Dashboard";
        } else if (queryLower.includes('notification') || queryLower.includes('alert') || queryLower.includes('bell')) {
          answer = "Configure your notifications channels in Step 5. You can toggle email alerts, push cards, or Slack DMs.";
          suggestedId = "step-5";
          suggestedTitle = "Set Up Notifications";
        } else if (queryLower.includes('team') || queryLower.includes('invite') || queryLower.includes('colleague')) {
          answer = "Invite your teammates in Step 6. Type their email addresses and send invites.";
          suggestedId = "step-6";
          suggestedTitle = "Invite Your Team";
        } else if (queryLower.includes('integration') || queryLower.includes('slack') || queryLower.includes('jira') || queryLower.includes('connect')) {
          answer = "Link integrations like Slack, Jira, or Google Services in Step 7. Try toggling JIRA or Slack!";
          suggestedId = "step-7";
          suggestedTitle = "Connect Integrations";
        } else {
          // Default to next step if user is logged in
          if (token && steps.length > 0) {
            const incomplete = steps.find(s => s.status !== 'completed' && s.status !== 'skipped');
            if (incomplete) {
              answer = `Let's work on your next step: '${incomplete.title}'! Description: ${incomplete.description}`;
              suggestedId = incomplete.id;
              suggestedTitle = incomplete.title;
            }
          }
        }

        setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
          id: Date.now().toString(),
          sender: 'ai',
          text: answer,
          suggestedStepId: suggestedId,
          suggestedStepTitle: suggestedTitle
        }));
      }, 700);
    } else {
      // Live API Guidance
      try {
        const res = await fetch('/api/onboarding/guidance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ query: userMsg.text })
        });
        const data = await res.json();
        setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
          id: Date.now().toString(),
          sender: 'ai',
          text: data.answer,
          suggestedStepId: data.suggested_step_id,
          suggestedStepTitle: data.suggested_step_title
        }));
      } catch (err) {
        setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
          id: Date.now().toString(),
          sender: 'ai',
          text: "I had trouble communicating with the live guidance engine. Please verify the FastAPI backend is running on port 8000."
        }));
      }
    }
  };

  const handleGoToSuggestedStep = (stepId) => {
    const targetStep = steps.find(s => s.id === stepId);
    if (targetStep) {
      setActiveStep(targetStep);
      setPage('onboarding');
      if (targetStep.status === 'pending') {
        updateStepProgress(targetStep.id, 'in_progress', 'Began step via AI recommendation.');
      }
    }
  };

  const renderActivePage = () => {
    switch (page) {
      case 'home':
        return <Home onNavigate={setPage} />;
      case 'plans':
        return <Plans onNavigate={setPage} />;
      case 'features':
        return <Features onNavigate={setPage} />;
      case 'resources':
        return <Resources />;
      case 'contact':
        return <Contact />;
      case 'legal':
        return <Legal />;
      case 'onboarding':
        return (
          <ProtectedRoute onRedirect={setPage}>
            <Onboarding onTriggerConfetti={triggerConfetti} onNavigate={setPage} />
          </ProtectedRoute>
        );
      case 'dashboard':
        return (
          <ProtectedRoute onRedirect={setPage}>
            <Dashboard onNavigate={setPage} />
          </ProtectedRoute>
        );
      case 'profile':
        return (
          <ProtectedRoute onRedirect={setPage}>
            <Profile onNavigate={setPage} />
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <ProtectedRoute onRedirect={setPage}>
            <AdminDashboard onNavigate={setPage} />
          </ProtectedRoute>
        );
      case 'login':
        return <Login onNavigate={setPage} />;
      case 'register':
        return <Register onNavigate={setPage} />;
      default:
        return <Home onNavigate={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Playful Confetti Overlay */}
      {confettiActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}>
          {[...Array(50)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 2;
            const randomColor = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'][i % 5];
            return (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${randomX}%`,
                  animationDelay: `${randomDelay}s`,
                  backgroundColor: randomColor,
                  width: `${Math.random() * 8 + 6}px`,
                  height: `${Math.random() * 15 + 8}px`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar currentTab={page} onNavigate={setPage} />

      {/* Page Content Shell */}
      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {renderActivePage()}
      </main>

      {/* --------------------------------------------------
         GLOBAL FLOATING AI ASSISTANT CHAT WIDGET
         -------------------------------------------------- */}
      {token && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
          
          {/* Launcher Button */}
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="animate-pulse-soft"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <MessageSquare size={24} />
            </button>
          ) : (
            
            /* Expanded Assistant Interface */
            <div className="glass-panel animate-slide-up" style={{ width: '360px', height: '480px', display: 'flex', flexDirection: 'column', border: 'none', boxShadow: 'var(--popover-shadow)', background: '#fff', borderRadius: '1.25rem', overflow: 'hidden' }}>
              
              <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🤖</span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Sparky Assistant</h4>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>
                      {demoMode ? 'Local Buddy Mode' : 'Live AI Agent Mode'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Message Box */}
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc' }}>
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <div
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                        background: msg.sender === 'user' ? 'var(--primary)' : '#fff',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                        fontSize: '0.825rem',
                        lineHeight: '1.4',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                      }}
                    >
                      {msg.text}
                    </div>

                    {/* Recommendation Step Shortcut link */}
                    {msg.suggestedStepId && (
                      <button
                        onClick={() => handleGoToSuggestedStep(msg.suggestedStepId)}
                        style={{
                          alignSelf: 'flex-start',
                          marginTop: '0.25rem',
                          background: 'var(--secondary-light)',
                          color: 'var(--secondary-dark)',
                          border: 'none',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          boxShadow: '0 2px 6px rgba(236, 72, 153, 0.15)'
                        }}
                      >
                        👉 Go to step: {msg.suggestedStepTitle}
                      </button>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Preset suggestion chips */}
              <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', background: '#fff', borderTop: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                <button onClick={() => handleQuickQuestion('How to complete my profile?')} style={{ flexShrink: 0, padding: '0.25rem 0.6rem', border: '1px solid var(--primary-light)', borderRadius: '99px', fontSize: '0.7rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 'bold' }}>👤 Edit Profile</button>
                <button onClick={() => handleQuickQuestion('How do I verify email?')} style={{ flexShrink: 0, padding: '0.25rem 0.6rem', border: '1px solid var(--secondary-light)', borderRadius: '99px', fontSize: '0.7rem', background: 'var(--secondary-light)', color: 'var(--secondary-dark)', cursor: 'pointer', fontWeight: 'bold' }}>✉️ Verify Email</button>
                <button onClick={() => handleQuickQuestion('Connect Slack integration?')} style={{ flexShrink: 0, padding: '0.25rem 0.6rem', border: '1px solid var(--info-light)', borderRadius: '99px', fontSize: '0.7rem', background: 'var(--info-light)', color: 'var(--info)', cursor: 'pointer', fontWeight: 'bold' }}>🔌 Integrations</button>
              </div>

              {/* Message inputs form */}
              <form onSubmit={handleSendChatMessage} style={{ padding: '0.75rem 1rem', background: '#fff', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask Sparky anything..."
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                />
                <button
                  id="chat-submit-btn"
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: 'white',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <SendHorizontal size={14} />
                </button>
              </form>

            </div>
          )}

        </div>
      )}

      {/* Footer bar */}
      <footer style={{ marginTop: 'auto', padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-light)', background: '#fff' }}>
        FlowGuide Onboarding Platform © 2026. Made with ⚡ using React, Vite & FastAPI.
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
