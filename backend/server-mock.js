// backend/server-mock.js - Simple backend that works without MongoDB
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3000/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock in-memory database
const mockUsers = [
  { id: '1', name: 'John Operator', email: 'operator@example.com', password: bcrypt.hashSync('password123', 10), role: 'operator' },
  { id: '2', name: 'Sarah Manager', email: 'manager@example.com', password: bcrypt.hashSync('password123', 10), role: 'manager' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', password: bcrypt.hashSync('password123', 10), role: 'admin' }
];

let mockProductionLogs = [
  { _id: '1', lineNo: 'BE-01', modelName: 'Model-A', planQty: 100, actualQty: 95, targetUPPH: 12.5, actualUPPH: 11.8, standardManpower: 5, actualManpower: 5, fpyPercentage: 98.5, rtyPercentage: 97.2 },
  { _id: '2', lineNo: 'BE-02', modelName: 'Model-B', planQty: 80, actualQty: 85, targetUPPH: 11.8, actualUPPH: 12.1, standardManpower: 6, actualManpower: 6, fpyPercentage: 99.0, rtyPercentage: 98.0 }
];

let mockProductionLines = [
  { _id: '1', lineNo: 'BE-01', sapLocation: 'BLR-001', description: 'Assembly Line 1', standardManpower: 5, targetUPPH: 12.5, isActive: true },
  { _id: '2', lineNo: 'BE-02', sapLocation: 'BLR-002', description: 'Assembly Line 2', standardManpower: 6, targetUPPH: 11.8, isActive: true },
  { _id: '3', lineNo: 'BE-03', sapLocation: 'BLR-003', description: 'Packaging Line', standardManpower: 4, targetUPPH: 15.2, isActive: true }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (mockUsers.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: role || 'operator'
    };
    
    mockUsers.push(user);
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PRODUCTION ROUTES
app.get('/api/production', authMiddleware, (req, res) => {
  res.json(mockProductionLogs);
});

app.post('/api/production', authMiddleware, (req, res) => {
  const newLog = {
    _id: Date.now().toString(),
    ...req.body,
    recordedBy: req.user.id,
    date: new Date(),
    createdAt: new Date()
  };
  
  mockProductionLogs.unshift(newLog);
  io.emit('dataUpdated', newLog);
  
  res.status(201).json(newLog);
});

app.put('/api/production/:id', authMiddleware, (req, res) => {
  const log = mockProductionLogs.find(l => l._id === req.params.id);
  if (!log) return res.status(404).json({ message: 'Log not found' });
  
  Object.assign(log, req.body);
  res.json(log);
});

app.delete('/api/production/:id', authMiddleware, (req, res) => {
  mockProductionLogs = mockProductionLogs.filter(l => l._id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// PRODUCTION LINES ROUTES
app.get('/api/production/lines/all', authMiddleware, (req, res) => {
  res.json(mockProductionLines);
});

app.post('/api/production/lines', authMiddleware, (req, res) => {
  const newLine = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date()
  };
  
  mockProductionLines.push(newLine);
  res.status(201).json(newLine);
});

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: '✅ Server is running', mode: 'MOCK MODE (No MongoDB)' });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('🔌 Client connected');
  
  socket.on('dataUpdated', (data) => {
    io.emit('dataUpdated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n✅ ================================================`);
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`⚠️  Mode: MOCK MODE (No MongoDB - In-Memory Data)`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`================================================\n`);
});
