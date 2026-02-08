// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Analytics } from '@vercel/analytics/react';
import Login from './components/Login';
import DataEntryForm from './components/DataEntryForm';
import ProductionTable from './components/ProductionTable';
import Settings from './components/Settings';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [productionLines, setProductionLines] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(WS_URL);
    setSocket(newSocket);

    newSocket.on('dataUpdated', (updatedData) => {
      console.log('Real-time update:', updatedData);
      fetchData();
    });

    return () => newSocket.disconnect();
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Fetch data and production lines
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const [dataRes, linesRes] = await Promise.all([
        axios.get(`${API_URL}/production`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/production/lines/all`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setData(dataRes.data);
      setProductionLines(linesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  // Fetch data on user login
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setData([]);
    setProductionLines([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('dashboard');
  };

  const handleDataAdded = (newEntry) => {
    setData(prev => [newEntry, ...prev]);
    if (socket) {
      socket.emit('dataUpdated', newEntry);
    }
  };

  const handleLineAdded = (newLine) => {
    setProductionLines(prev => [...prev, newLine]);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/production/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete entry: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">🏭 Manufacturing Dashboard</h1>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Welcome, <span className="font-semibold">{user.name}</span></span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                currentPage === 'dashboard'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-300 hover:text-slate-100'
              }`}
            >
              📊 Dashboard
            </button>
            {(user.role === 'manager' || user.role === 'admin') && (
              <button
                onClick={() => setCurrentPage('settings')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  currentPage === 'settings'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-300 hover:text-slate-100'
                }`}
              >
                ⚙️ Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-slate-300 mt-2">Loading data...</p>
          </div>
        ) : (
          <>
            {currentPage === 'dashboard' && (
              <>
                {/* Only Operators can add data */}
                {(user.role === 'operator' || user.role === 'manager' || user.role === 'admin') && (
                  <DataEntryForm onDataAdded={handleDataAdded} productionLines={productionLines} />
                )}
                
                {/* Production Table - visible to all roles */}
                <ProductionTable data={data} onDelete={handleDelete} userRole={user.role} />
              </>
            )}

            {currentPage === 'settings' && (
              <Settings 
                productionLines={productionLines} 
                onLineAdded={handleLineAdded}
                userRole={user.role}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>© 2024 Manufacturing Production Dashboard. All rights reserved.</p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
