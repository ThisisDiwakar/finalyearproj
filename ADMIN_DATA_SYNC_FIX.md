# 🔧 Admin Dashboard Data Sync - Fix Applied

## Issue

User-submitted projects were not appearing in the admin dashboard because:
1. Admin was fetching from `/api/projects` (user-specific endpoint)
2. No admin endpoint existed to fetch ALL projects
3. Dashboard wasn't refreshing automatically

## Solution Applied

### 1. Added Admin Projects Endpoint ✅

**File**: `backend/routes/admin.js`

Added new endpoint:
```javascript
GET /api/admin/projects
```

**Features**:
- Fetches ALL projects (not just user's own)
- Supports filtering by status
- Includes pagination
- Populates submittedBy user details
- Admin-only access

**Usage**:
```javascript
GET /api/admin/projects?status=SUBMITTED&limit=1000
```

### 2. Updated Frontend Service ✅

**File**: `frontend/src/services/ipfsService.js`

Changed `getAllProjects()` to use admin endpoint:
```javascript
// Before: /api/projects (user-specific)
// After: /api/admin/projects (all projects)
```

### 3. Added Auto-Refresh ✅

**File**: `frontend/src/components/Admin/AdminDashboard.jsx`

Added automatic refresh every 30 seconds:
```javascript
useEffect(() => {
  if (user?.role === 'admin') {
    loadData();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }
}, [user]);
```

## How It Works Now

### Complete Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER SUBMITS PROJECT                                 │
│    POST /api/projects                                   │
│    • Saves to MongoDB                                   │
│    • Status: SUBMITTED                                  │
│    • Triggers auto-sync to IPFS                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. AUTO-SYNC TO IPFS (Background)                       │
│    • Creates registry snapshot                          │
│    • Uploads to IPFS/Pinata                            │
│    • Saves hash to backend/data/latest-snapshot.json   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. ADMIN DASHBOARD AUTO-REFRESHES                       │
│    • Every 30 seconds                                   │
│    • Fetches from IPFS (or database fallback)          │
│    • GET /api/admin/projects (all projects)            │
│    • Updates dashboard display                          │
└─────────────────────────────────────────────────────────┘
```

## Testing the Fix

### Step 1: Restart Backend

```bash
cd backend
npm start
```

Verify server starts without errors.

### Step 2: Test User Submission

1. **Login as regular user**
   ```
   Email: user@test.com
   Role: community_member
   ```

2. **Submit a test project**
   - Go to "Submit Project"
   - Fill in details:
     - Project Name: "Test Mangrove Project"
     - Location: 13.0827, 80.2707
     - Area: 5 hectares
     - Ecosystem: Mangrove
   - Upload a photo
   - Click Submit

3. **Check backend logs**
   ```
   Project submitted successfully
   🔄 Auto-syncing new project to IPFS...
   ✅ Registry snapshot created: QmXxxx...
   ✅ Snapshot hash saved
   ```

### Step 3: Verify in Admin Dashboard

1. **Login as admin**
   ```
   Email: admin@test.com
   Role: admin
   ```

2. **Check dashboard**
   - Should redirect to `/admin-dashboard`
   - Wait up to 30 seconds for auto-refresh
   - Or click "Refresh" button manually

3. **Verify project appears**
   - ✅ Stats cards show updated numbers
   - ✅ Project appears in table
   - ✅ Map shows project pin
   - ✅ Activity feed shows submission

### Step 4: Manual Refresh (Optional)

If you don't want to wait for auto-refresh:

1. Click **"Refresh"** button in Quick Actions bar
2. This triggers immediate IPFS sync
3. Dashboard updates instantly

## API Endpoints Reference

### User Endpoints
```
POST /api/projects              - Submit new project
GET  /api/projects              - Get user's own projects only
PUT  /api/projects/:id          - Update user's own project
```

### Admin Endpoints
```
GET  /api/admin/projects        - Get ALL projects (NEW!)
GET  /api/admin/ipfs-hash       - Get latest IPFS snapshot
POST /api/admin/sync-ipfs       - Trigger manual sync
POST /api/admin/projects/:id/approve      - Approve project
POST /api/admin/projects/:id/reject       - Reject project
POST /api/admin/projects/:id/send-to-verifier - Send to verifier
GET  /api/admin/stats           - Get statistics
GET  /api/admin/users           - Get all users
```

## Troubleshooting

### Issue: Projects still not appearing

**Check 1: Backend logs**
```bash
# Look for these messages after user submission:
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created
✅ Snapshot hash saved
```

**Check 2: Database**
```bash
# Connect to MongoDB
mongo
use blue-carbon-registry
db.projects.find().pretty()

# Should show all submitted projects
```

**Check 3: Admin endpoint**
```bash
# Test the endpoint directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/projects
```

**Check 4: Frontend console**
```javascript
// Open browser console (F12)
// Look for:
📊 Fetching from database
✅ IPFS data loaded successfully
```

### Issue: "401 Unauthorized" on admin endpoint

**Cause**: User is not logged in as admin

**Solution**:
1. Verify user role in database:
   ```javascript
   db.users.find({ email: "admin@test.com" })
   // Should show: role: "admin"
   ```

2. If role is wrong, update:
   ```javascript
   db.users.updateOne(
     { email: "admin@test.com" },
     { $set: { role: "admin" } }
   )
   ```

3. Logout and login again

### Issue: Auto-refresh not working

**Cause**: Component unmounted or error in useEffect

**Solution**:
1. Check browser console for errors
2. Verify user role is 'admin'
3. Manually click "Refresh" button
4. Restart frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Issue: Old data showing

**Cause**: IPFS snapshot not updated

**Solution**:
1. Click "Refresh" button in admin dashboard
2. Wait for sync to complete
3. Check backend logs for sync confirmation
4. Verify `backend/data/latest-snapshot.json` updated

## Performance Considerations

### Auto-Refresh Interval

Current: 30 seconds

**To change**:
Edit `frontend/src/components/Admin/AdminDashboard.jsx`:
```javascript
// Change 30000 (30 seconds) to desired milliseconds
const intervalId = setInterval(() => {
  loadData();
}, 30000); // ← Change this value
```

**Recommendations**:
- Development: 30 seconds (current)
- Production with few users: 60 seconds
- Production with many users: 120 seconds

### Disable Auto-Refresh

If you prefer manual refresh only:

```javascript
// Comment out the interval
useEffect(() => {
  if (user?.role === 'admin') {
    loadData();
    
    // Auto-refresh disabled
    // const intervalId = setInterval(() => {
    //   loadData();
    // }, 30000);
    
    // return () => clearInterval(intervalId);
  }
}, [user]);
```

## Data Flow Verification

### Check Each Step

1. **User submits project**
   ```bash
   # Backend log should show:
   POST /api/projects 201
   🔄 Auto-syncing new project to IPFS...
   ```

2. **IPFS sync completes**
   ```bash
   # Backend log should show:
   ✅ Registry snapshot created: QmXxxx...
   ✅ Snapshot hash saved
   ```

3. **Snapshot file created**
   ```bash
   # Check file exists:
   ls backend/data/latest-snapshot.json
   
   # View contents:
   cat backend/data/latest-snapshot.json
   ```

4. **Admin fetches data**
   ```bash
   # Backend log should show:
   GET /api/admin/projects 200
   # or
   GET /api/admin/ipfs-hash 200
   ```

5. **Dashboard updates**
   ```javascript
   // Browser console should show:
   📊 Fetching from database
   ✅ IPFS data loaded successfully
   ```

## Summary of Changes

### Backend Changes
- ✅ Added `GET /api/admin/projects` endpoint
- ✅ Endpoint fetches ALL projects (not user-specific)
- ✅ Supports filtering and pagination
- ✅ Admin-only access control

### Frontend Changes
- ✅ Updated `getAllProjects()` to use admin endpoint
- ✅ Added auto-refresh every 30 seconds
- ✅ Cleanup interval on component unmount

### Benefits
- ✅ Projects appear immediately (within 30 seconds)
- ✅ No manual refresh needed
- ✅ Real-time dashboard updates
- ✅ Proper admin access control

## Next Steps

1. ✅ Restart backend server
2. ✅ Test user project submission
3. ✅ Verify admin dashboard updates
4. ✅ Check auto-refresh works
5. ✅ Test manual refresh button

## Production Recommendations

1. **Increase auto-refresh interval** to 60-120 seconds
2. **Add WebSocket** for real-time updates (optional)
3. **Implement caching** for better performance
4. **Add loading indicators** during refresh
5. **Monitor API usage** and adjust intervals

---

**Status**: ✅ FIXED
**Date**: February 24, 2026
**Version**: 1.0.1

**The admin dashboard now properly displays all user-submitted projects!**
