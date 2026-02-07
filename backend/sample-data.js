// backend/sample-data.js
// Run this file to populate initial data: node sample-data.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const ProductionLine = require('./models/ProductionLine');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/manufacturing-dashboard';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ProductionLine.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create demo users
    const operator = new User({
      name: 'John Operator',
      email: 'operator@example.com',
      password: 'password123',
      role: 'operator'
    });

    const manager = new User({
      name: 'Sarah Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager'
    });

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    await operator.save();
    await manager.save();
    await admin.save();
    console.log('👥 Created 3 demo users');

    // Create production lines
    const lines = [
      {
        lineNo: 'BE-01',
        sapLocation: 'BLR-001',
        description: 'Assembly Line 1',
        standardManpower: 5,
        targetUPPH: 12.5
      },
      {
        lineNo: 'BE-02',
        sapLocation: 'BLR-002',
        description: 'Assembly Line 2',
        standardManpower: 6,
        targetUPPH: 11.8
      },
      {
        lineNo: 'BE-03',
        sapLocation: 'BLR-003',
        description: 'Packaging Line',
        standardManpower: 4,
        targetUPPH: 15.2
      },
      {
        lineNo: 'BE-04',
        sapLocation: 'BLR-004',
        description: 'Quality Check',
        standardManpower: 3,
        targetUPPH: 20.0
      }
    ];

    await ProductionLine.insertMany(lines);
    console.log('🏭 Created 4 production lines');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('  Operator: operator@example.com / password123');
    console.log('  Manager: manager@example.com / password123');
    console.log('  Admin: admin@example.com / password123');
    console.log('\n📍 Production Lines:');
    lines.forEach(line => {
      console.log(`  ${line.lineNo} (${line.sapLocation}) - ${line.description}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
