// backend/models/ProductionLog.js
const mongoose = require('mongoose');

const productionLogSchema = new mongoose.Schema({
  lineNo: { type: String, required: true }, // e.g., "BE-03"
  sapLocation: { type: String },
  modelName: { type: String, required: true },
  
  // Production metrics
  planQty: { type: Number, required: true },
  actualQty: { type: Number, required: true },
  variance: { 
    type: Number, 
    get: function() { return this.actualQty - this.planQty; }
  },
  
  // UPPH (Units Per Person Hour)
  targetUPPH: { type: Number },
  actualUPPH: { type: Number },
  
  // Manpower
  standardManpower: { type: Number },
  actualManpower: { type: Number },
  manpowerVariance: {
    type: Number,
    get: function() { return this.actualManpower - this.standardManpower; }
  },
  
  // Quality metrics
  fpyPercentage: { type: Number }, // First Pass Yield %
  rtyPercentage: { type: Number }, // Rolled Throughput Yield %
  
  // Financials
  osdValue: { type: Number }, // OS&D Value in ₹
  osdPercentage: { type: Number },
  
  // Metadata
  shiftName: { type: String, enum: ['A', 'B', 'C'] },
  date: { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Enable getters in toJSON
productionLogSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('ProductionLog', productionLogSchema);
