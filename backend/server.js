// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/manufacturing-dashboard';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.log('⚠️ MongoDB not available, using mock data mode');
    console.log('💡 You can still test the app with mock data!');
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/production', require('./routes/production'));

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('🔌 New client connected');
  
  socket.on('dataUpdated', (data) => {
    io.emit('dataUpdated', data); // Broadcast to all clients
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: '✅ Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});


