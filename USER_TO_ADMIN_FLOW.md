# 🌊 User to Admin Dashboard Flow

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER SUBMITS PROJECT                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/projects                                             │
│  • Validates project data                                       │
│  • Uploads photos to IPFS (via Pinata)                         │
│  • Saves project to MongoDB                                     │
│  • Status: SUBMITTED                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AUTO-SYNC TRIGGERED                                            │
│  • autoSyncToIPFS() called in background                        │
│  • Non-blocking (doesn't delay user response)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  CREATE REGISTRY SNAPSHOT                                       │
│  • Fetch all projects from MongoDB                              │
│  • Calculate aggregate statistics                               │
│  • Generate activity feed                                       │
│  • Create JSON snapshot                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  UPLOAD TO IPFS (Pinata)                                        │
│  • uploadJSONToIPFS(registryData)                              │
│  • Returns IPFS hash (e.g., QmXxxx...)                         │
│  • Pinned permanently on IPFS network                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  SAVE SNAPSHOT METADATA                                         │
│  • Store in backend/data/latest-snapshot.json                   │
│  • Contains: ipfsHash, ipfsUrl, stats, timestamp                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN OPENS DASHBOARD                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FETCH IPFS DATA                                                │
│  • GET /api/admin/ipfs-hash                                     │
│  • Returns latest IPFS hash                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOAD FROM IPFS                                                 │
│  • Fetch data from IPFS gateway                                 │
│  • Parse and validate data                                      │
│  • Update dashboard state                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD DISPLAYS DATA                                        │
│  • Stats cards show metrics                                     │
│  • Map shows project locations                                  │
│  • Table lists all projects                                     │
│  • Activity feed shows recent actions                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN TAKES ACTION                                             │
│  • Approve / Reject / Send to Verifier                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AUTO-SYNC TRIGGERED AGAIN                                      │
│  • Updates IPFS with new project status                         │
│  • Dashboard refreshes automatically                            │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step User Journey

### Phase 1: User Submits Project

**User Actions:**
1. User logs in as "community_member" or "ngo"
2. Navigates to "Submit Project" page
3. Fills in project details:
   - Project name
   - Location (latitude, longitude, state, district)
   - Area in hectares
   - Ecosystem type (mangrove, seagrass, etc.)
   - Species planted
   - Photos (up to 5)
4. Clicks "Submit Project"

**Backend Processing:**
```javascript
// 1. Validate input
const errors = validationResult(req);

// 2. Upload photos to IPFS
for (const file of req.files) {
  const ipfsResult = await uploadToIPFS(file.path, file.originalname);
  photoRecords.push({
    ipfsHash: ipfsResult.ipfsHash,
    ipfsUrl: ipfsResult.ipfsUrl
  });
}

// 3. Create project in MongoDB
const project = new Project({
  projectName,
  location,
  restoration,
  photos: photoRecords,
  status: 'SUBMITTED'
});
await project.save();

// 4. Trigger auto-sync (non-blocking)
autoSyncToIPFS().catch(err => console.error('Auto-sync failed:', err));

// 5. Return success response
res.status(201).json({ success: true, data: { project } });
```

**User Sees:**
- ✅ Success message: "Project submitted successfully!"
- Project appears in their dashboard
- Status: "SUBMITTED"

### Phase 2: Auto-Sync to IPFS

**Background Process (Automatic):**

```javascript
// 1. Fetch all projects
const projects = await Project.find({})
  .populate('submittedBy')
  .sort({ createdAt: -1 });

// 2. Calculate statistics
const stats = {
  totalProjects: projects.length,
  pendingProjects: projects.filter(p => p.status === 'PENDING').length,
  reviewProjects: projects.filter(p => p.status === 'REVIEW').length,
  approvedProjects: projects.filter(p => p.status === 'APPROVED').length,
  rejectedProjects: projects.filter(p => p.status === 'REJECTED').length,
  totalArea: projects.reduce((sum, p) => sum + p.restoration.areaHectares, 0),
  totalCarbon: projects.reduce((sum, p) => sum + p.carbon.estimatedCO2e, 0)
};

// 3. Create activity feed
const activityFeed = projects.slice(0, 20).map(p => ({
  id: p._id,
  action: `${p.community.name} submitted ${p.projectId}`,
  timestamp: p.createdAt,
  status: p.status.toLowerCase()
}));

// 4. Create registry snapshot
const registryData = {
  version: '1.0',
  timestamp: new Date().toISOString(),
  stats,
  projects,
  activityFeed
};

// 5. Upload to IPFS
const ipfsResult = await uploadJSONToIPFS(
  registryData,
  `BlueCarbon-Registry-${new Date().toISOString()}`
);

// 6. Save snapshot metadata
await saveSnapshotHash({
  ipfsHash: ipfsResult.ipfsHash,
  ipfsUrl: ipfsResult.ipfsUrl,
  stats,
  timestamp: registryData.timestamp
});
```

**Console Output:**
```
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created: QmXxxx...
✅ Snapshot hash saved
```

### Phase 3: Admin Views Dashboard

**Admin Actions:**
1. Admin logs in with admin credentials
2. Automatically redirected to Admin Dashboard
3. Dashboard loads with `fetchIPFSData()`

**Frontend Loading Process:**

```javascript
// 1. Component mounts
useEffect(() => {
  if (user?.role === 'admin') {
    loadData();
  }
}, [user]);

// 2. Load data function
const loadData = async () => {
  setLoading(true);
  try {
    const data = await fetchIPFSData();
    setDashboardData(data);
    if (data.totalProjects > 0) {
      toast.success('Data loaded successfully');
    }
  } catch (error) {
    console.error('Data load failed:', error);
  } finally {
    setLoading(false);
  }
};

// 3. Fetch IPFS data
const fetchIPFSData = async () => {
  // Try IPFS first
  const ipfsData = await getLatestIPFSHash();
  
  if (ipfsData && validateHash(ipfsData.hash)) {
    const rawData = await fetchFromIPFS(ipfsData.hash);
    return parseAndValidateData(rawData);
  }
  
  // Fallback to database
  const projects = await getAllProjects();
  return parseProjectsData(projects);
};
```

**Admin Sees:**

If data exists:
- 📊 Stats cards with real numbers
- 🗺️ Map with project pins
- 📋 Projects table with all submissions
- 📰 Activity feed with recent actions

If no data yet:
- All metrics show 0
- Map displays with "No Active Projects" overlay
- Empty table with "No Projects Available" message
- Empty activity feed

### Phase 4: Admin Refreshes Data

**Admin Actions:**
1. Clicks "Refresh" button in Quick Actions bar

**Frontend Process:**

```javascript
const handleRefresh = async () => {
  const toastId = toast.loading('Triggering IPFS sync...');
  try {
    // 1. Trigger backend sync
    await triggerIPFSSync();
    toast.success('IPFS sync completed', { id: toastId });
    
    // 2. Refresh dashboard
    await onRefresh();
  } catch (error) {
    toast.error('IPFS sync failed. Trying database fallback...', { id: toastId });
    await onRefresh(); // Still try database
  }
};
```

**Backend Process:**

```javascript
// POST /api/admin/sync-ipfs
router.post('/sync-ipfs', auth, authorize('admin'), async (req, res) => {
  console.log('🔄 Starting IPFS sync...');
  const snapshot = await autoSyncToIPFS();
  
  res.status(200).json({
    success: true,
    message: 'Registry synced to IPFS successfully',
    data: snapshot
  });
});
```

**Admin Sees:**
- 🔄 Loading toast: "Triggering IPFS sync..."
- ✅ Success toast: "IPFS sync completed"
- 📊 Dashboard updates with latest data
- Numbers animate counting up

### Phase 5: Admin Takes Action

**Admin Actions:**
1. Clicks on a project in the table or map
2. Project drawer opens on the right
3. Reviews project details
4. Clicks action button:
   - "Approve" → Status changes to APPROVED
   - "Reject" → Status changes to REJECTED
   - "Send to Verifier" → Status changes to REVIEW

**Backend Process:**

```javascript
// POST /api/admin/projects/:id/approve
router.post('/projects/:id/approve', auth, authorize('admin'), async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  project.status = 'APPROVED';
  project.approvedBy = req.user.id;
  project.approvedAt = new Date();
  await project.save();
  
  // Auto-sync after approval
  console.log('🔄 Auto-syncing to IPFS after approval...');
  autoSyncToIPFS().catch(err => console.error('Auto-sync failed:', err));
  
  res.status(200).json({
    success: true,
    message: 'Project approved successfully. Syncing to IPFS...'
  });
});
```

**Admin Sees:**
- ✅ Success message: "Project approved successfully"
- Project status updates in table
- Stats cards update automatically
- Activity feed shows new action

**User Sees (in their dashboard):**
- Project status changes to "APPROVED"
- Can now proceed with minting NFT (if implemented)

## Data Synchronization Points

### Automatic Sync Triggers

1. **User submits new project**
   - File: `backend/routes/project.js`
   - Endpoint: `POST /api/projects`
   - Trigger: After `project.save()`

2. **User updates project**
   - File: `backend/routes/project.js`
   - Endpoint: `PUT /api/projects/:id`
   - Trigger: After `project.save()`

3. **Admin approves project**
   - File: `backend/routes/admin.js`
   - Endpoint: `POST /api/admin/projects/:id/approve`
   - Trigger: After status update

4. **Admin rejects project**
   - File: `backend/routes/admin.js`
   - Endpoint: `POST /api/admin/projects/:id/reject`
   - Trigger: After status update

5. **Admin sends to verifier**
   - File: `backend/routes/admin.js`
   - Endpoint: `POST /api/admin/projects/:id/send-to-verifier`
   - Trigger: After status update

### Manual Sync Trigger

6. **Admin clicks Refresh**
   - File: `frontend/src/components/Admin/QuickActions.jsx`
   - Action: `handleRefresh()`
   - Calls: `triggerIPFSSync()` → `POST /api/admin/sync-ipfs`

## Error Handling & Fallbacks

### Scenario 1: Pinata Not Configured

**Behavior:**
- System uses mock IPFS hashes
- Data stored in MongoDB only
- Dashboard fetches from database
- All functionality works normally

**User Impact:** None (transparent fallback)

### Scenario 2: IPFS Fetch Fails

**Behavior:**
```javascript
try {
  const rawData = await fetchFromIPFS(ipfsHash);
  return parseAndValidateData(rawData);
} catch (ipfsError) {
  console.warn('⚠️ IPFS fetch failed, falling back to database');
  const projects = await getAllProjects();
  return parseProjectsData(projects);
}
```

**User Impact:** Slight delay, but data still loads

### Scenario 3: No Data Exists

**Behavior:**
- Returns zero-state data
- Dashboard shows all zeros
- Map displays with overlay message
- No errors thrown

**User Impact:** Clear indication that no projects exist yet

## Testing the Complete Flow

### Test Script

```bash
# 1. Test IPFS sync
cd backend
node test-ipfs-sync.js

# 2. Start backend
npm start

# 3. Start frontend (in new terminal)
cd frontend
npm run dev
```

### Manual Testing Steps

1. **Register as User**
   - Go to http://localhost:5173/register
   - Email: user@test.com
   - Password: Test123!
   - Role: community_member

2. **Submit Test Project**
   - Login as user
   - Go to "Submit Project"
   - Fill in details:
     - Name: "Test Mangrove Restoration"
     - Location: 13.0827, 80.2707 (Chennai)
     - Area: 5.5 hectares
     - Ecosystem: Mangrove
   - Upload a test image
   - Submit

3. **Check Backend Logs**
   - Should see: "🔄 Auto-syncing new project to IPFS..."
   - Should see: "✅ Registry snapshot created: QmXxxx..."

4. **Login as Admin**
   - Logout
   - Login with admin credentials
   - Or manually change user role in MongoDB:
     ```javascript
     db.users.updateOne(
       { email: "admin@test.com" },
       { $set: { role: "admin" } }
     )
     ```

5. **View Admin Dashboard**
   - Should redirect to /admin-dashboard
   - Click "Refresh" button
   - Should see:
     - Total Projects: 1
     - Pending: 1
     - Map pin at Chennai location
     - Project in table

6. **Approve Project**
   - Click on project in table
   - Drawer opens
   - Click "Approve"
   - Should see success message
   - Stats update automatically

7. **Verify User Dashboard**
   - Logout and login as user
   - Project status should show "APPROVED"

## Monitoring & Debugging

### Backend Logs to Watch

```
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created: QmXxxx...
✅ Snapshot hash saved
```

### Frontend Console Logs

```
📦 Fetching from IPFS: QmXxxx...
✅ IPFS data loaded successfully
```

### Common Issues

**Issue**: Dashboard shows zeros
- **Check**: Backend logs for sync errors
- **Fix**: Click "Refresh" button

**Issue**: "No IPFS snapshot found"
- **Check**: `backend/data/latest-snapshot.json` exists
- **Fix**: Click "Refresh" to create initial snapshot

**Issue**: IPFS sync fails
- **Check**: Pinata API keys in `.env`
- **Fix**: System automatically falls back to database

## Production Considerations

1. **IPFS Pinning**
   - Use Pinata Pro for guaranteed uptime
   - Set up automatic re-pinning
   - Monitor pin status

2. **Snapshot Frequency**
   - Current: After every change
   - Production: Consider rate limiting
   - Option: Batch updates every 5 minutes

3. **Data Validation**
   - Validate IPFS data before parsing
   - Handle malformed data gracefully
   - Log validation errors

4. **Performance**
   - Cache IPFS data in Redis
   - Use CDN for IPFS gateway
   - Implement pagination for large datasets

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
