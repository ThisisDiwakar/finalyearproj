# 🚀 Quick Test - 5 Minutes

## Start Here

Follow these exact steps to test the admin dashboard data sync.

---

## Step 1: Start Servers (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm start

# Wait for: 📦 MongoDB: Connected ✅

# Terminal 2 - Frontend
cd frontend
npm run dev

# Wait for: Local: http://localhost:5173
```

---

## Step 2: Submit Project as User (2 minutes)

1. **Open**: http://localhost:5173

2. **Login/Register**:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Role: `community_member`

3. **Submit Project**:
   - Click "Submit Project"
   - Fill:
     ```
     Name: Quick Test Project
     Latitude: 13.0827
     Longitude: 80.2707
     State: Tamil Nadu
     Area: 5
     Ecosystem: Mangrove
     ```
   - Click Submit
   - Wait for success message

4. **Check Backend Terminal**:
   ```
   Should see:
   POST /api/projects 201
   🔄 Auto-syncing...
   ✅ Registry snapshot created
   ```

---

## Step 3: View in Admin Dashboard (2 minutes)

1. **Logout** (click profile → logout)

2. **Login as Admin**:
   - Email: `admin@test.com`
   - Password: `Admin123!`
   
   **No admin?** Run this in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { role: "admin" } }
   )
   ```

3. **Wait 10 Seconds** (or click "Refresh")

4. **Verify**:
   - ✅ Total Projects: 1
   - ✅ Project in table
   - ✅ Pin on map
   - ✅ Activity feed entry

---

## Expected Results

### Browser Console (F12)
```
🔄 Loading admin dashboard data...
📊 Fetching admin data from database...
✅ Loaded 1 projects from database
```

### Backend Console
```
GET /api/admin/projects 200
```

### Dashboard Display
```
Total Projects: 1
Pending/Review: 1
Total Area: 5.00 hectares
Total CO₂: ~75 tons
```

---

## If It Doesn't Work

### Check 1: MongoDB
```bash
mongo
use blue-carbon-registry
db.projects.find().pretty()
```
Should show your project.

### Check 2: User Role
```bash
mongo
use blue-carbon-registry
db.users.find({ email: "admin@test.com" })
```
Should show `role: "admin"`.

### Check 3: Browser Console
```
F12 → Console tab
Look for errors
```

### Check 4: Backend Logs
```
Should see GET /api/admin/projects requests
```

---

## Quick Fixes

### Fix 1: Make User Admin
```javascript
// In MongoDB:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
// Logout and login again
```

### Fix 2: Force Refresh
```
Click "Refresh" button in admin dashboard
```

### Fix 3: Restart Everything
```bash
# Stop both servers (Ctrl+C)
# Start backend
cd backend
npm start

# Start frontend
cd frontend
npm run dev
```

---

## Success!

If you see:
- ✅ Project in admin table
- ✅ Stats showing correct numbers
- ✅ Map pin at location
- ✅ Activity feed entry

**You're done! Everything is working!**

---

## Next: Test Real-Time

1. Keep admin dashboard open
2. Open new tab, login as user
3. Submit another project
4. Watch admin dashboard update within 10 seconds

---

**Time**: 5 minutes
**Difficulty**: Easy
**Result**: Working admin dashboard!
