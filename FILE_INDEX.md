# 📑 Complete File Index & Documentation Map

## 📚 Documentation Files

### Root Directory
| File | Purpose |
|------|---------|
| `README.md` | Complete feature documentation, API reference, troubleshooting |
| `QUICKSTART.md` | 5-minute setup guide, first steps, demo accounts |
| `INSTALLATION_GUIDE.md` | Detailed installation steps, MongoDB setup, troubleshooting |
| `SOLUTION_SUMMARY.md` | Overview of entire solution, features, technology stack |
| `FILE_INDEX.md` | This file - complete guide to all files |
| `.gitignore` | Git configuration for version control |

---

## 🔧 Backend Files

### Configuration & Entry Point
| File | Purpose |
|------|---------|
| `backend/server.js` | Main Express server with Socket.IO setup |
| `backend/package.json` | Node.js dependencies (express, mongoose, bcryptjs, etc.) |
| `backend/.env` | Environment variables (MongoDB URI, JWT secret, port) |
| `backend/sample-data.js` | Script to populate demo data |

### Database Models
| File | Purpose | Collections |
|------|---------|-------------|
| `backend/models/User.js` | User authentication & authorization | users |
| `backend/models/ProductionLog.js` | Production data entries | productionlogs |
| `backend/models/ProductionLine.js` | Line configuration & master data | productionlines |

### API Routes
| File | Purpose | Endpoints |
|------|---------|-----------|
| `backend/routes/auth.js` | Authentication endpoints | /api/auth/login, /api/auth/register |
| `backend/routes/production.js` | Production CRUD + settings | /api/production/*, /api/production/lines/* |

### Middleware
| File | Purpose |
|------|---------|
| `backend/middleware/auth.js` | JWT verification & role-based access control |

---

## 🎨 Frontend Files

### Configuration & Entry
| File | Purpose |
|------|---------|
| `frontend/public/index.html` | HTML entry point with Tailwind CDN |
| `frontend/src/index.jsx` | React app initialization |
| `frontend/src/App.jsx` | Main application component & routing |
| `frontend/package.json` | React dependencies (react, axios, socket.io-client, tailwind) |
| `frontend/.env` | Environment variables (API URL, WebSocket URL) |
| `frontend/postcss.config.js` | PostCSS configuration for Tailwind |

### Styling
| File | Purpose |
|------|---------|
| `frontend/src/index.css` | Tailwind CSS setup & custom styles |
| `frontend/src/tailwind.config.js` | Tailwind theme configuration |

### React Components
| File | Purpose | Features |
|------|---------|----------|
| `frontend/src/components/Login.jsx` | Authentication UI | Register, Login, Demo accounts |
| `frontend/src/components/DataEntryForm.jsx` | Production data entry | Form validation, all data fields |
| `frontend/src/components/ProductionTable.jsx` | Data display & export | Table, CSV export, conditional highlighting |
| `frontend/src/components/Settings.jsx` | Production line management | Add/view production lines, restricted to managers |

---

## 📊 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['operator', 'manager', 'admin'],
  lineAssignment: String,
  createdAt: Date
}
```

### ProductionLog Model
```javascript
{
  _id: ObjectId,
  lineNo: String,
  sapLocation: String,
  modelName: String,
  planQty: Number,
  actualQty: Number,
  variance: Number (calculated: actualQty - planQty),
  targetUPPH: Number,
  actualUPPH: Number,
  standardManpower: Number,
  actualManpower: Number,
  manpowerVariance: Number (calculated),
  fpyPercentage: Number,
  rtyPercentage: Number,
  osdValue: Number,
  osdPercentage: Number,
  shiftName: ['A', 'B', 'C'],
  date: Date,
  recordedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### ProductionLine Model
```javascript
{
  _id: ObjectId,
  lineNo: String (unique),
  sapLocation: String,
  description: String,
  standardManpower: Number,
  targetUPPH: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints Reference

### Authentication Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | User login |

### Production Data Endpoints
| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/production` | JWT | All | List all logs (filterable) |
| GET | `/api/production/:id` | JWT | All | Get single log |
| POST | `/api/production` | JWT | Operator+ | Create new log |
| PUT | `/api/production/:id` | JWT | Own/Manager+ | Update log |
| DELETE | `/api/production/:id` | JWT | Manager+ | Delete log |

### Production Lines Endpoints
| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/production/lines/all` | JWT | All | List all production lines |
| POST | `/api/production/lines` | JWT | Manager+ | Add new line |
| PUT | `/api/production/lines/:id` | JWT | Manager+ | Update line |

---

## 🎯 Component Hierarchy

```
App.jsx (Main)
├── Login.jsx (auth-related)
│   ├── Register form
│   └── Login form
├── Header (navigation + user info)
├── Navigation Tabs
│   ├── Dashboard tab
│   └── Settings tab (manager only)
├── Dashboard Page
│   ├── DataEntryForm.jsx
│   │   └── All 12 input fields
│   └── ProductionTable.jsx
│       ├── Data table with sorting
│       └── CSV export button
├── Settings Page
│   └── Settings.jsx
│       ├── Add line form
│       └── View lines list
└── Footer
```

---

## 🔐 Authentication Flow

```
User Registration/Login
    ↓
Validate Credentials
    ↓
Hash Password (bcryptjs)
    ↓
Generate JWT Token (7-day expiry)
    ↓
Store token in localStorage
    ↓
Send with API requests in Authorization header
    ↓
Backend validates JWT → checks role → processes request
```

---

## 📈 Data Entry & Processing Flow

```
User fills form (12 fields)
    ↓
Form validation
    ↓
Convert to numbers
    ↓
Send POST to /api/production
    ↓
Backend validates data
    ↓
Save to MongoDB
    ↓
Emit WebSocket event
    ↓
All connected clients receive update
    ↓
Frontend updates table instantly
    ↓
Show success message
```

---

## 📤 Export to CSV Flow

```
User clicks "Export to CSV"
    ↓
Get all data from current table
    ↓
Format as CSV with headers
    ↓
Create Blob
    ↓
Generate download link
    ↓
Trigger browser download
    ↓
File saved as production-data-YYYY-MM-DD.csv
```

---

## 🔄 Real-Time Update Flow (WebSocket)

```
Backend (server.js)
    ↓
Socket.IO server listening on port 5000
    ↓
Frontend connects with Socket.IO client
    ↓
When data is saved:
  - Backend emits 'dataUpdated' event
  - All connected clients receive update
  - Frontend calls fetchData()
  - Table refreshes automatically
```

---

## 📊 Role-Based Permissions Matrix

| Feature | Operator | Manager | Admin |
|---------|----------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Production Table | ✅ | ✅ | ✅ |
| Enter Production Data | ✅ | ✅ | ✅ |
| Export to CSV | ✅ | ✅ | ✅ |
| Access Settings | ❌ | ✅ | ✅ |
| Add Production Lines | ❌ | ✅ | ✅ |
| Edit Production Lines | ❌ | ✅ | ✅ |
| Delete Data Entries | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## 🎨 UI Components & Colors

### Theme
- **Primary BG**: `#0f172a` (Slate-900)
- **Secondary BG**: `#1e293b` (Slate-800)
- **Text**: `#e2e8f0` (Slate-200)
- **Accent**: `#3b82f6` (Blue-500)

### Status Colors
- **Red (Error)**: `#ef4444` - Actual < Plan
- **Orange (Warning)**: `#f97316` - Overstaffing
- **Green (Success)**: `#22c55e` - On target

### Components
- Form inputs with dark theme
- Responsive table (horizontal scroll on mobile)
- Dropdown menus for line selection
- Toggle buttons for navigation
- Export button with icon

---

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Update MongoDB URI to Atlas
- [ ] Change JWT_SECRET
- [ ] Update REACT_APP_API_URL to production URL
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS origins
- [ ] Set up error logging
- [ ] Create database backups

### Deployment Targets
- **Backend**: Heroku, Railway, AWS, Google Cloud
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas (free tier available)

---

## 📦 Dependencies Summary

### Backend (10 packages)
- express - Web framework
- mongoose - MongoDB ORM
- bcryptjs - Password hashing
- jsonwebtoken - JWT auth
- socket.io - Real-time communication
- cors - Cross-origin requests
- dotenv - Environment config
- axios - HTTP client
- nodemon - Dev auto-reload

### Frontend (7 packages)
- react - UI framework
- react-dom - DOM rendering
- axios - HTTP client
- socket.io-client - Real-time client
- react-router-dom - Navigation
- papaparse - CSV parsing
- tailwindcss - Utility CSS

---

## 🔍 File Search Index

Looking for:
- **Login logic** → `frontend/src/components/Login.jsx`
- **Data form** → `frontend/src/components/DataEntryForm.jsx`
- **Table display** → `frontend/src/components/ProductionTable.jsx`
- **Settings** → `frontend/src/components/Settings.jsx`
- **API routes** → `backend/routes/production.js`
- **Authentication** → `backend/routes/auth.js`
- **User model** → `backend/models/User.js`
- **Database schema** → `backend/models/ProductionLog.js`
- **Server setup** → `backend/server.js`
- **Styling** → `frontend/src/index.css`

---

## 📞 Quick Reference

| What | Where |
|------|-------|
| Run Backend | `cd backend && npm start` |
| Run Frontend | `cd frontend && npm start` |
| Seed Data | `cd backend && node sample-data.js` |
| Change Port | Edit `backend/.env` |
| Add Field | Edit `DataEntryForm.jsx` and `ProductionLog.js` |
| Change Theme | Edit `frontend/src/index.css` |
| API Base URL | `backend/.env` (MONGO_URI) |

---

**Last Updated**: February 2024
**Total Files**: 25+ files
**Total Lines of Code**: 2000+
**Status**: ✅ Production Ready
