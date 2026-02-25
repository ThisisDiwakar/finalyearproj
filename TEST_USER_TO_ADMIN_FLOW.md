# 🧪 Test User-to-Admin Flow

## Quick Test Guide

Follow these steps to verify user submissions appear in admin dashboard.

---

## Prerequisites

```bash
# 1. Backend running
cd backend
npm start

# 2. Frontend running (new terminal)
cd frontend
npm run dev

# 3. MongoDB running
# Should see: 📦 MongoDB: Connected ✅
```

---

## Test Flow

### Step 1: Submit Project as User (5 minutes)

1. **Open browser**: http://localhost:5173

2. **Register/Login as User**
   - Click "Register" or "Login"
   - Use existing user or create new:
     ```
     Name: Test User
     Email: testuser@example.com
     Password: Test123!
     Role: community_member
     ```

3. **Navigate to Submit Project**
   - Click "Submit Project" in navigation

4. **Fill Project Details**
   ```
   Project Name: Test Mangrove Restoration
   Description: Testing admin dashboard sync
   
   Location:
   - Latitude: 13.0827
   - Longitude: 80.2707
   - State: Tamil Nadu
   - District: Chennai
   - Village: Test Village
   
   Restoration:
   - Area: 5.5 hectares
   - Ecosystem Type: Mangrove
   - Species: Avicennia marina
   - Count: 500
   ```

5. **Upload Photo** (optional)
   - Click "Choose File"
   - Select any image

6. **Submit**
   - Click "Submit Project"
   - Wait for success message

7. **Check Backend Logs**
   ```
   Expected output:
   POST /api/projects 201
   🔄 Auto-syncing new project to IPFS...
   ✅ Registry snapshot created: QmXxxx...
   ✅ Snapshot hash saved
   ```

---

### Step 2: View in Admin Dashboard (2 minutes)

1. **Logout from User Account**
   - Click profile icon
   - Click "Logout"

2. **Login as Admin**
   - Email: admin@test.com
   - Password: Admin123!
   
   **Note**: If admin account doesn't exist, create one or update existing user:
   ```javascript
   // In MongoDB:
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```

3. **Verify Redirect**
   - Should automatically redirect to `/admin-dashboard`

4. **Wait for Data Load**
   - Dashboard loads automatically
   - Auto-refreshes every 30 seconds
   - Or click "Refresh" button for immediate update

5. **Verify Project Appears**
   
   **Check Stats Cards:**
   ```
   Total Projects: Should increase by 1
   Pending/Review: Should show 1
   ```
   
   **Check Projects Table:**
   ```
   Should see: "Test Mangrove Restoration"
   Status: SUBMITTED or REVIEW
   ```
   
   **Check Map:**
   ```
   Should see pin at Chennai location (13.0827, 80.2707)
   ```
   
   **Check Activity Feed:**
   ```
   Should show: "Test User submitted project..."
   ```

---

### Step 3: Test Admin Actions (3 minutes)

1. **Click on Project in Table**
   - Project drawer opens on right

2. **Review Project Details**
   - Name, location, area, CO₂, etc.

3. **Test Approve**
   - Click "Approve" button
   - Success message appears
   - Check backend logs:
     ```
     🔄 Auto-syncing to IPFS after approval...
     ✅ Registry snapshot created
     ```
   - Stats update automatically
   - Project status changes to "APPROVED"

4. **Alternative: Test Reject**
   - Click "Reject" button
   - Enter reason (optional)
   - Success message appears
   - Auto-sync triggers
   - Status changes to "REJECTED"

5. **Alternative: Send to Verifier**
   - Click "Send to Verifier"
   - Success message appears
   - Auto-sync triggers
   - Status changes to "REVIEW"

---

## Verification Checklist

After completing the test, verify:

### Backend
- [ ] Project saved to MongoDB
- [ ] Auto-sync triggered after submission
- [ ] IPFS snapshot created
- [ ] Snapshot file exists: `backend/data/latest-snapshot.json`
- [ ] Auto-sync triggered after admin action

### Frontend - User View
- [ ] Project submission successful
- [ ] Success message displayed
- [ ] Project appears in user's dashboard
- [ ] Status shows correctly

### Frontend - Admin View
- [ ] Dashboard loads without errors
- [ ] Stats cards show correct numbers
- [ ] Project appears in table
- [ ] Map shows project pin
- [ ] Activity feed shows submission
- [ ] Can click on project to view details
- [ ] Can approve/reject/send to verifier
- [ ] Stats update after actions

### Auto-Refresh
- [ ] Dashboard refreshes every 30 seconds
- [ ] New submissions appear automatically
- [ ] No errors in browser console

---

## Expected Results

### After User Submission

**Backend Console:**
```
POST /api/projects 201 - Project submitted
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created: QmXxxx...
✅ Snapshot hash saved
```

**MongoDB:**
```javascript
db.projects.find().pretty()
// Should show new project with status: "SUBMITTED"
```

**Snapshot File:**
```bash
cat backend/data/latest-snapshot.json
# Should show updated stats with new project
```

### After Admin Views Dashboard

**Backend Console:**
```
GET /api/admin/projects 200
# or
GET /api/admin/ipfs-hash 200
```

**Browser Console:**
```
📊 Fetching from database
✅ IPFS data loaded successfully
```

**Dashboard Display:**
- Total Projects: 1 (or more)
- Project in table with all details
- Map pin at correct location
- Activity feed entry

### After Admin Approves

**Backend Console:**
```
POST /api/admin/projects/:id/approve 200
🔄 Auto-syncing to IPFS after approval...
✅ Registry snapshot created
```

**Dashboard Updates:**
- Approved count increases
- Pending/Review count decreases
- Project status changes to "APPROVED"
- Activity feed shows approval

---

## Troubleshooting

### Issue: Project not appearing in admin dashboard

**Check 1: Backend logs**
```bash
# Should see after user submission:
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created
```

**Check 2: MongoDB**
```bash
mongo
use blue-carbon-registry
db.projects.find().pretty()
# Should show the project
```

**Check 3: Admin endpoint**
```bash
# Test directly (replace TOKEN with your JWT):
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/projects
```

**Check 4: Browser console**
```
F12 → Console tab
Look for errors or failed requests
```

**Fix: Manual refresh**
```
Click "Refresh" button in admin dashboard
Wait for sync to complete
```

---

### Issue: "401 Unauthorized" in admin dashboard

**Cause**: User is not admin

**Fix**:
```javascript
// Update user role in MongoDB:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

// Logout and login again
```

---

### Issue: Auto-refresh not working

**Check**: Browser console for errors

**Fix**:
1. Refresh page (F5)
2. Clear browser cache
3. Restart frontend:
   ```bash
   cd frontend
   npm run dev
   ```

---

### Issue: Stats showing 0

**Cause**: IPFS snapshot not created or outdated

**Fix**:
1. Click "Refresh" button
2. Wait for sync to complete
3. Check backend logs for sync confirmation

---

## Performance Test

### Test Multiple Submissions

1. **Submit 5 projects as user**
   - Use different names and locations
   - Wait 5 seconds between each

2. **Check admin dashboard**
   - All 5 should appear within 30 seconds
   - Or click "Refresh" for immediate update

3. **Verify stats**
   - Total Projects: 5
   - All appear in table
   - All pins on map

### Test Concurrent Actions

1. **Open two browser windows**
   - Window 1: User submitting project
   - Window 2: Admin viewing dashboard

2. **Submit project in Window 1**

3. **Watch Window 2**
   - Should update within 30 seconds
   - Or click "Refresh"

---

## Success Criteria

✅ **User can submit projects**
✅ **Projects save to MongoDB**
✅ **Auto-sync triggers after submission**
✅ **IPFS snapshot created**
✅ **Admin can view all projects**
✅ **Dashboard auto-refreshes**
✅ **Manual refresh works**
✅ **Admin can approve/reject**
✅ **Stats update correctly**
✅ **Map shows project locations**

---

## Quick Commands

### Check MongoDB
```bash
mongo
use blue-carbon-registry
db.projects.find().pretty()
db.users.find({ role: "admin" }).pretty()
```

### Check Snapshot File
```bash
cat backend/data/latest-snapshot.json
```

### Test Admin Endpoint
```bash
# Get your token from browser localStorage
# Then:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/projects | json_pp
```

### View Backend Logs
```bash
# Backend terminal shows real-time logs
# Look for:
# - POST /api/projects
# - Auto-syncing messages
# - GET /api/admin/projects
```

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Document any issues found
3. ✅ Test with real data
4. ✅ Test with multiple users
5. ✅ Prepare for production deployment

---

**Test Duration**: ~10 minutes
**Last Updated**: February 24, 2026
**Status**: Ready for Testing
