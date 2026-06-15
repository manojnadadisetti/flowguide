import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, BookOpen, GraduationCap, CheckCircle2, 
  Trash2, Plus, ArrowLeft, ClipboardList 
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { 
    adminStudents, courses, adminSubmissions, 
    gradeStudentSubmission, adminAddCourse, adminDeleteCourse 
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('students'); // students | courses | grading
  const [selectedSub, setSelectedSub] = useState(null);
  
  // Grading form states
  const [grade, setGrade] = useState('A');
  const [feedback, setFeedback] = useState('');
  const [gradeSuccessMsg, setGradeSuccessMsg] = useState('');

  // Course creation form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [modules, setModules] = useState([
    { id: 1, title: 'Introduction', content: 'Lesson content here...' }
  ]);
  const [courseSuccessMsg, setCourseSuccessMsg] = useState('');

  // Course Modules helper actions
  const handleAddModuleField = () => {
    const nextId = modules.length + 1;
    setModules([...modules, { id: nextId, title: '', content: '' }]);
  };

  const handleUpdateModule = (index, field, value) => {
    const updated = modules.map((m, idx) => {
      if (idx === index) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setModules(updated);
  };

  const handleRemoveModuleField = (index) => {
    if (modules.length === 1) return;
    const filtered = modules.filter((_, idx) => idx !== index);
    const updated = filtered.map((m, idx) => ({ ...m, id: idx + 1 }));
    setModules(updated);
  };

  // Submit Course
  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newCat.trim()) {
      alert('Please fill out all course details.');
      return;
    }
    
    // Check if any modules are empty
    if (modules.some(m => !m.title.trim() || !m.content.trim())) {
      alert('Please fill out all module titles and contents.');
      return;
    }

    const courseData = {
      title: newTitle,
      description: newDesc,
      category: newCat,
      level: newLevel,
      modules: modules
    };

    const ok = await adminAddCourse(courseData);
    if (ok) {
      setCourseSuccessMsg('Course created and published successfully! 🎓');
      setTimeout(() => setCourseSuccessMsg(''), 4000);
      setNewTitle('');
      setNewDesc('');
      setNewCat('');
      setNewLevel('Beginner');
      setModules([{ id: 1, title: 'Introduction', content: 'Lesson content here...' }]);
    }
  };

  // Submit Grade
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    const ok = await gradeStudentSubmission(selectedSub.id, grade, feedback);
    if (ok) {
      setGradeSuccessMsg('Student assignment graded successfully! ✓');
      setTimeout(() => setGradeSuccessMsg(''), 4000);
      setSelectedSub(null);
      setGrade('A');
      setFeedback('');
    }
  };

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '2rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', alignItems: 'center', padding: '0.4rem' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-slate)' }}>Academic Admin Desk</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Manage learning tracks, grade submissions, and analyze student academic statistics.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
          <button 
            onClick={() => setActiveSubTab('students')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
              background: activeSubTab === 'students' ? '#fff' : 'none',
              color: activeSubTab === 'students' ? 'var(--primary-dark)' : 'var(--text-light)',
              fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <Users size={16} /> Students
          </button>
          <button 
            onClick={() => setActiveSubTab('courses')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
              background: activeSubTab === 'courses' ? '#fff' : 'none',
              color: activeSubTab === 'courses' ? 'var(--primary-dark)' : 'var(--text-light)',
              fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <BookOpen size={16} /> Courses
          </button>
          <button 
            onClick={() => setActiveSubTab('grading')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
              background: activeSubTab === 'grading' ? '#fff' : 'none',
              color: activeSubTab === 'grading' ? 'var(--primary-dark)' : 'var(--text-light)',
              fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <GraduationCap size={16} /> Grading Desk
          </button>
        </div>
      </div>

      {/* STUDENT DIRECTORY VIEW */}
      {activeSubTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Registered Students ({adminStudents.length})</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                <th style={{ padding: '0.75rem 1rem' }}>Interests</th>
                <th style={{ padding: '0.75rem 1rem' }}>Skill level</th>
                <th style={{ padding: '0.75rem 1rem' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {adminStudents.filter(s => s.role !== 'admin').map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{student.full_name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.email}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-light)' }}>{student.phone_number || 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {(student.interests || 'None').split(', ').map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{student.skill_level}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold' }}>💎 {student.total_points} XP</span>
                    <span style={{ marginLeft: '0.5rem', color: '#fb7185', fontWeight: 'bold' }}>🔥 {student.streak_count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* COURSE MANAGER VIEW */}
      {activeSubTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Creator Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Create New Course</h3>
            {courseSuccessMsg && (
              <div style={{ padding: '0.75rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {courseSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateCourseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js App Router"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ width: '150px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React"
                    value={newCat}
                    onChange={e => setNewCat(e.target.value)}
                    style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Course Description</label>
                <textarea
                  required
                  placeholder="Explain course learning objectives..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows="2"
                  style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Target Skill Level</label>
                <select 
                  value={newLevel} 
                  onChange={e => setNewLevel(e.target.value)}
                  style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Modules List inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Lesson Modules</label>
                  <button 
                    type="button" 
                    onClick={handleAddModuleField}
                    style={{ padding: '0.25rem 0.5rem', background: 'var(--primary-light)', border: 'none', color: 'var(--primary-dark)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    <Plus size={12} /> Add Module
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {modules.map((m, index) => (
                    <div key={index} style={{ border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Module {m.id}</span>
                        {modules.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveModuleField(index)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Module Title"
                        required
                        value={m.title}
                        onChange={e => handleUpdateModule(index, 'title', e.target.value)}
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem', outline: 'none' }}
                      />
                      <textarea
                        placeholder="Lesson Content (Concepts / Tutorials)..."
                        required
                        value={m.content}
                        onChange={e => handleUpdateModule(index, 'content', e.target.value)}
                        rows="2"
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                style={{ padding: '0.6rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                Publish Learning Path 🚀
              </button>
            </form>
          </div>

          {/* List current courses with delete action */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Active Paths ({courses.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
              {courses.map(c => (
                <div key={c.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem' }}>{c.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Category: {c.category} | Level: {c.level}</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${c.title}"?`)) {
                        adminDeleteCourse(c.id);
                      }
                    }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.4rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GRADING DESK VIEW */}
      {activeSubTab === 'grading' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Submission list */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pending Student Submissions ({adminSubmissions.filter(s => s.status === 'pending').length})</h3>
            {adminSubmissions.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No submissions found.</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {adminSubmissions.map(sub => (
                  <div 
                    key={sub.id} 
                    onClick={() => { setSelectedSub(sub); setGrade(sub.grade || 'A'); setFeedback(sub.feedback || ''); }}
                    style={{
                      padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem',
                      background: selectedSub?.id === sub.id ? 'var(--primary-light)' : '#f8fafc',
                      cursor: 'pointer', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.85rem' }}>{sub.assignment.title}</h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>By: {sub.user.full_name} | {sub.user.email}</span>
                    </div>
                    <span style={{
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold',
                      background: sub.status === 'graded' ? 'var(--success-light)' : 'var(--warning-light)',
                      color: sub.status === 'graded' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {sub.status === 'graded' ? `Graded: ${sub.grade}` : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grading Form */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Grading Console</h3>
            {gradeSuccessMsg && (
              <div style={{ padding: '0.75rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                {gradeSuccessMsg}
              </div>
            )}

            {selectedSub ? (
              <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem' }}>Submitting: {selectedSub.assignment.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Student: {selectedSub.user.full_name} ({selectedSub.user.email})</span>
                  {selectedSub.user.phone_number && <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Phone: {selectedSub.user.phone_number}</span>}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.25rem' }}>SOLUTION CODE/TEXT:</span>
                  <div style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem', padding: '1rem', borderRadius: '0.5rem', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {selectedSub.submission_text}
                  </div>
                </div>

                <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Assign Grade</label>
                    <select 
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', background: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="A">Grade A (Excellent +150 XP)</option>
                      <option value="B">Grade B (Good +150 XP)</option>
                      <option value="C">Grade C (Pass +150 XP)</option>
                      <option value="F">Grade F (Fail)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Detailed Feedback</label>
                    <textarea
                      required
                      placeholder="Add guidance, review comments, or tips to improve..."
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      rows="3"
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{ padding: '0.6rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Submit Grade & Reward XP
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ border: '1px dashed var(--border-color)', padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-light)', borderRadius: '1rem', fontSize: '0.85rem' }}>
                Select a student submission from the left panel to review and apply grading feedback.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
