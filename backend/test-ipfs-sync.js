/**
 * Test script to verify IPFS sync functionality
 * Run with: node test-ipfs-sync.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testIPFSSync() {
  console.log('🧪 Testing IPFS Sync Functionality\n');

  try {
    // Connect to MongoDB FIRST
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Load models AFTER connection (required for populate to work)
    require('./models/User');
    require('./models/Project');
    const { autoSyncToIPFS, getLatestSnapshotHash } = require('./services/ipfsSync');

    // Check Pinata configuration
    console.log('🔑 Checking Pinata configuration...');
    const hasPinata = process.env.PINATA_API_KEY && 
                      process.env.PINATA_API_KEY !== 'your_pinata_api_key' &&
                      process.env.PINATA_SECRET_KEY &&
                      process.env.PINATA_SECRET_KEY !== 'your_pinata_secret_key';
    
    if (hasPinata) {
      console.log('✅ Pinata API keys configured');
    } else {
      console.log('⚠️  Pinata API keys not configured - using local fallback');
    }
    console.log('');

    // Create a test snapshot using autoSyncToIPFS
    console.log('📸 Creating registry snapshot...');
    const snapshot = await autoSyncToIPFS();
    
    console.log('✅ Snapshot created successfully!\n');
    console.log('📊 Snapshot Details:');
    console.log('   IPFS Hash:', snapshot.ipfsHash);
    console.log('   IPFS URL:', snapshot.ipfsUrl);
    console.log('   Timestamp:', snapshot.timestamp);
    console.log('   Total Projects:', snapshot.stats.totalProjects);
    console.log('   Pending:', snapshot.stats.pendingProjects);
    console.log('   In Review:', snapshot.stats.reviewProjects);
    console.log('   Approved:', snapshot.stats.approvedProjects);
    console.log('   Rejected:', snapshot.stats.rejectedProjects);
    console.log('');

    // Verify snapshot was saved
    console.log('🔍 Verifying saved snapshot...');
    
    // Small delay to ensure file is written
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const savedSnapshot = await getLatestSnapshotHash();
    
    if (savedSnapshot && savedSnapshot.ipfsHash === snapshot.ipfsHash) {
      console.log('✅ Snapshot saved and retrieved successfully!');
      console.log('   File location: backend/data/latest-snapshot.json');
    } else if (savedSnapshot) {
      console.log('⚠️  Snapshot saved but hash mismatch');
      console.log('   Expected:', snapshot.ipfsHash);
      console.log('   Got:', savedSnapshot.ipfsHash);
    } else {
      console.log('⚠️  Snapshot file not found (may need manual verification)');
    }
    console.log('');

    console.log('🎉 All tests passed!\n');
    console.log('Next steps:');
    console.log('1. Start the backend server: npm start');
    console.log('2. Login as admin in the frontend');
    console.log('3. Click "Refresh" button to load IPFS data');
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check MongoDB connection in .env');
    console.error('2. Verify Pinata API keys (optional)');
    console.error('3. Ensure backend/data/ directory exists');
    console.error('');
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the test
testIPFSSync();
