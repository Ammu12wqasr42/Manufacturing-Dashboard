# Manufacturing Production Dashboard

A professional **real-time manufacturing production tracking system** built with Node.js, Express, and HTML/CSS. Track production lines, manage operators, and export data with ease.

---

## ✨ Features

### 📊 Dashboard
- **Real-time Production Tracking**: View all production lines and their metrics at a glance
- **Comprehensive Data Fields**:
  - Line identification (Line No, SAP Location, Model Name)
  - Production metrics (Plan, Actual, Variance)
  - UPPH metrics (Target vs Actual)
  - Manpower metrics (Standard vs Actual)
  - Quality metrics (FPY%, RTY%)
  - Financial metrics (OS&D Value & Percentage)

### 🎨 Smart Highlighting
- **Red cells**: When Actual Qty < Plan Qty (underperformance)
- **Orange cells**: When Actual Manpower > Standard Manpower (overstaffing)
- **Green cells**: When Actual Qty ≥ Plan Qty (meeting or exceeding targets)

### 📥 Export Functionality
- Download production data as **CSV file** with a single click
- Includes all metrics and timestamps

### 🔐 Role-Based Access Control
- **Operator**: Can only enter production data
- **Manager**: Can enter data, view reports, and manage production lines
- **Admin**: Full access to all features

### ⚙️ Settings Page
- **Add Production Lines**: Create new production lines (e.g., BE-05) with:
  - SAP Location
  - Standard Manpower
  - Target UPPH
  - Description
- **View Existing Lines**: See all configured production lines

### 🔔 Real-Time Updates
- WebSocket integration for instant data synchronization across all connected users
- Automatic refresh when new data is added

---

## 🏗️ Project Structure

```
Dixon/
├── backend/
│   ├── models/
│   │   ├── User.js              # User authentication model
│   │   ├── ProductionLog.js      # Production data schema
│   │   └── ProductionLine.js     # Production line configuration
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── production.js         # Production data & settings endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication & role authorization
│   ├── server.js                # Main Express server
│   ├── .env                     # Environment variables
│   └── package.json             # Node.js dependencies
│
└── frontend/
    ├── public/
    │   └── index.html           # HTML entry point
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx        # Authentication UI
    │   │   ├── DataEntryForm.jsx # Production data entry form
    │   │   ├── ProductionTable.jsx # Data display & export
    │   │   └── Settings.jsx     # Production line management
    │   ├── App.jsx              # Main application component
    │   ├── index.jsx            # React entry point
    │   ├── index.css            # Tailwind CSS setup
    │   └── tailwind.config.js   # Tailwind configuration
    └── package.json             # React dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+)
- **MongoDB** (local or cloud - MongoDB Atlas)
- **npm** or **yarn**

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/manufacturing-dashboard
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
REACT_APP_API_URL=http://localhost:3000
```

**For MongoDB Atlas Cloud:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manufacturing-dashboard
```

#### Start Backend Server
```bash
npm start
# For development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

#### Start Frontend Server
```bash
npm start
```

The frontend will open automatically at `http://localhost:3000`

---

## 🔐 Demo Accounts

Use these credentials to test the dashboard:

| Role | Email | Password |
|------|-------|----------|
| **Operator** | operator@example.com | password123 |
| **Manager** | manager@example.com | password123 |
| **Admin** | admin@example.com | password123 |

**First Time?** Register a new account to create your own user.

---

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['operator', 'manager', 'admin'],
  lineAssignment: String,
  createdAt: Date
}
```

### ProductionLog Schema
```javascript
{
  lineNo: String,
  sapLocation: String,
  modelName: String,
  planQty: Number,
  actualQty: Number,
  variance: Number (calculated),
  targetUPPH: Number,
  actualUPPH: Number,
  standardManpower: Number,
  actualManpower: Number,
  manpowerVariance: Number (calculated),
  fpyPercentage: Number,
  rtyPercentage: Number,
  osdValue: Number,
  osdPercentage: Number,
  shiftName: Enum ['A', 'B', 'C'],
  date: Date,
  recordedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### ProductionLine Schema
```javascript
{
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

## 🔌 API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user

### Production Data (requires JWT token)
- **GET** `/api/production` - Get all production logs (with filters)
- **GET** `/api/production/:id` - Get specific production log
- **POST** `/api/production` - Create new production log
- **PUT** `/api/production/:id` - Update production log
- **DELETE** `/api/production/:id` - Delete production log (Manager+)

### Production Lines (requires JWT token)
- **GET** `/api/production/lines/all` - Get all active production lines
- **POST** `/api/production/lines` - Add new production line (Manager+)
- **PUT** `/api/production/lines/:id` - Update production line (Manager+)

---

## 📈 Conditional Highlighting Rules

| Condition | Color | Status |
|-----------|-------|--------|
| Actual Qty < Plan Qty | 🔴 Red | Underperformance |
| Actual Manpower > Standard | 🟠 Orange | Overstaffing |
| Actual Qty ≥ Plan Qty | 🟢 Green | On Target / Exceeded |

---

## 💾 Export Production Data

Click the **"📥 Export to CSV"** button on the dashboard to download:
- All production entries with complete metrics
- Formatted for Excel/Spreadsheet applications
- File naming: `production-data-YYYY-MM-DD.csv`

---

## 🔄 Real-Time Updates

The dashboard uses **Socket.IO** for real-time synchronization:
- When one user adds data, all connected users see it instantly
- No need to refresh or reload
- Automatic reconnection on network issues

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally or update `MONGO_URI` in `.env`

### Port Already in Use
```bash
# Change PORT in .env (e.g., PORT=5001)
# Or kill existing process:
# On Windows: netstat -ano | findstr :5000
# On Mac/Linux: lsof -i :5000 | kill -9 <PID>
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure `REACT_APP_API_URL` matches your backend URL in `.env`

### Token Expiration
If you see "Token is not valid", logout and login again.

---

## 📦 Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **socket.io**: Real-time communication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment configuration

### Frontend
- **react**: UI framework
- **axios**: HTTP client
- **socket.io-client**: Real-time client
- **tailwindcss**: Utility-first CSS
- **papaparse**: CSV parsing (optional)

---

## 🚀 Production Deployment

### Deploy Backend (Heroku/Railway)
```bash
# Add Procfile in backend/
web: node server.js

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy the build/ folder
```

### Update Environment Variables
- Set `MONGO_URI` to production database
- Update `REACT_APP_API_URL` to production backend
- Change `JWT_SECRET` to a secure random string

---

## 📝 License

This project is open-source and available for manufacturing facilities worldwide.

---

## 🤝 Support

For issues, feature requests, or contributions, please contact the development team.

---

**Build Version**: 1.0.0  
**Last Updated**: February 2024  
**Status**: ✅ Production Ready
