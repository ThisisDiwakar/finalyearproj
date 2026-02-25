# 🚀 Admin Dashboard - IPFS Quick Start

## 5-Minute Setup Guide

### Step 1: Configure Pinata (Optional - 2 minutes)

1. Go to https://app.pinata.cloud/ and create free account
2. Generate API keys (API Keys → New Key)
3. Copy keys to `backend/.env`:

```env
PINATA_API_KEY=your_key_here
PINATA_SECRET_KEY=your_secret_here
```

**Skip this step?** System works without Pinata using database fallback.

### Step 2: Start Servers (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

### Step 3: Test IPFS Sync (1 minute)

```bash
cd backend
node test-ipfs-sync.js
```

Expected output:
```
✅ MongoDB connected
✅ Snapshot created successfully!
📊 Total Projects: X
```

### Step 4: Access Admin Dashboard (1 minute)

1. Go to http://localhost:5173
2. Login with admin credentials
3. Click "Refresh" button
4. Data loads from IPFS!

---

## How It Works (30 seconds)

```
User Submits → MongoDB → Auto-Sync → IPFS → Admin Dashboard
```

**Auto-sync triggers:**
- ✅ New project submitted
- ✅ Project updated
- ✅ Admin approves/rejects
- ✅ Manual refresh clicked

---

## Admin Dashboard Features

### Stats Cards
- Total Projects (with status breakdown)
- Total Area Restored (hectares)
- Total CO₂ Impact (tons)
- Total Earnings Distributed

### India Map
- Visual project locations
- Color-coded by status:
  - 🔴 Red = Pending
  - 🟡 Amber = Review
  - 🟢 Green = Approved
  - ⚫ Grey = Rejected

### Projects Table
- All projects with details
- Click to open drawer
- Action buttons: Approve / Reject / Send to Verifier

### Activity Feed
- Recent project submissions
- Status changes
- Real-time updates

---

## Quick Actions Bar

### Filters
- All / Pending / Review / Approved / Rejected
- Time range: 30 days / 6 months / 1 year

### Buttons
- **Generate Report**: Export analytics (requires data)
- **Export CSV**: Download project list (requires data)
- **Refresh**: Trigger IPFS sync and reload data

---

## Common Tasks

### View New Submissions
1. Click "Pending" filter chip
2. Review projects in table
3. Click project to open details

### Approve a Project
1. Click project in table
2. Review details in drawer
3. Click "Approve" button
4. ✅ Auto-syncs to IPFS

### Reject a Project
1. Click project in table
2. Click "Reject" button
3. Enter rejection reason (optional)
4. ✅ Auto-syncs to IPFS

### Send to Verifier
1. Click project in table
2. Click "Send to Verifier"
3. Status changes to "REVIEW"
4. ✅ Auto-syncs to IPFS

### Manual Refresh
1. Click "Refresh" button in Quick Actions
2. Backend creates new IPFS snapshot
3. Dashboard reloads with latest data

---

## Troubleshooting (1 minute fixes)

### Dashboard shows zeros
**Fix**: Click "Refresh" button

### "No IPFS snapshot found"
**Fix**: Click "Refresh" to create initial snapshot

### IPFS sync fails
**Fix**: System automatically uses database fallback

### Map not showing
**Fix**: Check browser console, refresh page

### Projects not appearing
**Fix**: 
1. Check backend logs
2. Verify MongoDB connection
3. Click "Refresh" button

---

## API Endpoints (for developers)

```
GET  /api/admin/ipfs-hash              - Get latest IPFS hash
POST /api/admin/sync-ipfs              - Trigger manual sync
POST /api/admin/projects/:id/approve   - Approve project
POST /api/admin/projects/:id/reject    - Reject project
GET  /api/admin/stats                  - Get statistics
GET  /api/admin/users                  - Get all users
```

---

## Environment Variables

### Required
```env
MONGO_URI=mongodb://localhost:27017/blue-carbon-registry
JWT_SECRET=your_secure_secret_key
```

### Optional (for IPFS)
```env
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### Optional (for CORS)
```env
FRONTEND_URL=http://localhost:5173
```

---

## File Locations

```
backend/
├── data/
│   └── latest-snapshot.json    ← IPFS snapshot metadata
├── services/
│   └── ipfsSync.js             ← Sync logic
├── routes/
│   └── admin.js                ← Admin endpoints
└── .env                        ← Configuration

frontend/
├── src/
│   ├── services/
│   │   └── ipfsService.js      ← IPFS client
│   └── components/
│       └── Admin/
│           └── AdminDashboard.jsx
```

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can login as admin
- [ ] Dashboard displays (even with zeros)
- [ ] Map is visible
- [ ] Click "Refresh" works
- [ ] Can view project details
- [ ] Can approve/reject projects
- [ ] Stats update after actions

---

## Support Resources

- **Full Guide**: See `IPFS_INTEGRATION_GUIDE.md`
- **User Flow**: See `USER_TO_ADMIN_FLOW.md`
- **Architecture**: See `ADMIN_ARCHITECTURE.md`
- **Test Script**: Run `node backend/test-ipfs-sync.js`

---

## Production Deployment

1. Set secure `JWT_SECRET`
2. Configure production MongoDB
3. Add Pinata API keys
4. Update `FRONTEND_URL`
5. Enable HTTPS
6. Monitor backend logs

---

**Need Help?**
1. Check backend console logs
2. Check browser console
3. Run test script: `node backend/test-ipfs-sync.js`
4. Review troubleshooting section above

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
