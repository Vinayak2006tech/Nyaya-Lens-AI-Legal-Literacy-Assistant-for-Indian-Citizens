const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const PORT = process.env.PORT || 5001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const JWT_SECRET = process.env.JWT_SECRET || 'nyaya-lens-secret-salt-2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<db_username>:cNeYNb4Y9Fd3ZtZ5@cluster0.f6nqvs0.mongodb.net/nyaya_lens?retryWrites=true&w=majority';

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Configure upload storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// User Storage & Authentication Helpers
const USERS_FILE = path.join(__dirname, 'users_db.json');

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Indian Citizen' },
  salt: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', userSchema);
let isMongoConnected = false;

// Connect to MongoDB Atlas
async function initMongoDB() {
  if (!MONGODB_URI || MONGODB_URI.includes('<db_username>')) {
    console.log('[NyayaLens DB] MongoDB connection string contains placeholder <db_username>. Waiting for database username to connect.');
    return;
  }
  try {
    console.log('[NyayaLens DB] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log('[NyayaLens DB] Connected to MongoDB Atlas successfully.');
    await syncLocalUsersToMongo();
  } catch (err) {
    isMongoConnected = false;
    console.error('[NyayaLens DB] MongoDB connection attempt failed:', err.message);
    console.log('[NyayaLens DB] Continuing with persistent local storage (users_db.json).');
  }
}

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('[NyayaLens DB] MongoDB connection disconnected.');
});

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateToken(userId, email) {
  const payload = Buffer.from(JSON.stringify({ userId, email, exp: Date.now() + 7 * 24 * 3600 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (data.exp < Date.now()) return null;
    return data;
  } catch (e) {
    return null;
  }
}

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultSalt = crypto.randomBytes(16).toString('hex');
    const defaultUsers = [
      {
        id: 'usr-demo-001',
        name: 'Ananya Verma',
        email: 'ananya.verma@example.in',
        role: 'Citizen / Tenant',
        salt: defaultSalt,
        passwordHash: hashPassword('password123', defaultSalt),
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function syncLocalUsersToMongo() {
  if (!isMongoConnected) return;
  const localUsers = loadUsers();
  for (const u of localUsers) {
    try {
      await MongoUser.findOneAndUpdate(
        { email: u.email.toLowerCase() },
        { ...u, email: u.email.toLowerCase() },
        { upsert: true }
      );
    } catch (e) {
      // ignore individual duplicate key/upsert error
    }
  }
  console.log(`[NyayaLens DB] Synced ${localUsers.length} user account(s) with MongoDB Atlas.`);
}

async function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  if (isMongoConnected) {
    try {
      const doc = await MongoUser.findOne({ email: normalized });
      if (doc) return doc;
    } catch (e) {
      console.warn('[NyayaLens DB] MongoDB find error:', e.message);
    }
  }
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === normalized) || null;
}

async function findUserById(id) {
  if (isMongoConnected) {
    try {
      const doc = await MongoUser.findOne({ id });
      if (doc) return doc;
    } catch (e) {
      console.warn('[NyayaLens DB] MongoDB find error:', e.message);
    }
  }
  const users = loadUsers();
  return users.find(u => u.id === id) || null;
}

async function persistUser(userData) {
  // Save locally first
  const users = loadUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = userData;
  } else {
    users.push(userData);
  }
  saveUsers(users);

  // Save to MongoDB Atlas if connected
  if (isMongoConnected) {
    try {
      await MongoUser.findOneAndUpdate(
        { email: userData.email.toLowerCase() },
        userData,
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`[NyayaLens DB] User ${userData.email} saved to MongoDB Atlas.`);
    } catch (e) {
      console.warn('[NyayaLens DB] MongoDB save error:', e.message);
    }
  }
}

// Authentication Middleware
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in to access this feature.' });
  }
  const token = authHeader.split(' ')[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
  const user = await findUserById(verified.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }
  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
}

// Database Status Endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    database: 'MongoDB Atlas',
    connected: isMongoConnected,
    hasPlaceholder: Boolean(MONGODB_URI && MONGODB_URI.includes('<db_username>')),
    connectionStringConfigured: Boolean(MONGODB_URI)
  });
});

// Auth REST Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role || 'Indian Citizen',
    salt: salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString()
  };

  await persistUser(newUser);

  const token = generateToken(newUser.id, newUser.email);
  return res.json({
    message: 'Account successfully registered.',
    token: token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user.id, user.email);
  return res.json({
    message: 'Login successful.',
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Call initMongoDB on startup
initMongoDB();

app.get('/api/auth/me', authenticateUser, (req, res) => {
  return res.json({ user: req.user });
});

// WebSocket Connection handling
wss.on('connection', (ws) => {
  console.log('[NyayaLens WS] Client connected to live stream');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'START_ANALYSIS') {
        ws.send(JSON.stringify({ type: 'STATUS', status: 'INGESTING_DOCUMENT', message: 'Ingesting document text...' }));
        
        try {
          const aiRes = await axios.post(`${AI_SERVICE_URL}/api/analyze-document`, {
            text: data.text,
            language: data.language || 'English'
          });

          const result = aiRes.data;
          
          ws.send(JSON.stringify({ 
            type: 'STATUS', 
            status: 'SEGMENTED', 
            total_clauses: result.total_clauses,
            scam_assessment: result.scam_assessment 
          }));

          for (let i = 0; i < result.clauses.length; i++) {
            await new Promise(r => setTimeout(r, 120));
            ws.send(JSON.stringify({
              type: 'CLAUSE_EVALUATION',
              index: i,
              clause: result.clauses[i]
            }));
          }

          ws.send(JSON.stringify({
            type: 'ANALYSIS_COMPLETE',
            result: result
          }));

        } catch (err) {
          console.error('[NyayaLens WS] AI Service error:', err.message);
          ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Failed to complete AI clause evaluation: ' + (err.response?.data?.detail || err.message)
          }));
        }
      }
    } catch (e) {
      console.error('[NyayaLens WS] Message parsing error:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('[NyayaLens WS] Client disconnected');
  });
});

// Public Demo Data Endpoints
app.get('/api/health', async (req, res) => {
  let aiStatus = 'disconnected';
  try {
    const check = await axios.get(`${AI_SERVICE_URL}/api/health`, { timeout: 2000 });
    aiStatus = check.data.granite_engine || 'connected';
  } catch (e) {
    aiStatus = 'fallback-mode';
  }

  res.json({
    service: 'Nyaya Lens Backend Gateway',
    status: 'online',
    port: PORT,
    ai_service: aiStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/demo-documents', async (req, res) => {
  try {
    const aiRes = await axios.get(`${AI_SERVICE_URL}/api/demo-documents`);
    return res.json(aiRes.data);
  } catch (err) {
    const demoPath = path.join(__dirname, '../ai-service/demo_documents.json');
    if (fs.existsSync(demoPath)) {
      const fallback = JSON.parse(fs.readFileSync(demoPath, 'utf8'));
      return res.json(fallback.documents);
    }
    return res.status(500).json({ error: 'Could not load demo documents' });
  }
});

app.get('/api/statutes', async (req, res) => {
  try {
    const aiRes = await axios.get(`${AI_SERVICE_URL}/api/statutes`);
    return res.json(aiRes.data);
  } catch (err) {
    const statutesPath = path.join(__dirname, '../ai-service/statutes_db.json');
    if (fs.existsSync(statutesPath)) {
      const fallback = JSON.parse(fs.readFileSync(statutesPath, 'utf8'));
      return res.json(fallback);
    }
    return res.status(500).json({ error: 'Could not load statutes' });
  }
});

// Protected Analysis Endpoints
app.post('/api/analyze-document', authenticateUser, async (req, res) => {
  try {
    const aiRes = await axios.post(`${AI_SERVICE_URL}/api/analyze-document`, req.body);
    return res.json(aiRes.data);
  } catch (err) {
    console.error('Error proxying to AI service:', err.message);
    return res.status(err.response?.status || 500).json({
      error: err.response?.data?.detail || err.message
    });
  }
});

app.post('/api/simulate-consequence', authenticateUser, async (req, res) => {
  try {
    const aiRes = await axios.post(`${AI_SERVICE_URL}/api/simulate-consequence`, req.body);
    return res.json(aiRes.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      error: err.response?.data?.detail || err.message
    });
  }
});

app.get('/api/governance-audit', authenticateUser, async (req, res) => {
  try {
    const aiRes = await axios.get(`${AI_SERVICE_URL}/api/governance-audit`);
    return res.json(aiRes.data);
  } catch (err) {
    return res.status(500).json({ error: 'Could not fetch governance audit records' });
  }
});

app.post('/api/upload-document', authenticateUser, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filename = req.file.originalname;
    let extractedText = '';

    if (filename.endsWith('.txt') || req.file.mimetype.includes('text')) {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      const raw = req.file.buffer.toString('utf-8', 0, Math.min(req.file.buffer.length, 50000));
      extractedText = raw.replace(/[^\x20-\x7E\u0900-\u097F\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      if (extractedText.length < 50) {
        extractedText = `Uploaded Document: ${filename}\n\n[Extracted text preview]\n` + req.file.buffer.toString('latin1').replace(/[^\x20-\x7E\n]/g, ' ');
      }
    }

    return res.json({
      filename: filename,
      size: req.file.size,
      text: extractedText
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error processing uploaded file: ' + err.message });
  }
});

server.listen(PORT, () => {
  console.log(`[NyayaLens Backend] HTTP & WebSocket Server listening on http://localhost:${PORT}`);
});
