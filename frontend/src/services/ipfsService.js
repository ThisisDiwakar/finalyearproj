import axios from 'axios';

const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all projects directly from database (fallback)
 */
const getAllProjectsFromDB = async () => {
  try {
    const token = localStorage.getItem('bcr_token');
    const response = await axios.get(`${API_BASE}/admin/projects`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 1000 }
    });
    return response.data.data.projects || [];
  } catch (error) {
    console.error('Failed to get projects from DB:', error);
    return [];
  }
};

/**
 * Get latest IPFS hash from backend
 */
const getLatestIPFSHash = async () => {
  try {
    const token = localStorage.getItem('bcr_token');
    const response = await axios.get(`${API_BASE}/admin/ipfs-hash`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to get IPFS hash:', error);
    return null;
  }
};

/**
 * Fetch data from IPFS gateway
 */
const fetchFromIPFS = async (hash) => {
  try {
    console.log(`📦 Fetching from IPFS: ${hash}`);
    const response = await axios.get(`${IPFS_GATEWAY}${hash}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('IPFS fetch failed:', error);
    throw error;
  }
};

/**
 * Calculate statistics from projects
 */
const calculateStats = (projects) => {
  try {
    const totalProjects = projects.length;
    // Status mapping: SUBMITTED/DRAFT = Pending, UNDER_REVIEW/REVIEW = Review
    const pendingProjects = projects.filter(p => p.status === 'SUBMITTED' || p.status === 'DRAFT').length;
    const reviewProjects = projects.filter(p => p.status === 'UNDER_REVIEW' || p.status === 'REVIEW').length;
    const approvedProjects = projects.filter(p => p.status === 'APPROVED' || p.status === 'MINTED').length;
    const rejectedProjects = projects.filter(p => p.status === 'REJECTED').length;

    const totalArea = projects.reduce((sum, p) => sum + (p.restoration?.areaHectares || 0), 0);
    const totalCarbon = projects.reduce((sum, p) => sum + (p.carbon?.estimatedCO2e || 0), 0);
    const equivalentCars = Math.floor(totalCarbon / 4.6);

    const states = new Set(projects.map(p => p.location?.state).filter(Boolean));
    const statesCount = states.size;

    // Generate activity feed from recent projects
    const activityFeed = projects
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(p => ({
        id: p._id,
        projectId: p.projectId,
        action: `${p.submittedBy?.name || 'User'} submitted ${p.projectName || 'project'}`,
        timestamp: p.createdAt,
        status: p.status?.toLowerCase() || 'submitted',
        location: p.location?.state,
      }));

    return {
      totalProjects,
      pendingProjects,
      reviewProjects,
      approvedProjects,
      rejectedProjects,
      totalArea: parseFloat(totalArea.toFixed(2)),
      monthlyAreaIncrease: 0,
      totalCarbon: parseFloat(totalCarbon.toFixed(2)),
      equivalentCars,
      totalEarnings: 0,
      statesCount,
      activityFeed,
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return getZeroStateData();
  }
};

/**
 * Main function: Fetch admin data with IPFS-first approach
 */
export const fetchAdminData = async () => {
  try {
    // Step 1: Try to get latest IPFS hash
    console.log('🔍 Checking for IPFS snapshot...');
    const ipfsData = await getLatestIPFSHash();
    
    if (ipfsData && ipfsData.hash) {
      console.log(`📦 Found IPFS hash: ${ipfsData.hash}`);
      
      try {
        // Step 2: Fetch from IPFS
        const rawData = await fetchFromIPFS(ipfsData.hash);
        
        // Step 3: Parse IPFS data
        if (rawData && rawData.projects) {
          console.log(`✅ Loaded ${rawData.projects.length} projects from IPFS`);
          
          const stats = rawData.stats || calculateStats(rawData.projects);
          
          return {
            ...stats,
            projects: rawData.projects,
            activityFeed: rawData.activityFeed || stats.activityFeed,
            ipfsHash: ipfsData.hash,
            ipfsUrl: ipfsData.url,
            dataSource: 'ipfs',
          };
        }
      } catch (ipfsError) {
        console.warn('⚠️ IPFS fetch failed, falling back to database');
      }
    } else {
      console.log('ℹ️ No IPFS snapshot found, using database');
    }

    // Step 4: Fallback to database
    console.log('📊 Fetching from database...');
    const projects = await getAllProjectsFromDB();
    
    if (!projects || projects.length === 0) {
      console.log('ℹ️ No projects found');
      return getZeroStateData();
    }
    
    console.log(`✅ Loaded ${projects.length} projects from database`);
    const stats = calculateStats(projects);
    
    return {
      ...stats,
      projects,
      dataSource: 'database',
    };
  } catch (error) {
    console.error('❌ Failed to fetch admin data:', error);
    return getZeroStateData();
  }
};

/**
 * Trigger manual IPFS sync
 */
export const triggerIPFSSync = async () => {
  try {
    const token = localStorage.getItem('bcr_token');
    console.log('🔄 Triggering IPFS sync...');
    
    const response = await axios.post(
      `${API_BASE}/admin/sync-ipfs`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('✅ IPFS sync completed');
    console.log(`📦 New IPFS hash: ${response.data.data?.ipfsHash}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ IPFS sync failed:', error);
    throw error;
  }
};

/**
 * Zero-state data (all zeros)
 */
const getZeroStateData = () => ({
  totalProjects: 0,
  pendingProjects: 0,
  reviewProjects: 0,
  approvedProjects: 0,
  rejectedProjects: 0,
  totalArea: 0.0,
  monthlyAreaIncrease: 0.0,
  totalCarbon: 0.0,
  equivalentCars: 0,
  totalEarnings: 0,
  statesCount: 0,
  projects: [],
  activityFeed: [],
  dataSource: 'none',
});

// Legacy export for backward compatibility
export const fetchIPFSData = fetchAdminData;

export default {
  fetchAdminData,
  fetchIPFSData,
  triggerIPFSSync,
  getLatestIPFSHash,
};
