# 🌊 Blue Carbon Registry - IPFS Integration Guide

## Overview

This guide explains how the IPFS integration works and how data flows from user submission to admin dashboard.

## Data Flow Architecture

```
User Submits Project
        ↓
MongoDB Database (Immediate Storage)
        ↓
Auto-Sync Triggered
        ↓
IPFS Snapshot Created (via Pinata)
        ↓
Admin Dashboard Fetches from IPFS
        ↓
Fallback to Database if IPFS Fails
```

## Key Components

### 1. Backend Services

#### `backend/services/ipfsSync.js`
- **createRegistrySnapshot()**: Aggregates all projects and creates IPFS snapshot
- **autoSyncToIPFS()**: Automatically syncs data after project changes
- **getLatestSnapshotHash()**: Retrieves the latest IPFS hash
- **saveSnapshotHash()**: Stores snapshot metadata locally

#### `backend/utils/ipfs.js`
- **uploadToIPFS()**: Uploads files to IPFS via Pinata
- **uploadJSONToIPFS()**: Uploads JSON data to IPFS via Pinata
- Handles fallback when Pinata keys are not configured

### 2. Backend Routes

#### `backend/routes/project.js`
- **POST /api/projects**: User submits new project → Auto-sync triggered
- **PUT /api/projects/:id**: User updates project → Auto-sync triggered

#### `backend/routes/admin.js`
- **GET /api/admin/ipfs-hash**: Get latest IPFS snapshot hash
- **POST /api/admin/sync-ipfs**: Manually trigger IPFS sync
- **POST /api/admin/projects/:id/approve**: Approve project → Auto-sync triggered
- **POST /api/admin/projects/:id/reject**: Reject project → Auto-sync triggered
- **POST /api/admin/projects/:id/send-to-verifier**: Send to verifier → Auto-sync triggered

### 3. Frontend Services

#### `frontend/src/services/ipfsService.js`
- **fetchIPFSData()**: Main function to fetch dashboard data
  - Tries IPFS first
  - Falls back to database if IPFS fails
  - Returns zero-state data if no data exists
- **triggerIPFSSync()**: Manually trigger backend IPFS sync
- **parseProjectsData()**: Calculates statistics from project data

### 4. Frontend Components

#### `frontend/src/components/Admin/AdminDashboard.jsx`
- Main admin dashboard component
- Loads data on mount using `fetchIPFSData()`
- Displays zero-state until data is available

#### `frontend/src/components/Admin/QuickActions.jsx`
- Refresh button triggers `triggerIPFSSync()` then refreshes dashboard
- Handles loading states and error messages

## Setup Instructions

### Step 1: Configure Pinata (Optional but Recommended)

1. Go to [https://app.pinata.cloud/](https://app.pinata.cloud/)
2. Create a free account
3. Generate API keys:
   - Go to API Keys section
   - Click "New Key"
   - Enable "pinFileToIPFS" and "pinJSONToIPFS" permissions
   - Copy the API Key and Secret Key

4. Update `backend/.env`:
```env
PINATA_API_KEY=your_actual_pinata_api_key_here
PINATA_SECRET_KEY=your_actual_pinata_secret_key_here
```

### Step 2: Start the Backend

```bash
cd backend
npm install
npm start
```

The server will show:
```
🌊 Blue Carbon Registry API Server
📡 Running on: http://localhost:5000
📦 MongoDB: Connected ✅
🔗 IPFS: Pinata Connected (or Local Fallback)
```

### Step 3: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 4: Test the Flow

1. **Register as a regular user**
   - Go to http://localhost:5173/register
   - Create account with role: "community_member"

2. **Submit a project**
   - Login and go to "Submit Project"
   - Fill in project details
   - Upload photos
   - Submit
   - ✅ Auto-sync to IPFS triggered in background

3. **Login as admin**
   - Logout and login with admin credentials
   - Or register a new user and manually change role to "admin" in MongoDB

4. **View Admin Dashboard**
   - Dashboard loads with zero-state initially
   - Click "Refresh" button to trigger IPFS sync
   - Data appears after sync completes

5. **Approve/Reject Projects**
   - Click on a project in the table
   - Use action buttons (Approve/Reject/Send to Verifier)
   - ✅ Auto-sync triggered after each action

## How Auto-Sync Works

### Trigger Points

Auto-sync is triggered automatically after:
1. User submits new project
2. User updates existing project
3. Admin approves project
4. Admin rejects project
5. Admin sends project to verifier
6. Admin clicks "Refresh" button (manual trigger)

### Sync Process

```javascript
// 1. Fetch all projects from MongoDB
const projects = await Project.find({}).populate('submittedBy');

// 2. Calculate aggregate statistics
const stats = {
  totalProjects: projects.length,
  pendingProjects: projects.filter(p => p.status === 'PENDING').length,
  // ... more stats
};

// 3. Create registry snapshot
const registryData = {
  version: '1.0',
  timestamp: new Date().toISOString(),
  stats,
  projects,
  activityFeed,
};

// 4. Upload to IPFS via Pinata
const ipfsResult = await uploadJSONToIPFS(registryData, 'BlueCarbon-Registry');

// 5. Save snapshot hash locally
await saveSnapshotHash({
  ipfsHash: ipfsResult.ipfsHash,
  ipfsUrl: ipfsResult.ipfsUrl,
  stats,
  timestamp: registryData.timestamp,
});
```

### Snapshot Storage

Snapshot metadata is stored in:
```
backend/data/latest-snapshot.json
```

Example content:
```json
{
  "ipfsHash": "QmXxxx...",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXxxx...",
  "stats": {
    "totalProjects": 5,
    "pendingProjects": 2,
    "approvedProjects": 3
  },
  "timestamp": "2024-02-24T10:30:00.000Z"
}
```

## Admin Dashboard Data Loading

### Loading Sequence

```javascript
// 1. Try to get latest IPFS hash
const ipfsData = await getLatestIPFSHash();

// 2. If hash exists and is valid, fetch from IPFS
if (ipfsData && validateHash(ipfsData.hash)) {
  const rawData = await fetchFromIPFS(ipfsData.hash);
  return parseAndValidateData(rawData);
}

// 3. Fallback to database
const projects = await getAllProjects();
return parseProjectsData(projects);

// 4. If no data, return zero-state
return getZeroStateData();
```

### Zero-State Data

When no projects exist, dashboard shows:
```javascript
{
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
}
```

## Troubleshooting

### Issue: "No IPFS snapshot found"

**Solution**: Click the "Refresh" button in admin dashboard to trigger initial sync.

### Issue: "IPFS sync failed"

**Possible causes**:
1. Pinata API keys not configured → Uses local fallback
2. Network connectivity issues → Falls back to database
3. Invalid data format → Check console logs

**Solution**: Dashboard automatically falls back to database. Check backend logs for details.

### Issue: Dashboard shows zero data

**Possible causes**:
1. No projects submitted yet
2. IPFS sync not triggered
3. Database connection issue

**Solution**:
1. Submit a test project as a user
2. Click "Refresh" in admin dashboard
3. Check MongoDB connection in backend logs

### Issue: Pinata upload fails

**Solution**: The system automatically falls back to local storage. Projects are still saved in MongoDB and accessible via database fallback.

## Testing Without Pinata

The system works without Pinata API keys:

1. Leave `PINATA_API_KEY` and `PINATA_SECRET_KEY` empty in `.env`
2. System uses mock IPFS hashes
3. Data is stored in MongoDB
4. Admin dashboard fetches from database
5. All functionality works normally

## Production Deployment

### Required Environment Variables

```env
# MongoDB (Required)
MONGO_URI=mongodb://your-production-db-url

# JWT Secret (Required - Use strong random string)
JWT_SECRET=your-secure-random-jwt-secret

# Pinata IPFS (Recommended for production)
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key

# Frontend URL (Required for CORS)
FRONTEND_URL=https://your-production-domain.com
```

### Deployment Checklist

- [ ] Configure production MongoDB
- [ ] Set secure JWT_SECRET
- [ ] Configure Pinata API keys
- [ ] Update FRONTEND_URL for CORS
- [ ] Create `backend/data/` directory on server
- [ ] Set proper file permissions for uploads and data directories
- [ ] Configure HTTPS for frontend
- [ ] Test IPFS sync in production
- [ ] Monitor backend logs for sync errors

## API Endpoints Reference

### Admin Endpoints

```
GET  /api/admin/ipfs-hash              - Get latest IPFS snapshot hash
POST /api/admin/sync-ipfs              - Manually trigger IPFS sync
POST /api/admin/projects/:id/approve   - Approve project (auto-sync)
POST /api/admin/projects/:id/reject    - Reject project (auto-sync)
POST /api/admin/projects/:id/send-to-verifier - Send to verifier (auto-sync)
GET  /api/admin/stats                  - Get dashboard statistics
GET  /api/admin/users                  - Get all users
```

### Project Endpoints

```
POST /api/projects     - Submit new project (auto-sync)
GET  /api/projects     - Get user's projects
GET  /api/projects/:id - Get single project
PUT  /api/projects/:id - Update project (auto-sync)
```

## File Structure

```
backend/
├── data/
│   ├── .gitkeep
│   └── latest-snapshot.json (auto-generated)
├── services/
│   └── ipfsSync.js
├── utils/
│   └── ipfs.js
├── routes/
│   ├── admin.js
│   └── project.js
└── .env

frontend/
├── src/
│   ├── services/
│   │   └── ipfsService.js
│   └── components/
│       └── Admin/
│           ├── AdminDashboard.jsx
│           └── QuickActions.jsx
└── .env
```

## Support

For issues or questions:
1. Check backend console logs
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Test Pinata API keys at https://app.pinata.cloud/
5. Review this guide for troubleshooting steps

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
