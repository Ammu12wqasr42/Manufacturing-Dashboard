const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();

// Backend server
const backendProcess = spawn('node', ['backend/server-mock.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Frontend server
const frontendProcess = spawn('node', ['frontend/server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

console.log('🚀 Manufacturing Dashboard - Starting...');
console.log('📌 Backend: http://localhost:5000');
console.log('📌 Frontend: http://localhost:3000');

// Graceful shutdown
process.on('SIGTERM', () => {
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});
