const { uploadJSONToIPFS } = require('../utils/ipfs');
const Project = require('../models/Project');

/**
 * Aggregate all projects and create IPFS snapshot
 * This creates a complete registry snapshot that admins can view
 */
const createRegistrySnapshot = async () => {
  try {
    // Fetch all projects from database
    const projects = await Project.find({})
      .populate('submittedBy', 'name email role organization')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate aggregate statistics
    const stats = {
      totalProjects: projects.length,
      pendingProjects: projects.filter(p => p.status === 'PENDING').length,
      reviewProjects: projects.filter(p => p.status === 'REVIEW' || p.status === 'SUBMITTED').length,
      approvedProjects: projects.filter(p => p.status === 'APPROVED' || p.status === 'MINTED').length,
      rejectedProjects: projects.filter(p => p.status === 'REJECTED').length,
      totalArea: projects.reduce((sum, p) => sum + (p.restoration?.areaHectares || 0), 0),
      totalCarbon: projects.reduce((sum, p) => sum + (p.carbon?.estimatedCO2e || 0), 0),
      lastUpdated: new Date().toISOString(),
    };

    // Create activity feed from recent projects
    const activityFeed = projects
      .slice(0, 20)
      .map(p => ({
        id: p._id,
        projectId: p.projectId,
        action: `${p.community?.name || 'Community'} submitted project ${p.projectId || ''}`,
        timestamp: p.createdAt,
        status: p.status.toLowerCase(),
        location: p.location?.state,
      }));

    // Create the registry snapshot
    const registryData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      stats,
      projects: projects.map(p => ({
        _id: p._id,
        projectId: p.projectId,
        status: p.status,
        location: p.location,
        restoration: p.restoration,
        carbon: p.carbon,
        community: p.community,
        submittedBy: p.submittedBy,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        // Include IPFS hashes if they exist
        ipfsHashes: p.ipfsHashes,
      })),
      activityFeed,
    };

    // Upload to IPFS via Pinata
    const ipfsResult = await uploadJSONToIPFS(
      registryData,
      `BlueCarbon-Registry-${new Date().toISOString()}`
    );

    console.log('✅ Registry snapshot created:', ipfsResult.ipfsHash);

    return {
      success: true,
      ipfsHash: ipfsResult.ipfsHash,
      ipfsUrl: ipfsResult.ipfsUrl,
      stats,
      timestamp: registryData.timestamp,
    };
  } catch (error) {
    console.error('❌ Failed to create registry snapshot:', error);
    throw error;
  }
};

/**
 * Get the latest registry snapshot hash
 * In production, this would be stored in a separate collection
 */
const getLatestSnapshotHash = async () => {
  // For now, we'll store this in a simple way
  // In production, create a RegistrySnapshot model
  const fs = require('fs');
  const path = require('path');
  const snapshotFile = path.join(__dirname, '../data/latest-snapshot.json');

  try {
    if (fs.existsSync(snapshotFile)) {
      const data = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
      return data;
    }
  } catch (error) {
    console.error('Error reading snapshot file:', error);
  }

  return null;
};

/**
 * Save the latest snapshot hash
 */
const saveSnapshotHash = async (snapshotData) => {
  const fs = require('fs');
  const path = require('path');
  const dataDir = path.join(__dirname, '../data');
  const snapshotFile = path.join(dataDir, 'latest-snapshot.json');

  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(snapshotFile, JSON.stringify(snapshotData, null, 2));
    console.log('✅ Snapshot hash saved');
  } catch (error) {
    console.error('Error saving snapshot hash:', error);
  }
};

/**
 * Auto-sync: Create snapshot when projects are updated
 * Call this after project approval/rejection
 */
const autoSyncToIPFS = async () => {
  try {
    const snapshot = await createRegistrySnapshot();
    await saveSnapshotHash(snapshot);
    return snapshot;
  } catch (error) {
    console.error('Auto-sync failed:', error);
    return null;
  }
};

module.exports = {
  createRegistrySnapshot,
  getLatestSnapshotHash,
  saveSnapshotHash,
  autoSyncToIPFS,
};
