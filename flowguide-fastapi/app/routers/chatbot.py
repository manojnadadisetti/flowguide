from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import httpx

from app.core.database import get_db
from app.core.deps import get_current_user, oauth2_scheme
from app.models.user import User
from app.models.learning import ChatbotMessage

router = APIRouter(prefix="/api/chatbot", tags=["AI Chatbot"])

# --- Pydantic Schemas ---
class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str


# --- Chatbot responder logic ---
def get_ai_response(query: str, username: str) -> str:
    q = query.lower()
    
    # Check for greeting
    if any(greet in q for greet in ["hello", "hi", "hey", "sup", "yo"]):
        return (
            f"Hello {username}! 🚀 I'm Sparky, your AI study companion. "
            "I can help you **explain concepts**, **generate study notes**, "
            "**assist with coding errors**, or **guide you on course assignments**. "
            "What topic are we tackling today?"
        )
        
    # Check for portfolio assignment assistance
    if "portfolio" in q:
        return (
            "### 🎨 Portfolio Assignment Guide\n\n"
            "To build a stunning personal portfolio, structure your code like this:\n\n"
            "1. **Semantic HTML**: Use `<header>`, `<main>`, `<section id='about'>`, and `<footer>`.\n"
            "2. **Styling & Responsive Layout**: Use flexbox to align elements.\n"
            "3. **Mock Javascript code to inspect details**:\n"
            "```html\n"
            "<!DOCTYPE html>\n"
            "<html>\n"
            "<head>\n"
            "  <style>\n"
            "    body { font-family: sans-serif; margin: 0; padding: 2rem; }\n"
            "    .container { display: flex; flex-wrap: wrap; gap: 1rem; }\n"
            "    .project-card { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; flex: 1 1 200px; }\n"
            "  </style>\n"
            "</head>\n"
            "<body>\n"
            "  <h1>Welcome to my Portfolio</h1>\n"
            "  <div class='container'>\n"
            "    <div class='project-card'><h3>Project A</h3><p>FastAPI app</p></div>\n"
            "    <div class='project-card'><h3>Project B</h3><p>React dashboard</p></div>\n"
            "  </div>\n"
            "</body>\n"
            "</html>\n"
            "```\n\n"
            "Would you like me to help you style this using modern Glassmorphism CSS?"
        )

    # Check for calculator assignment assistance
    elif "calculator" in q:
        return (
            "### 🐍 Python Command Line Calculator Tips\n\n"
            "Here's a structured boilerplate code to implement your python calculator assignment:\n\n"
            "```python\n"
            "def add(x, y): return x + y\n"
            "def subtract(x, y): return x - y\n"
            "def multiply(x, y): return x * y\n"
            "def divide(x, y):\n"
            "    if y == 0:\n"
            "        return 'Error! Division by zero.'\n"
            "    return x / y\n\n"
            "def main():\n"
            "    while True:\n"
            "        print('\\n--- Python Calculator ---')\n"
            "        choice = input('Enter operator (+, -, *, /) or \"q\" to quit: ')\n"
            "        if choice == \"q\":\n"
            "            break\n"
            "        if choice in ('+', '-', '*', '/'):\n"
            "            try:\n"
            "                num1 = float(input('Num 1: '))\n"
            "                num2 = float(input('Num 2: '))\n"
            "                if choice == \"+\": print(\"Result:\", add(num1, num2))\n"
            "                elif choice == \"-\": print(\"Result:\", subtract(num1, num2))\n"
            "                elif choice == \"*\": print(\"Result:\", multiply(num1, num2))\n"
            "                elif choice == \"/\": print(\"Result:\", divide(num1, num2))\n"
            "            except ValueError:\n"
            "                print('Please enter valid numeric figures!')\n"
            "main()\n"
            "```\n\n"
            "This handles calculations recursively and includes robust `try/except` value error checks!"
        )

    # Check for machine learning / regression
    elif "regression" in q or "machine learning" in q or "ml" in q:
        return (
            "### 🤖 Machine Learning - Linear Regression\n\n"
            "**Linear Regression** is a supervised machine learning algorithm used to predict a continuous numeric output (dependent variable) based on one or more inputs (independent variables).\n\n"
            "#### 🗝️ Core Math equation:\n"
            "$$Y = \\beta_0 + \\beta_1 X + \\epsilon$$\n\n"
            "Where:\n"
            "- $Y$: Predicted label (e.g. house price)\n"
            "- $X$: Input feature (e.g. square footage)\n"
            "- $\\beta_0$: Intercept constant\n"
            "- $\\beta_1$: Coefficient/weight of the feature\n\n"
            "Here is how you can train one in Python using `scikit-learn`:\n"
            "```python\n"
            "import numpy as np\n"
            "from sklearn.linear_model import LinearRegression\n\n"
            "# Input features (X) and Target labels (y)\n"
            "X = np.array([[1], [2], [3], [4], [5]])\n"
            "y = np.array([120, 240, 310, 420, 500])\n\n"
            "# Initialize & train model\n"
            "model = LinearRegression()\n"
            "model.fit(X, y)\n\n"
            "# Predict price for size 6\n"
            "prediction = model.predict([[6]])\n"
            "print(f'Prediction: {prediction[0]:.2f}')\n"
            "```\n\n"
            "Do you want to know how to calculate classification performance using confusion matrices?"
        )

    # Check for data structures / binary search tree / dsa
    elif "dsa" in q or "bst" in q or "binary search tree" in q:
        return (
            "### 🌳 Binary Search Trees (BST)\n\n"
            "A **Binary Search Tree** is a node-based binary tree data structure which has the following properties:\n"
            "- The left subtree of a node contains only nodes with keys **lesser** than the parent node.\n"
            "- The right subtree of a node contains only nodes with keys **greater** than the parent node.\n"
            "- The left and right subtrees must each also be a binary search tree.\n\n"
            "#### 💻 Python BST Implementation:\n"
            "```python\n"
            "class Node:\n"
            "    def __init__(self, key):\n"
            "        self.left = None\n"
            "        self.right = None\n"
            "        self.val = key\n\n"
            "def insert(root, key):\n"
            "    if root is None:\n"
            "        return Node(key)\n"
            "    else:\n"
            "        if root.val < key:\n"
            "            root.right = insert(root.right, key)\n"
            "        else:\n"
            "            root.left = insert(root.left, key)\n"
            "    return root\n"
            "```\n\n"
            "BST provides average searching runtime complexity of **$O(\\log N)$**."
        )

    # Check for loops or functions
    elif "loop" in q or "syntax" in q:
        return (
            "### 🔄 Loops in Programming\n\n"
            "Loops are control structures used to repeat a block of code multiple times.\n\n"
            "- **For Loop**: Used when you know beforehand how many times the loop should run.\n"
            "- **While Loop**: Repeats until a certain condition evaluates to False.\n\n"
            "#### Python Syntax Example:\n"
            "```python\n"
            "# Iterate numbers 0 to 4\n"
            "for i in range(5):\n"
            "    print(f'Step {i}')\n"
            "```"
        )

    # Check for general help / notes generation request
    elif "generate notes" in q or "notes" in q:
        return (
            "### 📚 Generative Study Notes: Frontend & JavaScript Basics\n\n"
            "Here is a summary notes sheet on JavaScript for quick revision:\n\n"
            "#### 1. Data Types\n"
            "- Primitive: `String`, `Number`, `Boolean`, `Null`, `Undefined`\n"
            "- Reference: `Object`, `Array`, `Function`\n\n"
            "#### 2. Variables declaration (`let` vs `const` vs `var`)\n"
            "- Use `const` by default for variables that won't be reassigned.\n"
            "- Use `let` for reassignable block-scoped variables.\n"
            "- Avoid `var` as it is globally/functionally scoped and prone to hosting bugs.\n\n"
            "#### 3. Arrow Functions ES6 syntax\n"
            "```javascript\n"
            "const doubleValue = (num) => num * 2;\n"
            "console.log(doubleValue(5)); // Prints 10\n"
            "```"
        )
        
    elif "streak" in q or "points" in q or "achievement" in q:
        return (
            "### 🏆 Streaks, Points & Gamification\n\n"
            "- **Streaks 🔥**: Complete a quiz or submit an assignment consecutive days to increment your streak! Log in daily to maintain it.\n"
            "- **XP Points**: Earn +50 to +100 points by passing quizzes, and +150 points for assignments graded 'Pass' or high tier. Points raise your global Rank!\n"
            "- **Achievements**: Lock in badges like 'Code Warrior' (scoring 100% on a quiz) or 'Sprint Master' (maintaining a 3-day streak)."
        )

    # Default fallback
    else:
        return (
            f"Hey {username}, I can help you with your question! "
            "Based on our current learning path, I recommend checking out our available courses: "
            "**Frontend Web Development**, **Python Programming Foundations**, **Introduction to Machine Learning**, "
            "**Data Structures & Algorithms**, and **UX/UI Design Principles**.\n\n"
            "Please ask a specific query like: \n"
            "- *How do Linear Regressions work?*\n"
            "- *Help me with the Command Line Calculator code.*\n"
            "- *Provide portfolio HTML tips.*\n"
            "- *Generate notes on JavaScript.*"
        )


@router.post("", response_model=ChatResponse)
def chat_with_assistant(
    payload: ChatRequest,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user)
):
    # Retrieve AI generated message
    ai_answer = get_ai_response(payload.query, current_user.full_name)
    
    # Log user message and AI response to Node.js backend (MongoDB)
    try:
        with httpx.Client() as client:
            client.post(
                "http://localhost:5000/api/chatbot",
                json={"sender": "user", "text": payload.query},
                headers={"Authorization": f"Bearer {token}"}
            )
            client.post(
                "http://localhost:5000/api/chatbot",
                json={"sender": "ai", "text": ai_answer},
                headers={"Authorization": f"Bearer {token}"}
            )
    except Exception as e:
        print(f"Warning: Failed to log chat messages in Node.js: {e}")
    
    return ChatResponse(answer=ai_answer)
