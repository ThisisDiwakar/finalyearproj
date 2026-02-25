# 🚀 Admin Dashboard - Quick Setup Guide

## Step 1: Environment Setup

Create `frontend/.env` file:
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_IPFS_ENABLED=false
```

## Step 2: Install Dependencies (if needed)

The required packages are already in `package.json`:
- `react-leaflet@^4.2.1`
- `leaflet@^1.9.4`
- `react-hot-toast@^2.4.1`

If you need to reinstall:
```bash
cd frontend
npm install
```

## Step 3: Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
╔══════════════════════════════════════════════════╗
║  🌊 Blue Carbon Registry API Server             ║
║  📡 Running on: http://localhost:5000           ║
║  📦 MongoDB: Connected ✅                        ║
║  🔗 IPFS: Local Fallback                        ║
╚══════════════════════════════════════════════════╝
```

## Step 4: Start Frontend Server

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.4.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 5: Create Admin User

### Option A: Via Registration UI

1. Go to `http://localhost:5173/register`
2. Fill in basic details (Step 1)
3. Select **"Admin"** role (Step 2)
4. Fill admin-specific fields:
   - Government Agency: Select from dropdown
   - Employee ID: 8-12 digits (e.g., `12345678`)
   - ID Proof: Upload JPG/PNG file
5. Submit registration

### Option B: Via API (Postman/cURL)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: multipart/form-data" \
  -F "name=Admin User" \
  -F "email=admin@test.gov.in" \
  -F "password=admin123" \
  -F "role=admin" \
  -F "governmentAgency=National Centre for Coastal Research (NCCR)" \
  -F "employeeId=12345678" \
  -F "idProof=@/path/to/id-proof.jpg"
```

## Step 6: Login as Admin

1. Go to `http://localhost:5173/login`
2. Enter admin credentials:
   - Email: `admin@test.gov.in`
   - Password: `admin123`
3. Click "Login"

**Expected Behavior:**
- You'll be automatically redirected to `/admin` (not `/dashboard`)
- Admin dashboard loads with ocean gradient theme
- All stats show `0` (waiting for IPFS sync)

## Step 7: Test Admin Dashboard

### Test 1: Navigation
- ✅ Navbar shows "Admin Panel" link
- ✅ Clicking "Dashboard" redirects to `/admin`
- ✅ Header shows "ADMIN" badge with your initial

### Test 2: IPFS Sync (Mock Data)
- Click "Refresh IPFS" button
- Toast notification: "IPFS Data Synced Successfully"
- Stats cards populate with mock data:
  - Total Projects: 24
  - Total Area: 156.75 ha
  - Total CO₂: 3420.5 tons
  - Total Earnings: ₹2,850,000

### Test 3: Map Interaction
- Map renders with India centered
- 2 project pins appear (Tamil Nadu, Kerala)
- Click a pin → Project drawer slides in from right
- Click overlay → Drawer closes

### Test 4: Project Actions
- Open project drawer
- Click "Approve" → Success toast
- Click "Reject" → Success toast
- Click "Send to Verifier" → Success toast

### Test 5: Analytics Panel
- Click "Analytics" in header
- Panel appears with charts
- Shows state distribution, CO₂ overview, status distribution
- Click X to close

### Test 6: Projects Table
- Table shows 2 mock projects
- Columns: Project ID, State, Area, CO₂, Community, Submitted, Status
- Status pills are color-coded
- Click eye icon → Opens project drawer

### Test 7: Activity Feed
- Shows 2 recent activities
- Timeline with colored dots
- Relative timestamps ("2h ago")

## Step 8: Test Non-Admin Access

1. Logout
2. Register/Login as regular user (role: `community`)
3. Try to access `http://localhost:5173/admin`

**Expected Behavior:**
- Automatically redirected to `/dashboard`
- No "Admin Panel" link in navbar
- Cannot access admin routes

## Troubleshooting

### Issue: "Cannot access /admin"
**Solution:** Verify user role is `admin` in localStorage:
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('bcr_user'));
console.log(user.role); // Should be "admin"
```

### Issue: "IPFS Sync Failed"
**Solution:** This is expected in development. Mock data will be used.
- Check `VITE_IPFS_ENABLED=false` in `.env`
- Backend `/api/admin/ipfs-hash` returns mock hash

### Issue: Map not rendering
**Solution:** Check Leaflet CSS is loaded:
```javascript
// In IndiaMap.jsx
import 'leaflet/dist/leaflet.css';
```

### Issue: Stats show 0 after refresh
**Solution:** Check browser console for errors:
```javascript
// Should see in console:
"IPFS disabled in development. Using mock data."
```

### Issue: Admin routes return 403
**Solution:** Verify JWT token and role:
```bash
# Check token in request headers
Authorization: Bearer <your-token>

# Backend should log:
"Role 'community' is not authorized for this action."
```

## Next Steps

### Connect Real IPFS
1. Set up IPFS node or Pinata account
2. Update backend to store/retrieve IPFS hashes
3. Set `VITE_IPFS_ENABLED=true` in frontend `.env`
4. Implement actual IPFS data structure

### Add Real Project Data
1. Submit projects via `/submit` route
2. Projects stored in MongoDB
3. Admin can approve/reject from dashboard
4. Status updates reflect in database

### Deploy to Production
1. Set production environment variables
2. Configure CORS for production domain
3. Set up HTTPS for secure admin access
4. Enable rate limiting for admin endpoints

## Quick Reference

### Admin Routes
- `/admin` - Main dashboard
- `/api/admin/ipfs-hash` - Get IPFS hash
- `/api/admin/projects/:id/approve` - Approve project
- `/api/admin/projects/:id/reject` - Reject project
- `/api/admin/projects/:id/send-to-verifier` - Send to verifier
- `/api/admin/stats` - Get statistics

### Key Files
- `frontend/src/components/Admin/AdminDashboard.jsx` - Main component
- `frontend/src/services/ipfsService.js` - IPFS logic
- `backend/routes/admin.js` - Admin API endpoints
- `backend/middleware/auth.js` - Role authorization

### Color Codes
- 🔴 Pending: `#FF4D4F`
- 🟡 Review: `#FFC107`
- 🟢 Approved: `#00C853`
- ⚫ Rejected: `#6C757D`
- 🔵 Primary: `#00E0B8`

---

**Dashboard is ready! Login as admin and explore.** 🎉
