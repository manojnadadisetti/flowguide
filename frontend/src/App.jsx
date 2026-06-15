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
    currentUser,
    demoMode,
    sendChatMessage
  } = useAuth();

  const [page, setPage] = useState('home'); // home | plans | features | resources | contact | legal | onboarding | dashboard | profile | admin | login | register
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'ai', text: "Hey there! I'm Sparky, your AI study assistant. Ask me to explain concepts, generate notes, or help with code and assignments!" }
  ]);

  const renderMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    // Replace code blocks: ```[lang] code ```
    html = html.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '<pre style="background:#0f172a;color:#e2e8f0;padding:0.75rem;border-radius:0.5rem;font-family:monospace;font-size:0.75rem;overflow-x:auto;margin:0.5rem 0;white-space:pre-wrap;text-align:left;"><code>$1</code></pre>');
    
    // Replace inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code style="background:#e2e8f0;color:#0f172a;padding:0.1rem 0.3rem;border-radius:4px;font-family:monospace;font-size:0.8rem;">$1</code>');
    
    // Replace headings: ### text
    html = html.replace(/###\s*(.*)/g, '<h4 style="margin:0.5rem 0 0.25rem 0;color:var(--primary-dark);font-size:0.9rem;">$1</h4>');
    
    // Replace bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Replace math
    html = html.replace(/\$\$([^\$]+)\$\$/g, '<span style="font-family:serif;font-style:italic;">$1</span>');
    html = html.replace(/\$([^\$]+)\$/g, '<span style="font-family:serif;font-style:italic;">$1</span>');

    // Replace bullet points: - text
    html = html.replace(/^-\s*(.*)/gm, '• $1');
    
    // Replace newlines with <br/>
    html = html.replace(/\n/g, '<br/>');
    
    return html;
  };
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
      // If signed in, and they were on login or register, wait for profile and redirect based on role
      if (['login', 'register'].includes(page) && currentUser) {
        if (currentUser.role === 'admin') {
          setPage('admin');
        } else {
          setPage('onboarding');
        }
      }
    }
  }, [token, currentUser, page]);

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

    try {
      const responseText = await sendChatMessage(userMsg.text);
      setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
        id: Date.now().toString(),
        sender: 'ai',
        text: responseText
      }));
    } catch (err) {
      setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
        id: Date.now().toString(),
        sender: 'ai',
        text: "I had trouble communicating with the chatbot service. Please ensure the backend is running."
      }));
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
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                    />
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Preset suggestion chips */}
              <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', background: '#fff', borderTop: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                <button onClick={() => handleQuickQuestion('Explain Linear Regression')} style={{ flexShrink: 0, padding: '0.25rem 0.6rem', border: '1px solid var(--primary-light)', borderRadius: '99px', fontSize: '0.7rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 'bold' }}>🤖 Explain ML Regression</button>
                <button onClick={() => handleQuickQuestion('Calculator assignment tips')} style={{ flexShrink: 0, padding: '0.25rem 0.6rem', border: '1px solid var(--secondary-light)', borderRadius: '99px', fontSize: '0.7rem', background: 'var(--secondary-light)', color: 'var(--secondary-dark)', cursor: 'pointer', fontWeight: 'bold' }}>🐍 Calculator Tips</button>
                <button onClick={() => handleQuickQuestion('Generate JavaScript study notes')} style={{ flexShrink: 0, padding: '0.25rem 0.6rem', border: '1px solid var(--info-light)', borderRadius: '99px', fontSize: '0.7rem', background: 'var(--info-light)', color: 'var(--info)', cursor: 'pointer', fontWeight: 'bold' }}>📚 JavaScript Notes</button>
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
