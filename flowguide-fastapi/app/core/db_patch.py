import json
from datetime import datetime, timedelta
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user import User
from app.models.learning import Course, Quiz, Assignment
from app.models.resource import QuizQuestion, StudyMaterial, VideoTutorial

def patch_and_seed_db(db: Session):
    print("Running database patching...")
    
    # 1. Patch the users table if columns do not exist
    alter_statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT DEFAULT '';",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS skill_level VARCHAR(50) DEFAULT 'Beginner';",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_target_minutes INTEGER DEFAULT 30;"
    ]
    
    for stmt in alter_statements:
        try:
            db.execute(text(stmt))
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Statement failed (could be fine if already applied): {stmt}. Error: {e}")

    print("Database columns verified/patched.")

    # 2. Seed Default Admin User
    admin_email = "admin@flowguide.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        print("Seeding default admin user...")
        admin_user = User(
            email=admin_email,
            full_name="Academy Admin",
            password_hash=hash_password("admin123"),
            role="admin",
            is_active=True,
            is_verified=True,
            phone_number="+1 (555) 019-9999",
            interests="Administration, Teaching",
            skill_level="Advanced",
            total_points=1000
        )
        db.add(admin_user)
        db.commit()
        print("Admin user seeded successfully (admin@flowguide.com / admin123).")

    # 3. Seed Courses, Quizzes, and Assignments
    if db.query(Course).count() == 0:
        print("Seeding default courses, quizzes, and assignments...")
        
        courses_data = [
            {
                "title": "Frontend Web Development",
                "description": "Learn HTML, CSS, JavaScript, and React to build clean and responsive user interfaces.",
                "category": "Web Development",
                "level": "Beginner",
                "modules": [
                    {"id": 1, "title": "Introduction to HTML & CSS", "content": "HTML structures web pages while CSS decorates them. Learn elements, styling, and basic page structures."},
                    {"id": 2, "title": "Responsive Layouts & Flexbox", "content": "Build modern layouts that adjust automatically. Master CSS Flexbox and Grid layout systems."},
                    {"id": 3, "title": "JavaScript Essentials", "content": "Add interactivity! Learn variables, functions, DOM manipulation, arrays, and async execution."},
                    {"id": 4, "title": "Building with React", "content": "Understand component-based architectures. Master state, hooks, props, and rendering."}
                ],
                "quiz": {
                    "title": "Frontend Basics Quiz",
                    "questions": [
                        {"question": "Which CSS property is used to align items inside a Flexbox container along the main axis?", "options": ["align-items", "justify-content", "align-content", "display-flex"], "answer_idx": 1},
                        {"question": "What hook is used to handle local state in a React functional component?", "options": ["useEffect", "useContext", "useState", "useReducer"], "answer_idx": 2},
                        {"question": "Which HTML tag is used to embed client-side JavaScript code?", "options": ["<script>", "<js>", "<javascript>", "<code-box>"], "answer_idx": 0}
                    ]
                },
                "assignment": {
                    "title": "Build a Personal Portfolio",
                    "description": "Create a clean, responsive single-page portfolio using HTML and CSS showing your bio, skills, and projects."
                }
            },
            {
                "title": "Python Programming Foundations",
                "description": "Master Python syntax, core data types, logic flows, functions, and file management.",
                "category": "Programming Languages",
                "level": "Beginner",
                "modules": [
                    {"id": 1, "title": "Python Syntax & Variables", "content": "Variables, strings, integers, floats, booleans, and print formatting."},
                    {"id": 2, "title": "Control Flows & Loops", "content": "Conditional if-elif-else execution, and while/for loops."},
                    {"id": 3, "title": "Functions & Modules", "content": "Define modular code, accept parameters, return results, and import standard modules."},
                    {"id": 4, "title": "File I/O & Error Handling", "content": "Reading/writing text files, and handling exceptions with try/except."}
                ],
                "quiz": {
                    "title": "Python Foundations Quiz",
                    "questions": [
                        {"question": "How do you declare a function in Python?", "options": ["function myFunc():", "def myFunc():", "void myFunc():", "declare myFunc():"], "answer_idx": 1},
                        {"question": "Which data structure is ordered and mutable in Python?", "options": ["Tuple", "Set", "List", "Dictionary"], "answer_idx": 2},
                        {"question": "What keyword is used to handle exceptions in Python?", "options": ["catch", "except", "error", "handle"], "answer_idx": 1}
                    ]
                },
                "assignment": {
                    "title": "Command Line Calculator",
                    "description": "Build a terminal-based calculator in Python that loops, requests numbers, performs operations (+, -, *, /), and handles division by zero errors."
                }
            },
            {
                "title": "Introduction to Machine Learning",
                "description": "Get started with statistical algorithms, linear regressions, classifiers, and decision trees.",
                "category": "Machine Learning",
                "level": "Intermediate",
                "modules": [
                    {"id": 1, "title": "Introduction to ML", "content": "Supervised vs Unsupervised learning. Learn what features, labels, training sets, and test sets are."},
                    {"id": 2, "title": "Linear Regression & Classification", "content": "Predict numerical variables with regression and categorical variables with Logistic Regression."},
                    {"id": 3, "title": "Decision Trees & Random Forests", "content": "Build tree classifiers and scale them into forest ensembles for robust prediction accuracy."},
                    {"id": 4, "title": "Clustering & Neural Networks", "content": "Unsupervised K-means clustering, and deep artificial neural network concepts."}
                ],
                "quiz": {
                    "title": "ML Fundamentals Quiz",
                    "questions": [
                        {"question": "Is linear regression supervised or unsupervised learning?", "options": ["Supervised", "Unsupervised", "Semi-supervised", "Reinforcement"], "answer_idx": 0},
                        {"question": "Which evaluation metric is commonly used for classification tasks?", "options": ["Mean Squared Error (MSE)", "R-squared", "Accuracy", "Mean Absolute Error"], "answer_idx": 2}
                    ]
                },
                "assignment": {
                    "title": "Train a House Price Predictor",
                    "description": "Use a simple Python script with scikit-learn (or draft code logic) to load pricing datasets, split train/test, train a Linear Regression model, and print accuracy metrics."
                }
            },
            {
                "title": "Data Structures & Algorithms",
                "description": "Explore Big O notation, lists, stacks, trees, sorting algorithms, and graphing algorithms.",
                "category": "Computer Science",
                "level": "Intermediate",
                "modules": [
                    {"id": 1, "title": "Big O Notation & Arrays", "content": "Determine run-time complexity. Understand array lists and static memories."},
                    {"id": 2, "title": "Linked Lists, Stacks & Queues", "content": "Linked dynamic nodes, LIFO stacks, FIFO queues, and implementation rules."},
                    {"id": 3, "title": "Trees & Graphs", "content": "Binary search trees, traversal algorithms (in-order, pre-order, post-order), and graph representations."},
                    {"id": 4, "title": "Sorting & Searching Algorithms", "content": "Quick sort, merge sort, binary search, and recursive search strategies."}
                ],
                "quiz": {
                    "title": "DSA Core Concepts Quiz",
                    "questions": [
                        {"question": "What is the time complexity of searching in a balanced Binary Search Tree?", "options": ["O(1)", "O(N)", "O(log N)", "O(N log N)"], "answer_idx": 2},
                        {"question": "Which data structure operates on a Last In First Out (LIFO) basis?", "options": ["Queue", "Stack", "Heap", "Graph"], "answer_idx": 1}
                    ]
                },
                "assignment": {
                    "title": "Implement a Binary Search Tree",
                    "description": "Write a class in Python or JS representing a BST node, and implement an `insert` and `search` function recursively."
                }
            },
            {
                "title": "UX/UI Design Principles",
                "description": "Discover user research, Figma prototyping, typography hierarchies, and usability testing.",
                "category": "Design",
                "level": "Beginner",
                "modules": [
                    {"id": 1, "title": "What is UX/UI Design?", "content": "User experience vs User Interface. Focus on user empathy, persona creation, and design systems."},
                    {"id": 2, "title": "Color Theory & Typography", "content": "Understand contrast, primary/secondary palettes, and visual hierarchy using modern text fonts."},
                    {"id": 3, "title": "Wireframing & Prototyping in Figma", "content": "Construct low-fidelity sketches and turn them into clickable high-fidelity interactive screens."},
                    {"id": 4, "title": "Usability Testing", "content": "Collect user feedback, run A/B testing, and iterate designs based on customer interactions."}
                ],
                "quiz": {
                    "title": "Design Principles Quiz",
                    "questions": [
                        {"question": "What does UI stand for in design?", "options": ["User Interaction", "User Interface", "User Integration", "Unique Identity"], "answer_idx": 1},
                        {"question": "Which of these represents a low-fidelity draft of a layout?", "options": ["Interactive Prototype", "High-fidelity design", "Wireframe", "Color palette specification"], "answer_idx": 2}
                    ]
                },
                "assignment": {
                    "title": "Design a Mobile Study App",
                    "description": "Sketch a low-fidelity wireframe or describe the user flow for a student mobile learning app containing a login, course, and quiz screen."
                }
            }
        ]

        for course in courses_data:
            c = Course(
                title=course["title"],
                description=course["description"],
                category=course["category"],
                level=course["level"],
                modules_json=json.dumps(course["modules"])
            )
            db.add(c)
            db.commit()
            db.refresh(c)
            
            # Add Quiz
            q_data = course["quiz"]
            q = Quiz(
                course_id=c.id,
                title=q_data["title"],
                questions_json=json.dumps(q_data["questions"])
            )
            db.add(q)
            
            # Add Assignment
            a_data = course["assignment"]
            a = Assignment(
                course_id=c.id,
                title=a_data["title"],
                description=a_data["description"],
                due_date=datetime.utcnow() + timedelta(days=7)
            )
            db.add(a)
            db.commit()
            
    # Seed Quiz Questions
    if db.query(QuizQuestion).count() == 0:
        print("Seeding quiz questions...")
        quizzes = [
            QuizQuestion(course="dsa", question="What is the time complexity of searching in a balanced Binary Search Tree?", options_raw="O(1)|O(N)|O(log N)|O(N log N)", correct_index=2),
            QuizQuestion(course="dsa", question="Which data structure operates on a Last In First Out (LIFO) basis?", options_raw="Queue|Stack|Heap|Graph", correct_index=1),
            QuizQuestion(course="mdsa", question="In propositional logic, what is the truth value of P AND Q when P is true and Q is false?", options_raw="True|False|Cannot be determined|Null", correct_index=1),
            QuizQuestion(course="mdsa", question="Which mathematical structure represents a set of vertices connected by edges?", options_raw="Matrix|Graph|Function|Sequence", correct_index=1),
            QuizQuestion(course="cfai", question="What does the Capital Asset Pricing Model (CAPM) calculate?", options_raw="Expected return of an asset|Net Present Value|Internal Rate of Return|Asset depreciation rate", correct_index=0),
            QuizQuestion(course="cfai", question="Under GAAP, which financial statement reports a company's financial position at a specific point in time?", options_raw="Income Statement|Balance Sheet|Cash Flow Statement|Statement of Retained Earnings", correct_index=1)
        ]
        db.add_all(quizzes)
        db.commit()

    # Seed Study Materials
    if db.query(StudyMaterial).count() == 0:
        print("Seeding study materials...")
        materials = [
            StudyMaterial(course="dsa", title="Big O Notation Cheat Sheet", description="Determine run-time complexity of standard search/sort routines.", read_time="8 mins", content="Big O notation measures the worst-case time complexity of algorithms. Common values include: O(1) for constant time, O(log N) for binary searches, O(N) for linear scans, and O(N^2) for nested loops like bubble sort."),
            StudyMaterial(course="mdsa", title="Set Theory & Relations Guide", description="Comprehensive reference showing sets, subsets, unions, intersections, and relations.", read_time="12 mins", content="A set is a well-defined collection of distinct elements. Basic operations: A U B represents the union of sets A and B, containing all elements in either set. A intersect B is the intersection, containing only elements in both sets."),
            StudyMaterial(course="cfai", title="Financial Reporting & Analysis Summary", description="Balance sheets, income statements, and GAAP vs IFRS accounting guidelines.", read_time="15 mins", content="Financial reporting involves recording historical assets, liabilities, and equity. Key ratios: Current Ratio = Current Assets / Current Liabilities. Debt-to-Equity Ratio = Total Debt / Total Shareholders Equity.")
        ]
        db.add_all(materials)
        db.commit()

    # Seed Videos
    if db.query(VideoTutorial).count() == 0:
        print("Seeding video tutorials...")
        videos = [
            VideoTutorial(course="dsa", title="Data Structures & Algorithms Course", description="Learn sorting, search trees, stacks, heaps, and arrays.", duration="4:00 hours", embed_url="https://www.youtube.com/embed/RBSGKlAobjM", watch_url="https://www.youtube.com/watch?v=RBSGKlAobjM", color="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"),
            VideoTutorial(course="mdsa", title="Discrete Mathematics Crash Course", description="Complete math course covering propositional logic, set theory, and combinatorics.", duration="3:30 hours", embed_url="https://www.youtube.com/embed/tyDKR4FG3Yw", watch_url="https://www.youtube.com/watch?v=tyDKR4FG3Yw", color="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"),
            VideoTutorial(course="cfai", title="CFA Level 1 Corporate Finance Tutorial", description="Fundamentals of corporate finance, net present value, and capital budgeting.", duration="1:20 hours", embed_url="https://www.youtube.com/embed/5a1v4XGedcI", watch_url="https://www.youtube.com/watch?v=5a1v4XGedcI", color="linear-gradient(135deg, #10b981 0%, #059669 100%)")
        ]
        db.add_all(videos)
        db.commit()

    print("Finished database seeding.")
