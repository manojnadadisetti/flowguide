# FlowGuide Frontend - Playful & Colorful Onboarding Workspace

Welcome to the **FlowGuide Frontend**! This is a modern, high-fidelity, interactive user onboarding interface built with **React**, **Vite**, and **Lucide Icons**. 

It is designed to give users a delightful, playful setup experience using organic gradients, micro-animations, custom tooltip guides, and an interactive **AI Guidance chat widget** named Sparky.

---

## 🎨 Dual-Mode Architecture (Offline-Friendly)

To ensure you can immediately run, test, and experience the application even if your backend servers are not running, the frontend features a **Dual-Mode System**:

1. **Local Demo Mode (Mock Engine)**:
   - *Active by default if the backend is unreachable.*
   - Automatically seeds the 8 onboarding steps in browser `localStorage`.
   - Simulates authentication, profile updates, and email verification (via a custom simulated inbox layout).
   - Simulates the dashboard tour clicks, Slack/Jira connections, and team member invitations.
   - Saves all progress and logs to `localStorage` and generates audit trails dynamically.
   - Uses an offline conversational rules engine inside Sparky (the chat widget) that answers questions and suggests steps. Click suggestions to open that specific step instantly!

2. **Live Backend Mode**:
   - *Toggled automatically when the FastAPI server is detected on port 8000.*
   - You can also explicitly toggle it using the connection pill in the navbar.
   - Synchronizes progress directly with the PostgreSQL database.
   - Pulls steps and user details via FastAPI routers.
   - Calls the Spring Boot notification service to trigger mock step-completed and welcoming emails.
   - Uses the FastAPI intelligent keyword guidance engine to drive the AI chat widget.

---

## 🚀 How to Run the Project (VS Code)

To execute the entire workspace, run the following steps in separate VS Code terminals:

### 1. Database Check
The project is configured to connect to PostgreSQL at `localhost:5432` with username `postgres` and password `Manu@2008`. Make sure your PostgreSQL server is active.

### 2. Launch the Spring Boot Notification Service (Port 8080)
Open a terminal in the `flowguide-spring` directory and run:
```bash
./mvnw spring-boot:run
```
*Note: Starting this first ensures Hibernate automatically creates the database tables and seeds the 8 onboarding steps into PostgreSQL.*

### 3. Launch the FastAPI Core API Service (Port 8000)
Open a terminal in the `flowguide-fastapi` directory and run:
```bash
# Activate python virtual environment
.\venv\Scripts\activate

# Launch the FastAPI development server
python run.py
```

### 4. Launch the Vite React Frontend (Port 3000)
Open a terminal in the `frontend` directory and run:
```bash
# Install package dependencies
npm install

# Run the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Key Frontend Files Created

- [package.json](file:///d:/DSDBD/flowguide/frontend/package.json): Package manifest and scripts.
- [vite.config.js](file:///d:/DSDBD/flowguide/frontend/vite.config.js): Configures port 3000 and setup for proxying `/api` requests to port 8000.
- [index.html](file:///d:/DSDBD/flowguide/frontend/index.html): HTML shell featuring Outfit/Inter Google fonts and SEO tags.
- [src/main.jsx](file:///d:/DSDBD/flowguide/frontend/src/main.jsx): React application entry point.
- [src/index.css](file:///d:/DSDBD/flowguide/frontend/src/index.css): Theme styling sheet containing colors, playful variables, animations (float, pulses), scrollbars, and helper classes.
- [src/App.jsx](file:///d:/DSDBD/flowguide/frontend/src/App.jsx): Core React codebase. Manages auth routes, step checklists, step cards (profile picker, mock email inbox, analytics tour, integration cards, confetti completion), and the AI Guidance Chat widget.
