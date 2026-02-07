# Quick Start Guide - Manufacturing Dashboard

## 🚀 Start Backend

```bash
cd backend
npm install
npm start
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

## 🚀 Start Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

## 📋 First Steps

1. **Register a New Account** or use demo credentials:
   - Email: `operator@example.com`
   - Password: `password123`

2. **Add Production Lines** (Manager role):
   - Go to Settings ⚙️
   - Click "Add New Production Line"
   - Enter Line No (e.g., BE-03), SAP Location, etc.

3. **Enter Production Data** (Operator role):
   - Fill the form with daily production metrics
   - Click "Save Data"
   - Data appears instantly in the table

4. **Export Data**:
   - Click "📥 Export to CSV" button
   - Download as Excel-compatible file

## 🔑 Role Permissions

| Feature | Operator | Manager | Admin |
|---------|----------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| Enter Data | ✅ | ✅ | ✅ |
| Access Settings | ❌ | ✅ | ✅ |
| Delete Entries | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

## 🆘 Troubleshooting

**MongoDB Connection Error?**
- Install MongoDB locally OR
- Update `MONGO_URI` in `backend/.env` to your MongoDB Atlas URL

**Port 5000 Already in Use?**
- Change PORT in `backend/.env`
- Restart backend server

**Frontend Can't Connect?**
- Check `REACT_APP_API_URL` in `frontend/.env`
- Ensure backend is running

## 📊 Key Features

✅ Real-time production tracking
✅ Automatic variance calculation
✅ Red/Orange/Green status indicators
✅ CSV export functionality
✅ Role-based access control
✅ WebSocket real-time updates
✅ Dark-themed industrial UI

## 📈 Next Steps

1. Set up MongoDB Atlas for cloud storage
2. Deploy backend to Heroku/Railway
3. Deploy frontend to Vercel/Netlify
4. Configure production environment variables

---

**Happy Production Tracking! 🏭**
