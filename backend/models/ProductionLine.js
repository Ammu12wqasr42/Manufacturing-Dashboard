// backend/models/ProductionLine.js
const mongoose = require('mongoose');

const productionLineSchema = new mongoose.Schema({
  lineNo: { type: String, unique: true, required: true }, // e.g., "BE-03"
  sapLocation: { type: String, required: true },
  description: { type: String },
  standardManpower: { type: Number },
  targetUPPH: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductionLine', productionLineSchema);
