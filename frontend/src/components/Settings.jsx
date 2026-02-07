// frontend/src/components/Settings.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Settings({ productionLines, onLineAdded, userRole }) {
  const [formData, setFormData] = useState({
    lineNo: '',
    sapLocation: '',
    description: '',
    standardManpower: '',
    targetUPPH: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  if (userRole !== 'manager' && userRole !== 'admin') {
    return (
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg text-center">
        <p className="text-red-400 font-semibold">⛔ Access Denied</p>
        <p className="text-slate-300">Only Managers and Admins can access settings.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(
        `${API_URL}/production/lines`,
        {
          ...formData,
          standardManpower: formData.standardManpower ? Number(formData.standardManpower) : null,
          targetUPPH: formData.targetUPPH ? Number(formData.targetUPPH) : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        lineNo: '',
        sapLocation: '',
        description: '',
        standardManpower: '',
        targetUPPH: ''
      });

      onLineAdded(res.data);
      setSuccessMsg('Production line added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add production line');
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-3">
        ⚙️ Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Production Line Form */}
        <div>
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Add New Production Line</h3>
          
          <form onSubmit={handleAddLine} className="space-y-4">
            {error && <div className="p-3 bg-red-900 text-red-200 rounded-lg text-sm">{error}</div>}
            {successMsg && <div className="p-3 bg-green-900 text-green-200 rounded-lg text-sm">{successMsg}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Line No *</label>
              <input
                type="text"
                name="lineNo"
                value={formData.lineNo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g., BE-05"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">SAP Location</label>
              <input
                type="text"
                name="sapLocation"
                value={formData.sapLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g., BLR-01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white h-20"
                placeholder="Line description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Standard Manpower</label>
              <input
                type="number"
                name="standardManpower"
                value={formData.standardManpower}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Target UPPH</label>
              <input
                type="number"
                name="targetUPPH"
                value={formData.targetUPPH}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="0.00"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Production Line'}
            </button>
          </form>
        </div>

        {/* Existing Production Lines */}
        <div>
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Existing Production Lines</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {productionLines && productionLines.length > 0 ? (
              productionLines.map(line => (
                <div key={line._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{line.lineNo}</p>
                      <p className="text-sm text-slate-300">{line.sapLocation}</p>
                      {line.description && <p className="text-xs text-slate-400 mt-1">{line.description}</p>}
                      <div className="text-xs text-slate-400 mt-2">
                        <p>Std Manpower: {line.standardManpower || '-'}</p>
                        <p>Target UPPH: {line.targetUPPH?.toFixed(2) || '-'}</p>
                      </div>
                    </div>
                    {line.isActive && <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Active</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No production lines yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
