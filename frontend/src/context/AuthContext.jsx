import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { request } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_MOCK_COURSES = [
  {
    id: "course-1",
    title: "Frontend Web Development",
    description: "Learn HTML, CSS, JavaScript, and React to build clean and responsive user interfaces.",
    category: "Web Development",
    level: "Beginner",
    modules_json: JSON.stringify([
      {id: 1, title: "Introduction to HTML & CSS", content: "HTML structures web pages while CSS decorates them. Learn elements, styling, and basic page structures."},
      {id: 2, title: "Responsive Layouts & Flexbox", content: "Build modern layouts that adjust automatically. Master CSS Flexbox and Grid layout systems."},
      {id: 3, title: "JavaScript Essentials", content: "Add interactivity! Learn variables, functions, DOM manipulation, arrays, and async execution."},
      {id: 4, title: "Building with React", content: "Understand component-based architectures. Master state, hooks, props, and rendering."}
    ])
  },
  {
    id: "course-2",
    title: "Python Programming Foundations",
    description: "Master Python syntax, core data types, logic flows, functions, and file management.",
    category: "Programming Languages",
    level: "Beginner",
    modules_json: JSON.stringify([
      {id: 1, title: "Python Syntax & Variables", content: "Variables, strings, integers, floats, booleans, and print formatting."},
      {id: 2, title: "Control Flows & Loops", content: "Conditional if-elif-else execution, and while/for loops."},
      {id: 3, title: "Functions & Modules", content: "Define modular code, accept parameters, return results, and import standard modules."},
      {id: 4, title: "File I/O & Error Handling", content: "Reading/writing text files, and handling exceptions with try/except."}
    ])
  },
  {
    id: "course-3",
    title: "Introduction to Machine Learning",
    description: "Get started with statistical algorithms, linear regressions, classifiers, and decision trees.",
    category: "Machine Learning",
    level: "Intermediate",
    modules_json: JSON.stringify([
      {id: 1, title: "Introduction to ML", content: "Supervised vs Unsupervised learning. Learn what features, labels, training sets, and test sets are."},
      {id: 2, title: "Linear Regression & Classification", content: "Predict numerical variables with regression and categorical variables with Logistic Regression."},
      {id: 3, title: "Decision Trees & Random Forests", content: "Build tree classifiers and scale them into forest ensembles for robust prediction accuracy."},
      {id: 4, title: "Clustering & Neural Networks", content: "Unsupervised K-means clustering, and deep artificial neural network concepts."}
    ])
  },
  {
    id: "course-4",
    title: "Data Structures & Algorithms",
    description: "Explore Big O notation, lists, stacks, trees, sorting algorithms, and graphing algorithms.",
    category: "Computer Science",
    level: "Intermediate",
    modules_json: JSON.stringify([
      {id: 1, title: "Big O Notation & Arrays", content: "Determine run-time complexity. Understand array lists and static memories."},
      {id: 2, title: "Linked Lists, Stacks & Queues", content: "Linked dynamic nodes, LIFO stacks, FIFO queues, and implementation rules."},
      {id: 3, title: "Trees & Graphs", content: "Binary search trees, traversal algorithms (in-order, pre-order, post-order), and graph representations."},
      {id: 4, title: "Sorting & Searching Algorithms", content: "Quick sort, merge sort, binary search, and recursive search strategies."}
    ])
  },
  {
    id: "course-5",
    title: "UX/UI Design Principles",
    description: "Discover user research, Figma prototyping, typography hierarchies, and usability testing.",
    category: "Design",
    level: "Beginner",
    modules_json: JSON.stringify([
      {id: 1, title: "What is UX/UI Design?", "content": "User experience vs User Interface. Focus on user empathy, persona creation, and design systems."},
      {id: 2, title: "Color Theory & Typography", "content": "Understand contrast, primary/secondary palettes, and visual hierarchy using modern text fonts."},
      {id: 3, title: "Wireframing & Prototyping in Figma", "content": "Construct low-fidelity sketches and turn them into clickable high-fidelity interactive screens."},
      {id: 4, title: "Usability Testing", "content": "Collect user feedback, run A/B testing, and iterate designs based on customer interactions."}
    ])
  }
];

const DEFAULT_MOCK_QUIZZES = {
  "course-1": [
    {
      id: "quiz-1",
      course_id: "course-1",
      title: "Frontend Basics Quiz",
      questions_json: JSON.stringify([
        {question: "Which CSS property is used to align items inside a Flexbox container along the main axis?", options: ["align-items", "justify-content", "align-content", "display-flex"], answer_idx: 1},
        {question: "What hook is used to handle local state in a React functional component?", options: ["useEffect", "useContext", "useState", "useReducer"], answer_idx: 2},
        {question: "Which HTML tag is used to embed client-side JavaScript code?", options: ["<script>", "<js>", "<javascript>", "<code-box>"], answer_idx: 0}
      ])
    }
  ],
  "course-2": [
    {
      id: "quiz-2",
      course_id: "course-2",
      title: "Python Foundations Quiz",
      questions_json: JSON.stringify([
        {question: "How do you declare a function in Python?", options: ["function myFunc():", "def myFunc():", "void myFunc():", "declare myFunc():"], answer_idx: 1},
        {question: "Which data structure is ordered and mutable in Python?", options: ["Tuple", "Set", "List", "Dictionary"], answer_idx: 2},
        {question: "What keyword is used to handle exceptions in Python?", options: ["catch", "except", "error", "handle"], answer_idx: 1}
      ])
    }
  ],
  "course-3": [
    {
      id: "quiz-3",
      course_id: "course-3",
      title: "ML Fundamentals Quiz",
      questions_json: JSON.stringify([
        {question: "Is linear regression supervised or unsupervised learning?", options: ["Supervised", "Unsupervised", "Semi-supervised", "Reinforcement"], answer_idx: 0},
        {question: "Which evaluation metric is commonly used for classification tasks?", options: ["Mean Squared Error (MSE)", "R-squared", "Accuracy", "Mean Absolute Error"], answer_idx: 2}
      ])
    }
  ],
  "course-4": [
    {
      id: "quiz-4",
      course_id: "course-4",
      title: "DSA Core Concepts Quiz",
      questions_json: JSON.stringify([
        {question: "What is the time complexity of searching in a balanced Binary Search Tree?", options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"], answer_idx: 2},
        {question: "Which data structure operates on a Last In First Out (LIFO) basis?", options: ["Queue", "Stack", "Heap", "Graph"], answer_idx: 1}
      ])
    }
  ],
  "course-5": [
    {
      id: "quiz-5",
      course_id: "course-5",
      title: "Design Principles Quiz",
      questions_json: JSON.stringify([
        {question: "What does UI stand for in design?", options: ["User Interaction", "User Interface", "User Integration", "Unique Identity"], answer_idx: 1},
        {question: "Which of these represents a low-fidelity draft of a layout?", options: ["Interactive Prototype", "High-fidelity design", "Wireframe", "Color palette specification"], answer_idx: 2}
      ])
    }
  ]
};

const DEFAULT_MOCK_ASSIGNMENTS = {
  "course-1": [
    {id: "assign-1", course_id: "course-1", title: "Build a Personal Portfolio", description: "Create a clean, responsive single-page portfolio using HTML and CSS showing your bio, skills, and projects.", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
  ],
  "course-2": [
    {id: "assign-2", course_id: "course-2", title: "Command Line Calculator", description: "Build a terminal-based calculator in Python that loops, requests numbers, performs operations (+, -, *, /), and handles division by zero errors.", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
  ],
  "course-3": [
    {id: "assign-3", course_id: "course-3", title: "Train a House Price Predictor", description: "Use a simple Python script with scikit-learn to load pricing datasets, split train/test, train a Linear Regression model, and print accuracy metrics.", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
  ],
  "course-4": [
    {id: "assign-4", course_id: "course-4", title: "Implement a Binary Search Tree", description: "Write a class in Python or JS representing a BST node, and implement an insert and search function recursively.", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
  ],
  "course-5": [
    {id: "assign-5", course_id: "course-5", title: "Design a Mobile Study App", description: "Sketch a wireframe layout or describe the user flow for a student mobile learning app containing a login, course, and quiz screen.", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
  ]
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Learning states
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [plannerTasks, setPlannerTasks] = useState([]);
  const [adminSubmissions, setAdminSubmissions] = useState([]);
  const [adminStudents, setAdminStudents] = useState([]);

  // Check backend connection and sync modes
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
            localStorage.removeItem('token');
            setToken('');
            setCurrentUser(null);
          } else {
            await loadLiveData();
          }
        }
      } else {
        throw new Error();
      }
    } catch (_) {
      setDemoMode(true);
      if (token) {
        loadDemoData();
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Live Backend Operations
  // --------------------------------------------------
  const loadLiveData = async () => {
    try {
      // 1. Load user profile (critical path)
      let uData;
      try {
        uData = await authService.getProfile();
        setCurrentUser(uData);
      } catch (e) {
        console.error('Failed to load user profile from Spring Boot:', e);
        throw e; // Reraise to trigger auth failure flow if profile cannot be loaded
      }

      // 2. Load courses and enrollments from FastAPI (critical path)
      const allCourses = await request('/api/courses');
      setCourses(allCourses);

      const myEnrollments = await request('/api/courses/my-courses');
      setEnrolledCourses(myEnrollments);

      // 3. Load planner tasks from Node.js (non-critical path, fault-tolerant)
      try {
        const tasks = await request('/api/planner');
        setPlannerTasks(tasks);
      } catch (e) {
        console.warn('Failed to load planner tasks from Node.js service:', e);
        setPlannerTasks([]); // Fallback to empty list
      }

      // 4. Load Admin features (optional paths)
      if (uData && uData.role === 'admin') {
        try {
          const subs = await request('/api/assignments/submissions');
          setAdminSubmissions(subs);
        } catch (e) {
          console.warn('Failed to load submissions:', e);
          setAdminSubmissions([]);
        }

        try {
          const studs = await request('/api/users');
          setAdminStudents(studs);
        } catch (e) {
          console.warn('Failed to load students directory from Spring Boot:', e);
          setAdminStudents([]);
        }
      }
    } catch (e) {
      console.error('Failed to load live academic data:', e);
      try {
        const testRes = await fetch('/api/health');
        if (testRes.ok) {
          // If the gateway is running, and the profile request failed, it means auth is invalid
          localStorage.removeItem('token');
          setToken('');
          setCurrentUser(null);
        } else {
          setDemoMode(true);
          loadDemoData();
        }
      } catch (_) {
        setDemoMode(true);
        loadDemoData();
      }
    }
  };

  // --------------------------------------------------
  // Demo Mode Local Operations (LocalStorage fallback)
  // --------------------------------------------------
  const loadDemoData = () => {
    const mockUser = JSON.parse(
      localStorage.getItem('demo_user') || 
      '{"full_name": "Friendly Student", "email": "student@academy.edu", "avatar_url": "🦊", "role": "user", "interests": "Web Development, Machine Learning", "skill_level": "Beginner", "streak_count": 3, "total_points": 350, "daily_target_minutes": 30, "phone_number": "+1 (555) 019-2834"}'
    );
    setCurrentUser(mockUser);

    // Initialise LocalStorage databases if empty
    if (!localStorage.getItem('db_courses')) {
      localStorage.setItem('db_courses', JSON.stringify(DEFAULT_MOCK_COURSES));
    }
    const localCourses = JSON.parse(localStorage.getItem('db_courses'));
    setCourses(localCourses);

    if (!localStorage.getItem('db_enrollments')) {
      // Enroll in course 1 by default
      const defaultEnroll = [
        {
          id: "enroll-1",
          course_id: "course-1",
          progress: 25,
          status: "enrolled",
          course: localCourses[0]
        }
      ];
      localStorage.setItem('db_enrollments', JSON.stringify(defaultEnroll));
    }
    setEnrolledCourses(JSON.parse(localStorage.getItem('db_enrollments')));

    if (!localStorage.getItem('db_planner')) {
      const defaultPlanner = [
        { id: "task-1", task: "Review JavaScript Flexbox notes", target_date: new Date().toISOString(), is_completed: false, created_at: new Date().toISOString() },
        { id: "task-2", task: "Take CSS Layouts Quiz", target_date: new Date().toISOString(), is_completed: true, created_at: new Date().toISOString() }
      ];
      localStorage.setItem('db_planner', JSON.stringify(defaultPlanner));
    }
    setPlannerTasks(JSON.parse(localStorage.getItem('db_planner')));

    if (!localStorage.getItem('db_submissions')) {
      const defaultSub = [
        {
          id: "sub-1",
          assignment_id: "assign-1",
          user_id: "mock-student-id",
          submission_text: "Here is my portfolio link: https://myportfolio.github.io. I used HTML semantic tags and Flexbox for grid alignments.",
          status: "pending",
          grade: null,
          feedback: null,
          submitted_at: new Date().toISOString(),
          user: { full_name: "Friendly Student", email: "student@academy.edu", phone_number: "+1 (555) 019-2834" },
          assignment: { title: "Build a Personal Portfolio", course_id: "course-1" }
        }
      ];
      localStorage.setItem('db_submissions', JSON.stringify(defaultSub));
    }
    setAdminSubmissions(JSON.parse(localStorage.getItem('db_submissions')));

    if (!localStorage.getItem('db_students')) {
      const defaultStudents = [
        { id: "stud-1", full_name: "Friendly Student", email: "student@academy.edu", phone_number: "+1 (555) 019-2834", interests: "Web Development, Python", skill_level: "Beginner", streak_count: 3, total_points: 250, daily_target_minutes: 30, role: "user" },
        { id: "stud-2", full_name: "Emma Watson", email: "emma.watson@oxford.edu", phone_number: "+44 (770) 090-0077", interests: "Machine Learning, DSA", skill_level: "Intermediate", streak_count: 5, total_points: 620, daily_target_minutes: 45, role: "user" }
      ];
      localStorage.setItem('db_students', JSON.stringify(defaultStudents));
    }
    setAdminStudents(JSON.parse(localStorage.getItem('db_students')));
  };

  // --------------------------------------------------
  // Global Actions
  // --------------------------------------------------
  const login = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      if (demoMode) {
        localStorage.setItem('token', 'demo-token');
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
        const mockUser = {
          full_name: role === 'admin' ? 'Academy Admin' : 'Friendly Student',
          email: email,
          avatar_url: role === 'admin' ? '🤖' : '🦊',
          role: role,
          interests: role === 'admin' ? 'Teaching' : 'Web Development, Python',
          skill_level: 'Beginner',
          streak_count: role === 'admin' ? 0 : 3,
          total_points: role === 'admin' ? 1000 : 250,
          daily_target_minutes: 30,
          phone_number: "+1 (555) 019-2834"
        };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        setToken('demo-token');
        return true;
      } else {
        const data = await authService.login(email, password);
        setToken(data.access_token);
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
        const mockUser = {
          full_name: fullName,
          email: email,
          avatar_url: '🦊',
          role: 'user',
          interests: '',
          skill_level: 'Beginner',
          streak_count: 1,
          total_points: 50,
          daily_target_minutes: 30,
          phone_number: phoneNumber
        };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        localStorage.setItem('db_enrollments', '[]');
        setToken('demo-token');
        return true;
      } else {
        await authService.register(email, password, fullName, phoneNumber);
        // Automatically sign in after registering
        const data = await authService.login(email, password);
        setToken(data.access_token);
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
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken('');
    setCurrentUser(null);
    setEnrolledCourses([]);
    setPlannerTasks([]);
    setAdminSubmissions([]);
    setLoading(false);
  };

  const updateProfile = async (fullName, avatarUrl, phoneNumber, interests = '', skillLevel = 'Beginner', dailyTarget = 30) => {
    try {
      if (demoMode) {
        const updated = { 
          ...currentUser, 
          full_name: fullName, 
          avatar_url: avatarUrl, 
          phone_number: phoneNumber,
          interests,
          skill_level: skillLevel,
          daily_target_minutes: dailyTarget
        };
        localStorage.setItem('demo_user', JSON.stringify(updated));
        setCurrentUser(updated);
      } else {
        await authService.updateProfile(fullName, avatarUrl, phoneNumber);
        await request('/api/users/me', {
          method: 'PATCH',
          body: JSON.stringify({
            interests,
            skill_level: skillLevel,
            daily_target_minutes: dailyTarget
          })
        });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      setError(e.message || 'Failed to update profile details.');
      return false;
    }
  };

  // --- Course Enrollments ---
  const enrollInCourse = async (courseId) => {
    try {
      if (demoMode) {
        const localEnrollments = JSON.parse(localStorage.getItem('db_enrollments') || '[]');
        if (localEnrollments.some(e => e.course_id === courseId)) return true;

        const targetCourse = courses.find(c => c.id === courseId);
        const newEnroll = {
          id: `enroll-${Math.random().toString(36).substr(2, 9)}`,
          course_id: courseId,
          progress: 0,
          status: "enrolled",
          course: targetCourse
        };
        const updated = [...localEnrollments, newEnroll];
        localStorage.setItem('db_enrollments', JSON.stringify(updated));
        setEnrolledCourses(updated);
      } else {
        await request(`/api/courses/${courseId}/enroll`, { method: 'POST' });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // --- Quizzes ---
  const fetchQuizzes = async (courseId) => {
    if (demoMode) {
      const q = DEFAULT_MOCK_QUIZZES[courseId] || [];
      return q;
    } else {
      return request(`/api/quizzes/course/${courseId}`);
    }
  };

  const submitQuizAnswers = async (quizId, answers, courseId) => {
    try {
      if (demoMode) {
        const quizList = Object.values(DEFAULT_MOCK_QUIZZES).flat();
        const quiz = quizList.find(q => q.id === quizId);
        if (!quiz) return null;

        const questions = JSON.parse(quiz.questions_json);
        let score = 0;
        questions.forEach((q, idx) => {
          if (answers[idx] === q.answer_idx) score++;
        });

        const total = questions.length;
        const passed = score >= (total / 2);
        const points = passed ? 50 + (score * 10) : 10;

        // Reward points and streak in demo user
        const updatedUser = { 
          ...currentUser, 
          total_points: currentUser.total_points + points,
          streak_count: currentUser.streak_count + 1
        };
        localStorage.setItem('demo_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        // Update enrollment progress
        const localEnroll = JSON.parse(localStorage.getItem('db_enrollments') || '[]');
        const updatedEnroll = localEnroll.map(e => {
          if (e.course_id === courseId) {
            const nextProg = Math.min(e.progress + 25, 100);
            return { ...e, progress: nextProg, status: nextProg === 100 ? 'completed' : 'enrolled' };
          }
          return e;
        });
        localStorage.setItem('db_enrollments', JSON.stringify(updatedEnroll));
        setEnrolledCourses(updatedEnroll);

        return { score, total, points_earned: points, streak_updated: updatedUser.streak_count, passed };
      } else {
        const response = await request(`/api/quizzes/${quizId}/submit`, {
          method: 'POST',
          body: JSON.stringify({ answers })
        });
        await loadLiveData();
        return response;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // --- Assignments ---
  const fetchAssignments = async (courseId) => {
    if (demoMode) {
      return DEFAULT_MOCK_ASSIGNMENTS[courseId] || [];
    } else {
      return request(`/api/assignments/course/${courseId}`);
    }
  };

  const submitAssignmentSolution = async (assignmentId, submissionText, courseId) => {
    try {
      if (demoMode) {
        const assignmentsList = Object.values(DEFAULT_MOCK_ASSIGNMENTS).flat();
        const assign = assignmentsList.find(a => a.id === assignmentId);
        if (!assign) return false;

        const subs = JSON.parse(localStorage.getItem('db_submissions') || '[]');
        
        // Remove prior submissions
        const filtered = subs.filter(s => !(s.assignment_id === assignmentId && s.user_id === 'mock-student-id'));
        
        const newSub = {
          id: `sub-${Math.random().toString(36).substr(2, 9)}`,
          assignment_id: assignmentId,
          user_id: "mock-student-id",
          submission_text: submissionText,
          status: "pending",
          grade: null,
          feedback: null,
          submitted_at: new Date().toISOString(),
          user: { full_name: currentUser.full_name, email: currentUser.email, phone_number: currentUser.phone_number },
          assignment: { title: assign.title, course_id: courseId }
        };

        const updated = [newSub, ...filtered];
        localStorage.setItem('db_submissions', JSON.stringify(updated));
        setAdminSubmissions(updated);

        // Boost course progress slightly on submit
        const localEnroll = JSON.parse(localStorage.getItem('db_enrollments') || '[]');
        const updatedEnroll = localEnroll.map(e => {
          if (e.course_id === courseId) {
            const nextProg = Math.min(e.progress + 15, 100);
            return { ...e, progress: nextProg, status: nextProg === 100 ? 'completed' : 'enrolled' };
          }
          return e;
        });
        localStorage.setItem('db_enrollments', JSON.stringify(updatedEnroll));
        setEnrolledCourses(updatedEnroll);

        return true;
      } else {
        await request(`/api/assignments/${assignmentId}/submit`, {
          method: 'POST',
          body: JSON.stringify({ submission_text: submissionText })
        });
        await loadLiveData();
        return true;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // --- Daily Study Planner ---
  const addPlannerTask = async (taskText, dateStr) => {
    try {
      if (demoMode) {
        const localPlanner = JSON.parse(localStorage.getItem('db_planner') || '[]');
        const newTask = {
          id: `task-${Math.random().toString(36).substr(2, 9)}`,
          task: taskText,
          target_date: dateStr,
          is_completed: false,
          created_at: new Date().toISOString()
        };
        const updated = [...localPlanner, newTask];
        localStorage.setItem('db_planner', JSON.stringify(updated));
        setPlannerTasks(updated);
      } else {
        await request('/api/planner', {
          method: 'POST',
          body: JSON.stringify({ task: taskText, target_date: dateStr })
        });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const togglePlannerTask = async (taskId) => {
    try {
      if (demoMode) {
        const localPlanner = JSON.parse(localStorage.getItem('db_planner') || '[]');
        const updated = localPlanner.map(t => {
          if (t.id === taskId) {
            return { ...t, is_completed: !t.is_completed };
          }
          return t;
        });
        localStorage.setItem('db_planner', JSON.stringify(updated));
        setPlannerTasks(updated);
      } else {
        await request(`/api/planner/${taskId}`, { method: 'PATCH' });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deletePlannerTask = async (taskId) => {
    try {
      if (demoMode) {
        const localPlanner = JSON.parse(localStorage.getItem('db_planner') || '[]');
        const updated = localPlanner.filter(t => t.id !== taskId);
        localStorage.setItem('db_planner', JSON.stringify(updated));
        setPlannerTasks(updated);
      } else {
        await request(`/api/planner/${taskId}`, { method: 'DELETE' });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // --- AI Chatbot Interface ---
  const sendChatMessage = async (msgText) => {
    if (demoMode) {
      // Local keyword responses
      const q = msgText.toLowerCase();
      let ans = "";
      if (q.includes('portfolio')) {
        ans = "### 🎨 Personal Portfolio Tip\nStructure your portfolio with a semantic header, about section, projects grid, and simple CSS.\n```html\n<header>\n  <h1>Jane's Portfolio</h1>\n</header>\n```";
      } else if (q.includes('calculator')) {
        ans = "### 🐍 Python Calculator Hint\nUse functions for each operation and a `while True` loop to collect entries.\n```python\ndef add(a, b): return a + b\n```";
      } else if (q.includes('regression') || q.includes('ml')) {
        ans = "### 🤖 ML - Regression notes\nLinear regressions predict continuous targets $Y = \\beta_0 + \\beta_1 X$. Train them in Python using `LinearRegression().fit(X, y)`.";
      } else if (q.includes('dsa') || q.includes('tree') || q.includes('bst')) {
        ans = "### 🌳 DSA BST Binary Search Tree\nNodes on the left are smaller; nodes on the right are larger. Search is $O(\\log N)$ on average.";
      } else if (q.includes('notes') || q.includes('javascript')) {
        ans = "### 📚 JS quick notes\n`const` is block-scoped and immutable; `let` is block-scoped and mutable. Avoid `var`.";
      } else {
        ans = `Hello! I am your student assistant. I recommend exploring courses like Python, Web Development, or Machine Learning. Ask me about coding examples!`;
      }
      return ans;
    } else {
      const response = await request('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ query: msgText })
      });
      return response.answer;
    }
  };

  // --- Admin Grading Desk ---
  const gradeStudentSubmission = async (submissionId, grade, feedback) => {
    try {
      if (demoMode) {
        const subs = JSON.parse(localStorage.getItem('db_submissions') || '[]');
        const updated = subs.map(s => {
          if (s.id === submissionId) {
            // Reward points to student in demo user if they passed
            if (["A", "B", "C", "PASS"].includes(grade.toUpperCase())) {
              const demoUser = JSON.parse(localStorage.getItem('demo_user'));
              if (demoUser) {
                demoUser.total_points += 150;
                localStorage.setItem('demo_user', JSON.stringify(demoUser));
                if (currentUser.role !== 'admin') {
                  setCurrentUser(demoUser);
                }
              }
            }
            return { ...s, grade, feedback, status: "graded" };
          }
          return s;
        });
        localStorage.setItem('db_submissions', JSON.stringify(updated));
        setAdminSubmissions(updated);
      } else {
        await request(`/api/assignments/submissions/${submissionId}/grade`, {
          method: 'POST',
          body: JSON.stringify({ grade, feedback })
        });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // --- Admin Course Management ---
  const adminAddCourse = async (courseData) => {
    try {
      if (demoMode) {
        const localCourses = JSON.parse(localStorage.getItem('db_courses') || '[]');
        const newCourse = {
          id: `course-${Math.random().toString(36).substr(2, 9)}`,
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          modules_json: JSON.stringify(courseData.modules)
        };
        const updated = [...localCourses, newCourse];
        localStorage.setItem('db_courses', JSON.stringify(updated));
        setCourses(updated);
      } else {
        await request('/api/courses', {
          method: 'POST',
          body: JSON.stringify(courseData)
        });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const adminDeleteCourse = async (courseId) => {
    try {
      if (demoMode) {
        const localCourses = JSON.parse(localStorage.getItem('db_courses') || '[]');
        const updated = localCourses.filter(c => c.id !== courseId);
        localStorage.setItem('db_courses', JSON.stringify(updated));
        setCourses(updated);
        
        // Remove enrollments of this course
        const localEnroll = JSON.parse(localStorage.getItem('db_enrollments') || '[]');
        const filteredEnroll = localEnroll.filter(e => e.course_id !== courseId);
        localStorage.setItem('db_enrollments', JSON.stringify(filteredEnroll));
        setEnrolledCourses(filteredEnroll);
      } else {
        await request(`/api/courses/${courseId}`, { method: 'DELETE' });
        await loadLiveData();
      }
      return true;
    } catch (e) {
      console.error(e);
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
        courses,
        enrolledCourses,
        plannerTasks,
        adminSubmissions,
        adminStudents,
        login,
        register,
        logout,
        updateProfile,
        enrollInCourse,
        fetchQuizzes,
        submitQuizAnswers,
        fetchAssignments,
        submitAssignmentSolution,
        addPlannerTask,
        togglePlannerTask,
        deletePlannerTask,
        sendChatMessage,
        gradeStudentSubmission,
        adminAddCourse,
        adminDeleteCourse,
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
