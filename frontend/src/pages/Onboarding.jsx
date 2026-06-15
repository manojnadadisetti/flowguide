import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, BookOpen, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const AVATARS = ['🦊', '🐼', '🐨', '🦄', '🤖', '🦁', '🦖', '🐙'];
const INTEREST_OPTIONS = [
  "Web Development",
  "Python Programming",
  "Machine Learning",
  "Computer Science & DSA",
  "UX/UI Design"
];

export default function Onboarding({ onTriggerConfetti, onNavigate }) {
  const { currentUser, updateProfile } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1: Profile Setup
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('🦊');

  // Step 2: Interests & Skill Level
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [skillLevel, setSkillLevel] = useState('Beginner');

  // Step 3: Planner
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [studyDays, setStudyDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.full_name || '');
      setPhone(currentUser.phone_number || '');
      setAvatar(currentUser.avatar_url || '🦊');
      if (currentUser.interests) {
        setSelectedInterests(currentUser.interests.split(', ').filter(Boolean));
      }
      setSkillLevel(currentUser.skill_level || 'Beginner');
      setDailyMinutes(currentUser.daily_target_minutes || 30);
    }
  }, [currentUser]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleDay = (day) => {
    if (studyDays.includes(day)) {
      setStudyDays(studyDays.filter(d => d !== day));
    } else {
      setStudyDays([...studyDays, day]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    const interestStr = selectedInterests.join(', ');
    const ok = await updateProfile(name, avatar, phone, interestStr, skillLevel, dailyMinutes);
    if (ok) {
      onTriggerConfetti();
      onNavigate('dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', width: '100%' }}>
      {/* Progress Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--dark-slate)' }}>Setup Academic Path</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: s === step ? 'var(--primary)' : s < step ? 'var(--success)' : 'var(--border-color)',
                color: s <= step ? 'white' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content Panel */}
      <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', background: '#fff', border: 'none', boxShadow: 'var(--card-shadow)', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <div>
          {/* STEP 1: Profile Details */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={24} style={{ color: 'var(--primary)' }} /> Setup Student Profile
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Introduce yourself and choose your study avatar buddy.</p>
              </div>

              {/* Avatar Preset List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Choose Avatar</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {AVATARS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      style={{
                        fontSize: '2rem',
                        padding: '0.5rem',
                        borderRadius: '0.75rem',
                        border: avatar === emoji ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: avatar === emoji ? 'var(--primary-light)' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '54px',
                        height: '54px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Interests & Skill Levels */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={24} style={{ color: 'var(--secondary)' }} /> Learning Interests
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Select what you want to learn so we can recommend the best courses.</p>
              </div>

              {/* Interests toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Select Topics</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {INTEREST_OPTIONS.map(opt => {
                    const active = selectedInterests.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        style={{
                          padding: '0.6rem 1.2rem',
                          borderRadius: '99px',
                          border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          background: active ? 'var(--primary)' : '#fff',
                          color: active ? 'white' : 'var(--text-main)',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt} {active ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skill level selections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Your Skill Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setSkillLevel(lvl)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: skillLevel === lvl ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: skillLevel === lvl ? 'var(--primary-light)' : '#fff',
                        color: skillLevel === lvl ? 'var(--primary-dark)' : 'var(--text-main)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Planner Target */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={24} style={{ color: 'var(--info)' }} /> Study Plan Targets
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Set your daily studying time goal and choose your preferred study schedule.</p>
              </div>

              {/* Daily minutes slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Daily Study Time</label>
                  <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{dailyMinutes} Minutes</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={dailyMinutes}
                  onChange={e => setDailyMinutes(parseInt(e.target.value))}
                  style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '99px', outline: 'none', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Days selection checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Study Days</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem', marginTop: '0.25rem' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = studyDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          border: active ? '1px solid var(--info)' : '1px solid var(--border-color)',
                          background: active ? 'var(--info)' : '#fff',
                          color: active ? 'white' : 'var(--text-main)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {day[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard buttons footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem' }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                background: 'none',
                color: 'var(--text-light)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'var(--primary)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}
            >
              Complete Setup 🎉
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
