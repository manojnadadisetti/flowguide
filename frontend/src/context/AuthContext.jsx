import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { onboardingService } from '../services/onboardingService';

const AuthContext = createContext(null);

const DEFAULT_MOCK_STEPS = [
  { id: "step-1", step_order: 1, title: "Welcome to FlowGuide", description: "Get started by learning what FlowGuide can do for you.", category: "profile", is_required: true, icon: "hand-wave", help_text: "Takes about 1 minute." },
  { id: "step-2", step_order: 2, title: "Complete Your Profile", description: "Add your name, role, and avatar to personalise your experience.", category: "profile", is_required: true, icon: "user-circle", help_text: "Your profile is visible to your team." },
  { id: "step-3", step_order: 3, title: "Verify Your Email", description: "Click the link sent to your inbox to activate your account.", category: "profile", is_required: true, icon: "mail-check", help_text: "Check spam if you don't see it." },
  { id: "step-4", step_order: 4, title: "Explore the Dashboard", description: "Take a quick tour of the main dashboard features.", category: "feature", is_required: false, icon: "layout", help_text: "You can revisit this tour anytime." },
  { id: "step-5", step_order: 5, title: "Set Up Notifications", description: "Choose how and when you want to receive alerts.", category: "feature", is_required: false, icon: "bell", help_text: "You can change these in Settings later." },
  { id: "step-6", step_order: 6, title: "Invite Your Team", description: "Add colleagues to collaborate inside FlowGuide.", category: "integration", is_required: false, icon: "users-plus", help_text: "They will receive an email invitation." },
  { id: "step-7", step_order: 7, title: "Connect Integrations", description: "Link your tools like Slack, Jira, or Google Workspace.", category: "integration", is_required: false, icon: "plug", help_text: "Integrations can be added anytime." },
  { id: "step-8", step_order: 8, title: "Onboarding Complete!", description: "You are all set. Start using FlowGuide to its full potential.", category: "feature", is_required: true, icon: "check-circle", help_text: "Congratulations on completing setup!" }
];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Onboarding state
  const [steps, setSteps] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const [activeStep, setActiveStep] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Trigger state refresh when token or demoMode changes
  useEffect(() => {
    checkConnectionAndLoad();
  }, [token, demoMode]);

  const checkConnectionAndLoad = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setDemoMode(false);
        if (token) {
          if (token === 'demo-token') {
            // Transitioning from demo to live backend: clear mock session
            localStorage.removeItem('token');
            setToken('');
            setCurrentUser(null);
          } else {
            await loadLiveSummary();
          }
        }
      } else {
        throw new Error();
      }
    } catch (_) {
      setDemoMode(true);
      if (token) {
        loadDemoSummary();
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Live Backend Operations
  // --------------------------------------------------
  const loadLiveSummary = async () => {
    try {
      const uData = await authService.getProfile();
      const sData = await onboardingService.getSummary();
      
      setCurrentUser(uData);
      
      const mappedSteps = sData.steps.map(item => ({
        id: item.step.id,
        step_order: item.step.step_order,
        title: item.step.title,
        description: item.step.description,
        category: item.step.category,
        is_required: item.step.is_required,
        icon: item.step.icon,
        help_text: item.step.help_text,
        status: item.progress ? item.progress.status : 'pending',
        notes: item.progress ? item.progress.notes : ''
      }));

      setSteps(mappedSteps);
      setTotalSteps(sData.total_steps);
      setCompletedSteps(sData.completed_steps);
      setPercentComplete(sData.percent_complete);

      const nextStep = mappedSteps.find(s => s.status !== 'completed' && s.status !== 'skipped') || mappedSteps[mappedSteps.length - 1];
      setActiveStep(nextStep);
    } catch (e) {
      console.error('Failed to load live data:', e);
      try {
        // Double check if backend is still reachable
        const testRes = await fetch('/api/health');
        if (testRes.ok) {
          // Backend is alive, but token is invalid/expired. Reset local token session but stay in live mode.
          localStorage.removeItem('token');
          setToken('');
          setCurrentUser(null);
        } else {
          // Backend is actually offline
          setDemoMode(true);
          loadDemoSummary();
        }
      } catch (_) {
        setDemoMode(true);
        loadDemoSummary();
      }
    }
  };

  // --------------------------------------------------
  // Demo Mode Local Operations
  // --------------------------------------------------
  const loadDemoSummary = () => {
    const mockUser = JSON.parse(localStorage.getItem('demo_user') || '{"full_name": "Friendly User", "email": "user@example.com", "avatar_url": "🦊", "role": "admin"}');
    setCurrentUser(mockUser);

    const progressMap = JSON.parse(localStorage.getItem('demo_progress') || '{}');
    const mapped = DEFAULT_MOCK_STEPS.map(step => {
      const prog = progressMap[step.id] || { status: 'pending', notes: '' };
      return { ...step, status: prog.status, notes: prog.notes };
    });

    setSteps(mapped);
    setTotalSteps(mapped.length);

    const completed = mapped.filter(s => s.status === 'completed').length;
    setCompletedSteps(completed);
    setPercentComplete(Math.round((completed / mapped.length) * 100));

    const nextStep = mapped.find(s => s.status !== 'completed' && s.status !== 'skipped') || mapped[mapped.length - 1];
    setActiveStep(nextStep);

    setAuditLogs(JSON.parse(localStorage.getItem('demo_audit_logs') || '[]'));
  };

  const addAuditLog = (action, entityId = '') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      entity_type: entityId ? 'onboarding_step' : 'user',
      entity_id: entityId,
      timestamp: new Date().toLocaleTimeString()
    };
    if (demoMode) {
      const logs = JSON.parse(localStorage.getItem('demo_audit_logs') || '[]');
      logs.unshift(newLog);
      localStorage.setItem('demo_audit_logs', JSON.stringify(logs));
      setAuditLogs(logs);
    } else {
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // --------------------------------------------------
  // Global Exposed Actions
  // --------------------------------------------------
  const login = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      if (demoMode) {
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('demo_user', JSON.stringify({
          full_name: 'Explorer Guest',
          email: email,
          avatar_url: '🦊',
          role: 'admin'
        }));
        setToken('demo-token');
        addAuditLog('USER_LOGIN');
        return true;
      } else {
        const data = await authService.login(email, password);
        setToken(data.access_token);
        addAuditLog('USER_LOGIN');
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, phoneNumber) => {
    setError('');
    setLoading(true);
    try {
      if (demoMode) {
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('demo_user', JSON.stringify({
          full_name: fullName,
          email: email,
          avatar_url: '🦊',
          role: 'admin',
          phone_number: phoneNumber
        }));
        // Seed initial progress for onboarding
        localStorage.setItem('demo_progress', JSON.stringify({
          'step-1': { status: 'in_progress', notes: 'Began onboarding.' }
        }));
        setToken('demo-token');
        addAuditLog('USER_REGISTERED');
        addAuditLog('USER_LOGIN');
        return true;
      } else {
        await authService.register(email, password, fullName, phoneNumber);
        addAuditLog('USER_REGISTERED');
        return true;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!demoMode) {
        await authService.logout();
      }
      addAuditLog('USER_LOGOUT');
    } catch (_) {}
    
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken('');
    setCurrentUser(null);
    setSteps([]);
    setActiveStep(null);
    setLoading(false);
  };

  const updateProfile = async (fullName, avatarUrl, phoneNumber) => {
    try {
      if (demoMode) {
        updateDemoProfile(fullName, avatarUrl, phoneNumber);
      } else {
        await authService.updateProfile(fullName, avatarUrl, phoneNumber);
        await loadLiveSummary();
        addAuditLog('PROFILE_UPDATED');
      }
      return true;
    } catch (e) {
      setError('Failed to update profile details.');
      return false;
    }
  };

  const updateDemoProfile = (fullName, avatarUrl, phoneNumber) => {
    const updatedUser = { ...currentUser, full_name: fullName, avatar_url: avatarUrl, phone_number: phoneNumber };
    localStorage.setItem('demo_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    addAuditLog('PROFILE_UPDATED');
  };

  const updateStepProgress = async (stepId, status, notes = '') => {
    try {
      if (demoMode) {
        const progressMap = JSON.parse(localStorage.getItem('demo_progress') || '{}');
        progressMap[stepId] = { status, notes, updated_at: new Date().toISOString() };
        localStorage.setItem('demo_progress', JSON.stringify(progressMap));
        addAuditLog(`STEP_${status.toUpperCase()}`, stepId);
        loadDemoSummary();
      } else {
        await onboardingService.updateProgress(stepId, status, notes);
        await loadLiveSummary();
        addAuditLog(`STEP_${status.toUpperCase()}`, stepId);
      }
      return true;
    } catch (e) {
      console.error('Failed to update step progress:', e);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        demoMode,
        setDemoMode,
        loading,
        error,
        setError,
        steps,
        totalSteps,
        completedSteps,
        percentComplete,
        activeStep,
        setActiveStep,
        auditLogs,
        login,
        register,
        logout,
        updateProfile,
        updateStepProgress,
        refreshData: checkConnectionAndLoad
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
