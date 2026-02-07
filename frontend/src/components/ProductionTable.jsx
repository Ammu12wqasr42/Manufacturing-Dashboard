// frontend/src/components/ProductionTable.jsx
import React from 'react';

function ProductionTable({ data, onDelete, userRole }) {
  const getRowColor = (item) => {
    if (item.actualQty < item.planQty) return 'bg-red-900 bg-opacity-20';
    if (item.actualManpower > item.standardManpower) return 'bg-orange-900 bg-opacity-20';
    return 'bg-slate-700 bg-opacity-20';
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Line No', 'Model', 'Plan (Qty)', 'Actual (Qty)', 'Variance',
      'Target UPPH', 'Actual UPPH', 'Std Manpower', 'Act Manpower',
      'FPY %', 'RTY %', 'OS&D Value (₹)', 'Date'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(item =>
        [
          item.lineNo,
          item.modelName,
          item.planQty,
          item.actualQty,
          item.actualQty - item.planQty,
          item.targetUPPH || '',
          item.actualUPPH || '',
          item.standardManpower || '',
          item.actualManpower || '',
          item.fpyPercentage || '',
          item.rtyPercentage || '',
          item.osdValue || '',
          new Date(item.date).toLocaleDateString()
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `production-data-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
      <div className="p-4 bg-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Production Data</h2>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          📥 Export to CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr className="border-b border-slate-600">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 uppercase">Line</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 uppercase">Model</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">Plan</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">Actual</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">Var</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">UPPH (T)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">UPPH (A)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">MP Std</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">MP Act</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">FPY %</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200 uppercase">RTY %</th>
              {userRole === 'manager' && <th className="px-4 py-3 text-center text-xs font-semibold text-slate-200 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className={`border-b border-slate-600 hover:bg-slate-700 transition ${getRowColor(item)}`}>
                  <td className="px-4 py-3 font-semibold text-slate-100">{item.lineNo}</td>
                  <td className="px-4 py-3 text-slate-300">{item.modelName}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.planQty}</td>
                  <td className={`px-4 py-3 text-right font-bold ${item.actualQty < item.planQty ? 'text-red-400' : 'text-green-400'}`}>
                    {item.actualQty}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.actualQty - item.planQty}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.targetUPPH?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.actualUPPH?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.standardManpower || '-'}</td>
                  <td className={`px-4 py-3 text-right font-bold ${item.actualManpower > item.standardManpower ? 'text-orange-400' : 'text-slate-300'}`}>
                    {item.actualManpower || '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.fpyPercentage?.toFixed(2) || '-'}%</td>
                  <td className="px-4 py-3 text-right text-slate-300">{item.rtyPercentage?.toFixed(2) || '-'}%</td>
                  {userRole === 'manager' && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="px-4 py-6 text-center text-slate-400">
                  No production data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductionTable;
