# 📖 Complete Installation & Setup Guide

## System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher (comes with Node.js)
- **MongoDB**: Local installation OR MongoDB Atlas account (free)
- **RAM**: Minimum 2GB
- **Disk Space**: 500MB for dependencies

---

## Option A: Using Local MongoDB

### Step 1: Install MongoDB Community Edition

#### Windows
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. MongoDB runs as a Windows service (auto-starts)
5. Verify: Open Command Prompt and run:
   ```bash
   mongod --version
   ```

#### Mac (with Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Verify Installation:**
```bash
mongo --version
```

---

## Option B: Using MongoDB Atlas (Cloud)

### Sign Up & Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (Free tier available)
4. Whitelist IP address (or allow all: 0.0.0.0/0)
5. Create database user with password
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/manufacturing-dashboard
   ```

**This is recommended for production!**

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

Expected output:
```
added XX packages in XXs
```

### Step 3: Create Environment File

Create `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/manufacturing-dashboard
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manufacturing-dashboard

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Server Configuration
PORT=5000

# Frontend URL
REACT_APP_API_URL=http://localhost:3000
```

### Step 4: Seed Demo Data (Optional)

To populate demo users and production lines:

```bash
node sample-data.js
```

Expected output:
```
📦 Connected to MongoDB
🗑️ Cleared existing data
👥 Created 3 demo users
🏭 Created 4 production lines
✅ Database seeding completed successfully!
```

### Step 5: Start Backend Server

```bash
npm start
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

**✅ Backend is running!**

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal/command prompt** and navigate to:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install React, Tailwind CSS, Axios, and Socket.IO client.

### Step 3: Create Environment File

Create `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
```

### Step 4: Start Frontend Server

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view manufacturing-dashboard-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**The browser will automatically open to http://localhost:3000**

---

## 🔑 Login & Test

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Operator | operator@example.com | password123 |
| Manager | manager@example.com | password123 |
| Admin | admin@example.com | password123 |

### Or Register New Account

1. Click "Don't have an account? Register"
2. Fill in name, email, password
3. Select role (Operator/Manager)
4. Click "Register"

---

## 🧪 Testing Workflow

### 1. As Operator
```
✓ Login with operator@example.com
✓ Go to Dashboard
✓ Fill production data form
✓ Click "Save Data"
✓ See data in table
✓ Click "Export to CSV"
```

### 2. As Manager
```
✓ Login with manager@example.com
✓ Go to Settings
✓ Add new production line (e.g., BE-05)
✓ Return to Dashboard
✓ See new line in dropdown
✓ Enter data for new line
✓ Delete a data entry
```

---

## 🔧 Troubleshooting

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:27017"

**Problem**: MongoDB is not running

**Solution**:
```bash
# Windows - Start MongoDB service
net start MongoDB

# Mac - Start MongoDB
brew services start mongodb-community

# Linux - Start MongoDB
sudo systemctl start mongodb

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in backend/.env
```

---

### Issue: "Port 5000 already in use"

**Problem**: Another application is using port 5000

**Solution**:

```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Find and kill process
lsof -i :5000
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

---

### Issue: "Port 3000 already in use"

**Solution** (same as above but for port 3000)

---

### Issue: "Cannot find module 'express'" or similar

**Problem**: Dependencies not installed

**Solution**:
```bash
cd backend  # or frontend
npm install
```

---

### Issue: "CORS error" or "Access denied"

**Problem**: Frontend and backend URLs don't match

**Solution**:
1. Check frontend `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_WS_URL=http://localhost:5000
   ```
2. Check backend is running on port 5000
3. Restart frontend: `npm start`

---

### Issue: "Cannot POST /api/auth/login"

**Problem**: Backend server is not running

**Solution**:
1. Check if backend terminal shows errors
2. Verify MongoDB connection
3. Restart backend: `npm start`

---

## 📊 Database Verification

### Check MongoDB Data

#### Using MongoDB Compass (GUI)
1. Download from https://www.mongodb.com/try/download/compass
2. Connect to `mongodb://localhost:27017`
3. Browse `manufacturing-dashboard` database

#### Using MongoDB CLI
```bash
mongo
use manufacturing-dashboard
db.users.find()  # See users
db.productionlogs.find()  # See production data
db.productionlines.find()  # See production lines
```

---

## 🚀 Optimization Tips

### For Better Performance

```bash
# Install dependencies more efficiently
npm ci  # Instead of npm install (uses package-lock.json)

# Run backend in development mode with auto-reload
npm run dev  # (requires nodemon, already in package.json)

# Build frontend for production
npm run build  # In frontend directory
```

---

## 🔒 Security for Production

### Before Deploying:

1. **Change JWT_SECRET**:
   ```env
   JWT_SECRET=super-secret-random-string-at-least-32-chars
   ```

2. **Use MongoDB Atlas** (don't use local MongoDB in production)

3. **Enable HTTPS** on your server

4. **Update REACT_APP_API_URL** to your production backend URL

5. **Set NODE_ENV=production** in backend

---

## 📦 Project Information

| Item | Details |
|------|---------|
| **Frontend Framework** | React 18 |
| **Backend Framework** | Express.js |
| **Database** | MongoDB |
| **Styling** | Tailwind CSS |
| **Real-time** | Socket.IO |
| **Authentication** | JWT |
| **Encryption** | bcryptjs |

---

## 📚 Directory Structure Quick Reference

```
backend/
  └── server.js          ← Main server file
  └── models/            ← Database schemas
  └── routes/            ← API endpoints
  └── middleware/        ← Auth middleware
  └── .env               ← Configuration (create this)

frontend/
  └── src/
    └── App.jsx         ← Main component
    └── components/     ← React components
    └── index.css       ← Tailwind CSS
  └── .env              ← Configuration (create this)
```

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login with demo account
- [ ] Can enter production data
- [ ] Can see data in table
- [ ] Can export to CSV
- [ ] Can access Settings (as Manager)

---

## 🎉 You're Ready!

Once all checks pass, your Manufacturing Dashboard is **fully functional** and ready to use!

For quick reference, see **QUICKSTART.md**

For detailed features, see **README.md**

---

## 📞 Need Help?

1. Check **README.md** for detailed documentation
2. Look at **QUICKSTART.md** for quick reference
3. Review this guide for common issues
4. Check console/terminal for error messages

---

**Last Updated**: February 2024
**Status**: Production Ready ✅
