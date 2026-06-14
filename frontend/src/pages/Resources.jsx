import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Video, 
  Play, 
  Download, 
  ArrowRight, 
  CheckCircle, 
  X,
  Volume2
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What database is used as the default persistent storage for FlowGuide?",
    options: ["MongoDB", "SQLite", "PostgreSQL", "MySQL"],
    correct: 2 // PostgreSQL
  },
  {
    id: 2,
    question: "Which framework powers the backend notification service that triggers emails?",
    options: ["Spring Boot", "FastAPI", "Node.js Express", "Django"],
    correct: 0 // Spring Boot
  },
  {
    id: 3,
    question: "How does Sparky (the AI chat widget) help you complete onboarding steps?",
    options: [
      "By calling you on the phone",
      "Through clickable shortcut suggestions that open steps instantly",
      "By sending a physical mail",
      "It doesn't help with steps"
    ],
    correct: 1 // Through clickable...
  },
  {
    id: 4,
    question: "What prefix is used by the FastAPI router paths for frontend requests?",
    options: ["/v1", "/services", "/backend", "/api"],
    correct: 3 // /api
  },
  {
    id: 5,
    question: "What command starts the React frontend dev server on port 3000?",
    options: ["npm start", "npm run dev", "vite build", "node server.js"],
    correct: 1 // npm run dev
  }
];

const STUDY_GUIDES = [
  {
    title: "PostgreSQL Setup Guide",
    desc: "Configure JDBC drivers, manage database roles, and update schemas dynamically.",
    time: "10 mins reading",
    content: "To set up PostgreSQL locally, download version 15+. Open pgAdmin and create a database named 'flowguide'. Ensure your credentials match those in your application.properties: username 'postgres' and password 'Manu@2008'. Spring Boot Hibernate DDL Auto-update will handle creating the schema columns automatically when you first launch the server."
  },
  {
    title: "Spring Boot Mail Sender Cheat Sheet",
    desc: "Gmail SMTP settings, app password setup, and application.properties configuration.",
    time: "5 mins reading",
    content: "Configure your email host parameters using spring.mail.host=smtp.gmail.com and port 587. If using Gmail, you must generate a 16-character 'App Password' from your Google Account settings, as regular passwords are blocked. Turn on spring.mail.properties.mail.smtp.starttls.enable=true to secure authentication."
  },
  {
    title: "FastAPI Routers & Schemas Architecture",
    desc: "A structural diagram explaining models, dependencies, JWT security, and audit middleware.",
    time: "12 mins reading",
    content: "FastAPI handles user authentication via JWT. Tokens are verified using passlib (bcrypt) and python-jose. Database sessions are injected using Depends(get_db). When user onboarding actions occur, the router writes a log row to the 'audit_logs' table, ensuring a complete tracking history."
  },
  {
    title: "Vite Proxy Server Mapping Config",
    desc: "Configuring vite.config.js to redirect API requests and bypass CORS limitations.",
    time: "8 mins reading",
    content: "Vite proxies local frontends to backends via the server.proxy object. In our setup, server.port is set to 3000, and '/api' routes are proxied to 'http://localhost:8000'. This allows requests to fetch('/api/users/me') to be automatically resolved by the FastAPI backend on port 8000, avoiding CORS conflicts."
  }
];

const VIDEO_TUTORIALS = [
  {
    id: 'vid-1',
    title: "Spring Boot Full Tutorial for Beginners",
    desc: "Complete guide on setting up Spring Boot services, database configurations, and app variables.",
    duration: "2:30 hours",
    url: "https://www.youtube.com/embed/9SGDpanrc8U",
    watchUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
  },
  {
    id: 'vid-2',
    title: "Slack Incoming Webhooks Integration Guide",
    desc: "Step-by-step setup tutorial showing how to connect Slack apps and dispatch webhook JSON messages.",
    duration: "12 mins",
    url: "https://www.youtube.com/embed/WJ_p-YI7094",
    watchUrl: "https://www.youtube.com/watch?v=WJ_p-YI7094",
    color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
  },
  {
    id: 'vid-3',
    title: "FastAPI Python Backend Full Course",
    desc: "Comprehensive crash course on FastAPI routing, validation, middleware, and API schemas.",
    duration: "1:45 hours",
    url: "https://www.youtube.com/embed/tLKKm18tU2U",
    watchUrl: "https://www.youtube.com/watch?v=tLKKm18tU2U",
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  {
    id: 'vid-4',
    title: "PostgreSQL Database Course for Beginners",
    desc: "Complete guide to setting up PostgreSQL local database services, tables, and CRUD queries.",
    duration: "4:20 hours",
    url: "https://www.youtube.com/embed/qw--VYLgGho",
    watchUrl: "https://www.youtube.com/watch?v=qw--VYLgGho",
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
  }
];

export default function Resources() {
  const { addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('quiz'); // quiz | materials | videos
  
  // Quiz states
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Study guides state
  const [expandedGuide, setExpandedGuide] = useState(null);
  
  // Video player modal state
  const [activeVideo, setActiveVideo] = useState(null);
  const [embedInline, setEmbedInline] = useState(false);

  // Toast download notification
  const [downloadToast, setDownloadToast] = useState('');

  const handleSelectAnswer = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (typeof addAuditLog === 'function') {
      addAuditLog(`QUIZ_COMPLETED_SCORE_${score}_OF_5`);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleDownloadPDF = (guide) => {
    const fileContent = `# TaskHub / FlowGuide Study Material: ${guide.title}\n\nDescription: ${guide.desc}\n\nReading Time: ${guide.time}\n\n---\n\n${guide.content}\n\n---\nGenerated by TaskHub Workspace © 2026.`;
    const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${guide.title.replace(/\s+/g, '_')}_CheatSheet.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Downloaded: "${guide.title}" to your Downloads folder!`);
    setTimeout(() => setDownloadToast(''), 3000);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      {/* Toast popup */}
      {downloadToast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--dark-slate)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '0.75rem', zIndex: 99999, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--popover-shadow)', fontSize: '0.9rem', fontWeight: 'bold' }}>
          <Download size={16} />
          {downloadToast}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.75)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-panel" style={{ background: '#fff', border: 'none', borderRadius: '1.5rem', width: '100%', maxWidth: '640px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--popover-shadow)' }}>
            
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={18} /> {activeVideo.title}
              </h3>
              <button 
                onClick={() => setActiveVideo(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary-dark)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Dynamic Player: Iframe or Card Preview */}
            {embedInline ? (
              <div style={{ aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
                <iframe
                  title={activeVideo.title}
                  src={activeVideo.url}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                />
              </div>
            ) : (
              <div style={{ aspectRatio: '16/9', background: activeVideo.color, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'white', gap: '0.75rem' }}>
                <div 
                  onClick={() => window.open(activeVideo.watchUrl, '_blank', 'noopener,noreferrer')}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'white', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'transform 0.1s' }}
                >
                  <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '1.2rem', color: '#fff' }}>YouTube Video Tutorial</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.95, maxWidth: '340px' }}>
                  This tutorial is hosted on YouTube. Choose an option below to watch.
                </p>
              </div>
            )}

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{activeVideo.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={activeVideo.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '0.5rem',
                      background: '#ef4444',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    Watch on YouTube ↗
                  </a>
                  {!embedInline && (
                    <button
                      onClick={() => setEmbedInline(true)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: '#fff',
                        color: 'var(--text-main)',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Embed Inline
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={() => setActiveVideo(null)} 
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'var(--dark-slate)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--dark-slate)' }}>Resource Hub</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Elevate your workspace setup knowledge with guides, tutorials, and quizzes.</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', alignSelf: 'center' }}>
        <button
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '99px',
            border: 'none',
            background: activeTab === 'quiz' ? 'var(--primary)' : 'none',
            color: activeTab === 'quiz' ? 'white' : 'var(--text-light)',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <HelpCircle size={16} /> Knowledge Quiz
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '99px',
            border: 'none',
            background: activeTab === 'materials' ? 'var(--primary)' : 'none',
            color: activeTab === 'materials' ? 'white' : 'var(--text-light)',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <FileText size={16} /> Study Guides
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '99px',
            border: 'none',
            background: activeTab === 'videos' ? 'var(--primary)' : 'none',
            color: activeTab === 'videos' ? 'white' : 'var(--text-light)',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <Video size={16} /> Tutorial Videos
        </button>
      </div>

      {/* TAB CONTAINER CONTENT */}
      <div style={{ flex: 1, minHeight: '300px' }}>
        
        {/* ---- 1. INTERACTIVE QUIZ ---- */}
        {activeTab === 'quiz' && (
          <div className="glass-panel" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Workspace Integration Quiz</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Test your knowledge on configuring the database, mail parameters, and APIs.</p>
              </div>
              {quizSubmitted && (
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: quizScore >= 4 ? 'var(--success)' : 'var(--warning)', background: quizScore >= 4 ? 'var(--success-light)' : 'var(--warning-light)', padding: '0.4rem 1rem', borderRadius: '0.5rem' }}>
                  Score: {quizScore} / 5
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    Q{idx + 1}. {q.question}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {q.options.map((option, optIdx) => {
                      const isSelected = answers[q.id] === optIdx;
                      const isCorrect = q.correct === optIdx;
                      const isWrong = isSelected && !isCorrect;

                      let optStyle = {
                        border: '1px solid var(--border-color)',
                        background: '#f8fafc'
                      };

                      if (isSelected) {
                        optStyle = {
                          border: '2px solid var(--primary)',
                          background: 'var(--primary-light)'
                        };
                      }

                      if (quizSubmitted) {
                        if (isCorrect) {
                          optStyle = {
                            border: '2px solid var(--success)',
                            background: 'var(--success-light)'
                          };
                        } else if (isWrong) {
                          optStyle = {
                            border: '2px solid var(--danger)',
                            background: 'var(--danger-light)'
                          };
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            textAlign: 'left',
                            fontSize: '0.875rem',
                            cursor: quizSubmitted ? 'default' : 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            ...optStyle
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', justifyContent: 'flex-end' }}>
              {quizSubmitted ? (
                <>
                  <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: quizScore >= 4 ? 'var(--success)' : 'var(--text-light)' }}>
                    <CheckCircle size={18} />
                    <span>{quizScore >= 4 ? 'Great job! You are ready to administer FlowGuide.' : 'Review study materials below to improve score!'}</span>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'white', color: 'var(--dark-slate)', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Retry Quiz
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < 5}
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: Object.keys(answers).length === 5 ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : '#cbd5e1',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: Object.keys(answers).length === 5 ? 'pointer' : 'not-allowed',
                    boxShadow: Object.keys(answers).length === 5 ? '0 4px 10px rgba(99, 102, 241, 0.2)' : 'none'
                  }}
                >
                  Submit Quiz Answers
                </button>
              )}
            </div>

          </div>
        )}

        {/* ---- 2. EXPANDABLE STUDY GUIDES ---- */}
        {activeTab === 'materials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {STUDY_GUIDES.map((guide, index) => {
              const isExpanded = expandedGuide === index;
              return (
                <div
                  key={index}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    background: '#fff',
                    border: 'none',
                    boxShadow: 'var(--card-shadow)',
                    borderRadius: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--dark-slate)' }}>{guide.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{guide.desc}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.25rem 0.6rem', borderRadius: '0.5rem' }}>
                        {guide.time}
                      </span>
                      <button
                        onClick={() => handleDownloadPDF(guide)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-light)',
                          padding: '0.4rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}
                        title="Download as PDF"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-main)', border: '1px solid var(--border-color)', animation: 'slide-up 0.3s ease-out' }}>
                      {guide.content}
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedGuide(isExpanded ? null : index)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-dark)',
                      fontWeight: '700',
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {isExpanded ? 'Hide Details' : 'Expand Guide Details'} <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- 3. REFERENCE VIDEOS ---- */}
        {activeTab === 'videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {VIDEO_TUTORIALS.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  setEmbedInline(false);
                }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Video cover image representation */}
                <div style={{ height: '140px', background: video.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* Floating watch duration badge */}
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                    {video.duration}
                  </span>

                  {/* Centered Play Button overlay */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-slate)' }}>{video.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.5', flex: 1 }}>{video.desc}</p>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                    Click to Play Tutorial
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
