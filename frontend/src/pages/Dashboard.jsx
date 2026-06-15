import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Award, CheckSquare, Plus, Trash2, ShieldAlert,
  ChevronRight, Award as BadgeIcon, Calendar, MessageCircle, BarChart3, Flame
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { 
    currentUser, courses, enrolledCourses, plannerTasks,
    enrollInCourse, fetchQuizzes, submitQuizAnswers,
    fetchAssignments, submitAssignmentSolution,
    addPlannerTask, togglePlannerTask, deletePlannerTask, logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // overview | explore | course-detail
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Course learning workspace states
  const [courseQuizzes, setCourseQuizzes] = useState([]);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Quiz execution states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Assignment submissions states
  const [assignmentSolutions, setAssignmentSolutions] = useState({});
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Daily Planner input states
  const [newTaskText, setNewTaskText] = useState('');

  // Setup initial data
  useEffect(() => {
    if (selectedCourse) {
      loadCourseAssets(selectedCourse.id);
    }
  }, [selectedCourse, enrolledCourses]);

  const loadCourseAssets = async (courseId) => {
    const qList = await fetchQuizzes(courseId);
    setCourseQuizzes(qList);
    const aList = await fetchAssignments(courseId);
    setCourseAssignments(aList);
  };

  const handleOpenCourse = (course) => {
    setSelectedCourse(course);
    setActiveModuleIndex(0);
    setActiveQuiz(null);
    setQuizResult(null);
    setActiveTab('course-detail');
  };

  // Quiz Handling
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleSelectAnswer = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    const questions = JSON.parse(activeQuiz.questions_json);
    const answers = [];
    for (let i = 0; i < questions.length; i++) {
      if (quizAnswers[i] === undefined) {
        alert('Please answer all questions before submitting.');
        return;
      }
      answers.push(quizAnswers[i]);
    }

    setQuizLoading(true);
    const result = await submitQuizAnswers(activeQuiz.id, answers, selectedCourse.id);
    setQuizLoading(false);
    setQuizResult(result);
  };

  // Assignment Handling
  const handleAssignmentSubmit = async (assignId) => {
    const sol = assignmentSolutions[assignId];
    if (!sol || !sol.trim()) {
      alert('Please type in a solution text before submitting.');
      return;
    }

    const ok = await submitAssignmentSolution(assignId, sol, selectedCourse.id);
    if (ok) {
      setSubmitSuccessMsg('Assignment submitted successfully! 🚀');
      setTimeout(() => setSubmitSuccessMsg(''), 4000);
      setAssignmentSolutions(prev => ({ ...prev, [assignId]: '' }));
    }
  };

  // Planner Handling
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const ok = await addPlannerTask(newTaskText, new Date().toISOString());
    if (ok) {
      setNewTaskText('');
    }
  };

  // Achievements calculator
  const getAchievements = () => {
    const list = [];
    if (currentUser?.streak_count >= 3) {
      list.push({ title: "Flame Master", desc: "Maintained a 3-day study streak", icon: "🔥" });
    }
    if (currentUser?.total_points >= 200) {
      list.push({ title: "Points Collector", desc: "Earned over 200 XP points", icon: "💎" });
    }
    if (enrolledCourses.length >= 2) {
      list.push({ title: "Double Threat", desc: "Enrolled in 2 or more courses", icon: "📚" });
    }
    if (enrolledCourses.some(e => e.progress === 100)) {
      list.push({ title: "Graduate", desc: "Completed 100% of a course", icon: "🎓" });
    }
    if (list.length === 0) {
      list.push({ title: "Fresh Recruit", desc: "Started your onboarding roadmap", icon: "🌟" });
    }
    return list;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', minHeight: '85vh', marginTop: '1rem' }}>
      
      {/* Sidebar Controls */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>{currentUser?.avatar_url || '🦊'}</span>
          <div>
            <h4 style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{currentUser?.full_name}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', background: 'var(--primary-light)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
              {currentUser?.role === 'admin' ? 'Grader Admin' : `Rank: Level ${Math.floor((currentUser?.total_points || 0) / 300) + 1}`}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('overview')}
          style={{
            textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none',
            background: activeTab === 'overview' ? 'var(--primary-light)' : 'none',
            color: activeTab === 'overview' ? 'var(--primary-dark)' : 'var(--text-main)',
            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <BarChart3 size={18} /> Dashboard Home
        </button>

        <button 
          onClick={() => setActiveTab('explore')}
          style={{
            textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none',
            background: activeTab === 'explore' ? 'var(--primary-light)' : 'none',
            color: activeTab === 'explore' ? 'var(--primary-dark)' : 'var(--text-main)',
            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <BookOpen size={18} /> Course Catalog
        </button>

        {enrolledCourses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase', paddingLeft: '0.5rem' }}>My Courses</span>
            {enrolledCourses.map(ec => (
              <button
                key={ec.id}
                onClick={() => handleOpenCourse(ec.course)}
                style={{
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none',
                  background: selectedCourse?.id === ec.course.id && activeTab === 'course-detail' ? '#f1f5f9' : 'none',
                  color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}
              >
                📖 {ec.course.title}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button 
            onClick={logout}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.5rem', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* gamification status header */}
            <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', border: 'none', color: 'white', borderRadius: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(99,102,241,0.2)' }}>
              <div>
                <h2 style={{ color: 'white', fontSize: '1.75rem' }}>Welcome Back, {currentUser?.full_name}! 👋</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
                  Target: <strong>{currentUser?.daily_target_minutes} mins daily study</strong> | Level {Math.floor((currentUser?.total_points || 0) / 300) + 1}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Flame size={16} style={{ color: '#fb7185' }} /> {currentUser?.streak_count || 0} Day Streak
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    💎 {currentUser?.total_points || 0} XP Points
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '3.5rem', animation: 'float 4s ease-in-out infinite' }}>🎓</div>
            </div>

            {/* Enrolled Courses Status */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>My Enrolled Courses</h3>
              {enrolledCourses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: '#fff', border: 'none', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  🎒 You aren't enrolled in any courses yet. Browse the <span onClick={() => setActiveTab('explore')} style={{ color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Course Catalog</span> to enroll!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {enrolledCourses.map(ec => (
                    <div 
                      key={ec.id} 
                      className="glass-panel" 
                      onClick={() => handleOpenCourse(ec.course)}
                      style={{ padding: '1.5rem', background: '#fff', border: 'none', cursor: 'pointer', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRadius: '1rem', position: 'relative' }}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--secondary-dark)', fontWeight: 'bold', background: 'var(--secondary-light)', padding: '0.1rem 0.5rem', borderRadius: '4px', alignSelf: 'flex-start' }}>
                        {ec.course.category}
                      </span>
                      <h4 style={{ fontSize: '1.1rem' }}>{ec.course.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineBreak: 'anywhere', height: '36px', overflow: 'hidden' }}>{ec.course.description}</p>
                      
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                          <span>Progress</span>
                          <span>{ec.progress}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${ec.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '99px' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Study Planner & Achievements Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
              
              {/* Daily Checklist */}
              <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Daily Study Checklist</h3>
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Add a new task (e.g. Read Lesson 2)"
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.825rem', outline: 'none' }}
                  />
                  <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={16} />
                  </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {plannerTasks.length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center', padding: '1rem' }}>No study milestones added yet.</span>
                  ) : (
                    plannerTasks.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={t.is_completed}
                            onChange={() => togglePlannerTask(t.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.825rem', textDecoration: t.is_completed ? 'line-through' : 'none', color: t.is_completed ? 'var(--text-light)' : 'var(--text-main)' }}>
                            {t.task}
                          </span>
                        </div>
                        <button onClick={() => deletePlannerTask(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Badges & Achievements</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '230px', overflowY: 'auto' }}>
                  {getAchievements().map((ach, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: 'var(--info-light)' }}>
                      <span style={{ fontSize: '1.75rem' }}>{ach.icon}</span>
                      <div>
                        <h4 style={{ fontSize: '0.85rem' }}>{ach.title}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{ach.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Analytics Section */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1rem', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Analytics: Weekly Quiz Performance</h3>
                <div style={{ height: '140px', background: '#f8fafc', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem' }}>
                  {[60, 80, 50, 90, 75, 100].map((val, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ height: `${val}px`, width: '12px', background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)', borderRadius: '4px' }}></div>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-light)' }}>Quiz {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>AI Study Recommendations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '0.5rem' }}>
                    <strong>Boost Flexbox Grid</strong>: Re-read responsive layout modules for Javascript UI setups.
                  </div>
                  <div style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '0.5rem' }}>
                    <strong>Strengthen Functions</strong>: Prepare for Python calculations by checking math function scopes.
                  </div>
                  <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '0.5rem' }}>
                    <strong>Daily Streak Warning</strong>: Log in tomorrow to preserve your current {currentUser?.streak_count}-day streak!
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* EXPLORE CATALOG TAB */}
        {activeTab === 'explore' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Browse Learning Tracks</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>Courses mapped to your onboarding level: <strong>{currentUser?.skill_level}</strong></p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              {courses.map(course => {
                const isEnrolled = enrolledCourses.some(e => e.course_id === course.id);
                const isRecommended = currentUser?.interests?.toLowerCase().includes(course.category.toLowerCase().split(' ')[0]);

                return (
                  <div 
                    key={course.id} 
                    className="glass-panel animate-slide-up" 
                    style={{ padding: '1.75rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary-dark)', fontWeight: 'bold', background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {course.category}
                      </span>
                      {isRecommended && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 'bold', background: 'var(--success-light)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          ⚡ Interest Match
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-slate)' }}>{course.title}</h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-light)', marginTop: '0.5rem', minHeight: '36px', overflow: 'hidden' }}>{course.description}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                      <span>Skill Level: <strong>{course.level}</strong></span>
                      {isEnrolled ? (
                        <button 
                          onClick={() => handleOpenCourse(course)}
                          style={{ padding: '0.4rem 0.8rem', background: 'var(--success)', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '0.5rem', cursor: 'pointer' }}
                        >
                          Enrolled (Study)
                        </button>
                      ) : (
                        <button 
                          onClick={() => enrollInCourse(course.id)}
                          style={{ padding: '0.4rem 0.8rem', background: 'var(--primary)', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '0.5rem', cursor: 'pointer' }}
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COURSE DETAILS WORKSPACE */}
        {activeTab === 'course-detail' && selectedCourse && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
            
            {/* Left Column: Lesson Modules & Tabs */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1rem', height: 'fit-content' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>COURSE MODULES</span>
                <h4 style={{ fontSize: '1rem', marginTop: '0.2rem' }}>{selectedCourse.title}</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {JSON.parse(selectedCourse.modules_json).map((mod, idx) => (
                  <button
                    key={mod.id}
                    onClick={() => { setActiveModuleIndex(idx); setActiveQuiz(null); setQuizResult(null); }}
                    style={{
                      textAlign: 'left', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: 'none',
                      background: activeModuleIndex === idx && !activeQuiz ? 'var(--primary-light)' : 'none',
                      color: activeModuleIndex === idx && !activeQuiz ? 'var(--primary-dark)' : 'var(--text-main)',
                      fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between'
                    }}
                  >
                    <span>{mod.id}. {mod.title}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>

              {courseQuizzes.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>AI QUIZZES</span>
                  {courseQuizzes.map(quiz => (
                    <button
                      key={quiz.id}
                      onClick={() => handleStartQuiz(quiz)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: 'none',
                        background: activeQuiz?.id === quiz.id ? 'var(--secondary-light)' : 'none',
                        color: activeQuiz?.id === quiz.id ? 'var(--secondary-dark)' : 'var(--text-main)',
                        fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                      }}
                    >
                      ⚡ {quiz.title}
                    </button>
                  ))}
                </div>
              )}

              {courseAssignments.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>ASSIGNMENTS</span>
                  {courseAssignments.map(assign => (
                    <div 
                      key={assign.id}
                      style={{ fontSize: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>✏️ {assign.title}</span>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.65rem' }}>Due: {new Date(assign.due_date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Active module / Quiz interface */}
            <div className="glass-panel" style={{ padding: '2rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1rem', minHeight: '400px' }}>
              
              {/* QUIZ INTERFACE VIEW */}
              {activeQuiz && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary-dark)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                    🏆 Quiz: {activeQuiz.title}
                  </h3>

                  {quizResult ? (
                    /* Show Quiz Results */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'slide-up 0.3s' }}>
                      <div style={{ padding: '1.5rem', borderRadius: '0.75rem', background: quizResult.passed ? 'var(--success-light)' : 'var(--danger-light)', color: quizResult.passed ? 'var(--success)' : 'var(--danger)', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '1.5rem', color: 'inherit' }}>
                          {quizResult.passed ? '🎉 Passed!' : '😢 Try Again'}
                        </h4>
                        <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
                          Your Score: <strong>{quizResult.score} / {quizResult.total}</strong> (Passing: 50%+)
                        </p>
                        <p style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                          Points Rewarded: <strong>+{quizResult.points_earned} XP</strong> | New Streak: <strong>{quizResult.streak_updated} 🔥</strong>
                        </p>
                      </div>

                      <button 
                        onClick={() => { setActiveQuiz(null); setQuizResult(null); }}
                        style={{ padding: '0.65rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Return to Reading
                      </button>
                    </div>
                  ) : (
                    /* Quiz Questions Form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {JSON.parse(activeQuiz.questions_json).map((q, qIdx) => (
                        <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.95rem' }}>{qIdx+1}. {q.question}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                            {q.options.map((opt, optIdx) => (
                              <label key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: quizAnswers[qIdx] === optIdx ? 'var(--primary-light)' : 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                                <input
                                  type="radio"
                                  name={`question-${qIdx}`}
                                  checked={quizAnswers[qIdx] === optIdx}
                                  onChange={() => handleSelectAnswer(qIdx, optIdx)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                        <button 
                          disabled={quizLoading}
                          onClick={handleSubmitQuiz}
                          style={{ flex: 1, padding: '0.65rem', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          {quizLoading ? 'Submitting...' : 'Submit Answers'}
                        </button>
                        <button 
                          onClick={() => setActiveQuiz(null)}
                          style={{ padding: '0.65rem 1rem', border: '1px solid var(--border-color)', color: 'var(--text-light)', background: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LESSON READING VIEW */}
              {!activeQuiz && (
                <div>
                  {/* Module Content */}
                  {(() => {
                    const modules = JSON.parse(selectedCourse.modules_json);
                    const currentModule = modules[activeModuleIndex];
                    if (!currentModule) return <span>Loading module...</span>;
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'slide-up 0.3s' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: '4px', alignSelf: 'flex-start' }}>
                          Module {currentModule.id}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-slate)' }}>{currentModule.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', minHeight: '120px' }}>
                          {currentModule.content}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Course Assignments submissions Panel */}
                  {courseAssignments.length > 0 && (
                    <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Course Assignments Submission</h4>
                      
                      {submitSuccessMsg && (
                        <div style={{ padding: '0.6rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '0.5rem', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                          {submitSuccessMsg}
                        </div>
                      )}

                      {courseAssignments.map(assign => {
                        return (
                          <div key={assign.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.75rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>✏️ {assign.title}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Due: {new Date(assign.due_date).toLocaleDateString()}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{assign.description}</p>
                            
                            {/* Submit form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                              <textarea
                                placeholder="Paste your assignment submission text, source code, or hosting URL here..."
                                value={assignmentSolutions[assign.id] || ''}
                                onChange={e => setAssignmentSolutions(prev => ({ ...prev, [assign.id]: e.target.value }))}
                                rows="3"
                                style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                              />
                              <button
                                onClick={() => handleAssignmentSubmit(assign.id)}
                                style={{ alignSelf: 'flex-end', padding: '0.4rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}
                              >
                                Submit Solution
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
