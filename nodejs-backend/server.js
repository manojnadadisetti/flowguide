const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// Load environment variables from the FastAPI .env file
require('dotenv').config({ path: path.join(__dirname, '../flowguide-fastapi/.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection setup
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowguide';
const dbName = process.env.MONGODB_DB_NAME || 'flowguide';

let db = null;
let useLocalFallback = false;

// Local in-memory fallbacks if MongoDB is unavailable
let localPlannerDb = [];
let localChatbotDb = [];

async function connectToMongo() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_PASSWORD')) {
    console.warn("⚠️ MONGODB_URI is not configured in .env -- Using local memory fallback.");
    useLocalFallback = true;
    return;
  }
  
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected successfully to MongoDB Database:", dbName);
  } catch (e) {
    console.error("❌ Failed to connect to MongoDB. Falling back to in-memory data store. Error:", e.message);
    useLocalFallback = true;
  }
}

// Custom JWT verification middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized - Token missing" });
  }
  
  const token = authHeader.substring(7);
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error("Invalid JWT format");
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: "UP",
    service: "FlowGuide Node.js Service",
    port: PORT,
    database: useLocalFallback ? "In-Memory Fallback" : "MongoDB"
  });
});

// ================================================================
// STUDY PLANNER CRUD ENDPOINTS
// ================================================================

// GET planner tasks
app.get('/api/planner', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    if (useLocalFallback) {
      const userTasks = localPlannerDb.filter(t => t.userId === userId);
      return res.json(userTasks);
    }
    
    const tasks = await db.collection('study_plans')
      .find({ userId: userId })
      .sort({ targetDate: 1 })
      .toArray();
      
    // Map _id to id for frontend compatibility
    const mapped = tasks.map(t => ({
      id: t._id.toString(),
      task: t.task,
      target_date: t.targetDate,
      is_completed: t.isCompleted,
      created_at: t.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create planner task
app.post('/api/planner', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { task, target_date } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: "Task name is required" });
    }
    
    const newTask = {
      userId: userId,
      task: task,
      targetDate: target_date || new Date().toISOString(),
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    if (useLocalFallback) {
      const id = 'task_' + Math.random().toString(36).substr(2, 9);
      const savedTask = { id, ...newTask, target_date: newTask.targetDate, is_completed: false, created_at: newTask.createdAt };
      localPlannerDb.push(savedTask);
      return res.status(201).json(savedTask);
    }
    
    const result = await db.collection('study_plans').insertOne(newTask);
    res.status(201).json({
      id: result.insertedId.toString(),
      task: newTask.task,
      target_date: newTask.targetDate,
      is_completed: newTask.isCompleted,
      created_at: newTask.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle planner task
app.patch('/api/planner/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    if (useLocalFallback) {
      const taskIndex = localPlannerDb.findIndex(t => t.id === taskId && t.userId === userId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }
      localPlannerDb[taskIndex].is_completed = !localPlannerDb[taskIndex].is_completed;
      return res.json(localPlannerDb[taskIndex]);
    }
    
    const task = await db.collection('study_plans').findOne({ _id: new ObjectId(taskId), userId: userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    const nextStatus = !task.isCompleted;
    await db.collection('study_plans').updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { isCompleted: nextStatus } }
    );
    
    res.json({
      id: taskId,
      task: task.task,
      target_date: task.targetDate,
      is_completed: nextStatus,
      created_at: task.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE planner task
app.delete('/api/planner/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    if (useLocalFallback) {
      const initialLength = localPlannerDb.length;
      localPlannerDb = localPlannerDb.filter(t => !(t.id === taskId && t.userId === userId));
      if (localPlannerDb.length === initialLength) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.json({ detail: "Task deleted successfully" });
    }
    
    const result = await db.collection('study_plans').deleteOne({ _id: new ObjectId(taskId), userId: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ detail: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================================================================
// CHATBOT MESSAGES CRUD ENDPOINTS
// ================================================================

// GET chatbot logs
app.get('/api/chatbot', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    if (useLocalFallback) {
      const chatLogs = localChatbotDb.filter(m => m.userId === userId);
      return res.json(chatLogs);
    }
    
    const logs = await db.collection('chatbot_messages')
      .find({ userId: userId })
      .sort({ timestamp: 1 })
      .toArray();
      
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST chatbot message log
app.post('/api/chatbot', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sender, text } = req.body;
    
    if (!text || !sender) {
      return res.status(400).json({ error: "Sender and text are required fields" });
    }
    
    const newMsg = {
      userId: userId,
      sender: sender,
      text: text,
      timestamp: new Date().toISOString()
    };
    
    if (useLocalFallback) {
      localChatbotDb.push(newMsg);
      return res.status(201).json(newMsg);
    }
    
    await db.collection('chatbot_messages').insertOne(newMsg);
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server after database connection
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Node.js Backend Microservice is running on Port ${PORT}`);
  });
});
