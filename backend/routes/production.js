// backend/routes/production.js
const express = require('express');
const router = express.Router();
const ProductionLog = require('../models/ProductionLog');
const ProductionLine = require('../models/ProductionLine');
const { auth, authorize } = require('../middleware/auth');

// Get all production logs (with filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { lineNo, date, shift } = req.query;
    let query = {};
    
    if (lineNo) query.lineNo = lineNo;
    if (shift) query.shiftName = shift;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    const logs = await ProductionLog.find(query).populate('recordedBy', 'name email').sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get production log by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const log = await ProductionLog.findById(req.params.id).populate('recordedBy');
    if (!log) return res.status(404).json({ message: 'Production log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new production log (Operators + Managers)
router.post('/', auth, authorize('operator', 'manager', 'admin'), async (req, res) => {
  try {
    const productionLog = new ProductionLog({
      ...req.body,
      recordedBy: req.user.id
    });
    
    await productionLog.save();
    res.status(201).json(productionLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update production log (Only Operators/Managers can update their own, Admins can update any)
router.put('/:id', auth, async (req, res) => {
  try {
    const log = await ProductionLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Production log not found' });
    
    // Check permissions
    if (req.user.role !== 'admin' && log.recordedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this log' });
    }
    
    Object.assign(log, req.body);
    log.updatedAt = Date.now();
    await log.save();
    
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete production log (Managers and above)
router.delete('/:id', auth, authorize('manager', 'admin'), async (req, res) => {
  try {
    const log = await ProductionLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Production log not found' });
    res.json({ message: 'Production log deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all production lines
router.get('/lines/all', auth, async (req, res) => {
  try {
    const lines = await ProductionLine.find({ isActive: true });
    res.json(lines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new production line (Managers and above)
router.post('/lines', auth, authorize('manager', 'admin'), async (req, res) => {
  try {
    const line = new ProductionLine(req.body);
    await line.save();
    res.status(201).json(line);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update production line (Managers and above)
router.put('/lines/:id', auth, authorize('manager', 'admin'), async (req, res) => {
  try {
    const line = await ProductionLine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!line) return res.status(404).json({ message: 'Production line not found' });
    res.json(line);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
