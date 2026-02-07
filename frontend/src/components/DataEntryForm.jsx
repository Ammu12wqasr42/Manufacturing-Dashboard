// frontend/src/components/DataEntryForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataEntryForm({ onDataAdded, productionLines }) {
  const [formData, setFormData] = useState({
    lineNo: '',
    modelName: '',
    planQty: '',
    actualQty: '',
    targetUPPH: '',
    actualUPPH: '',
    standardManpower: '',
    actualManpower: '',
    fpyPercentage: '',
    rtyPercentage: '',
    osdValue: '',
    osdPercentage: '',
    shiftName: 'A'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        planQty: Number(formData.planQty),
        actualQty: Number(formData.actualQty),
        targetUPPH: formData.targetUPPH ? Number(formData.targetUPPH) : null,
        actualUPPH: formData.actualUPPH ? Number(formData.actualUPPH) : null,
        standardManpower: formData.standardManpower ? Number(formData.standardManpower) : null,
        actualManpower: formData.actualManpower ? Number(formData.actualManpower) : null,
        fpyPercentage: formData.fpyPercentage ? Number(formData.fpyPercentage) : null,
        rtyPercentage: formData.rtyPercentage ? Number(formData.rtyPercentage) : null,
        osdValue: formData.osdValue ? Number(formData.osdValue) : null,
        osdPercentage: formData.osdPercentage ? Number(formData.osdPercentage) : null
      };

      const res = await axios.post(
        `${API_URL}/production`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        lineNo: '',
        modelName: '',
        planQty: '',
        actualQty: '',
        targetUPPH: '',
        actualUPPH: '',
        standardManpower: '',
        actualManpower: '',
        fpyPercentage: '',
        rtyPercentage: '',
        osdValue: '',
        osdPercentage: '',
        shiftName: 'A'
      });

      onDataAdded(res.data);
      alert('Data saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save data');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-3">
        Add Production Data Entry
      </h2>

      {error && <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Line Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Production Line *</label>
          <select
            name="lineNo"
            value={formData.lineNo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="">Select Line</option>
            {productionLines.map(line => (
              <option key={line._id} value={line.lineNo}>{line.lineNo}</option>
            ))}
          </select>
        </div>

        {/* Model Name */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Model Name *</label>
          <input
            type="text"
            name="modelName"
            value={formData.modelName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="e.g., Model-A"
          />
        </div>

        {/* Shift */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Shift</label>
          <select
            name="shiftName"
            value={formData.shiftName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="A">Shift A</option>
            <option value="B">Shift B</option>
            <option value="C">Shift C</option>
          </select>
        </div>

        {/* Plan Qty */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Plan (Qty) *</label>
          <input
            type="number"
            name="planQty"
            value={formData.planQty}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0"
          />
        </div>

        {/* Actual Qty */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Actual (Qty) *</label>
          <input
            type="number"
            name="actualQty"
            value={formData.actualQty}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0"
          />
        </div>

        {/* Target UPPH */}
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

        {/* Actual UPPH */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Actual UPPH</label>
          <input
            type="number"
            name="actualUPPH"
            value={formData.actualUPPH}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0.00"
          />
        </div>

        {/* Standard Manpower */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Standard Manpower</label>
          <input
            type="number"
            name="standardManpower"
            value={formData.standardManpower}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0"
          />
        </div>

        {/* Actual Manpower */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Actual Manpower</label>
          <input
            type="number"
            name="actualManpower"
            value={formData.actualManpower}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0"
          />
        </div>

        {/* FPY Percentage */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">FPY %</label>
          <input
            type="number"
            name="fpyPercentage"
            value={formData.fpyPercentage}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0.00"
          />
        </div>

        {/* RTY Percentage */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">RTY %</label>
          <input
            type="number"
            name="rtyPercentage"
            value={formData.rtyPercentage}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0.00"
          />
        </div>

        {/* OS&D Value */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">OS&D Value (₹)</label>
          <input
            type="number"
            name="osdValue"
            value={formData.osdValue}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0.00"
          />
        </div>

        {/* OS&D Percentage */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">OS&D %</label>
          <input
            type="number"
            name="osdPercentage"
            value={formData.osdPercentage}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Data'}
        </button>
      </div>
    </form>
  );
}

export default DataEntryForm;
