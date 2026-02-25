# 🚀 Quick Start Guide

## Start the System (3 Commands)

### 1. Start Backend
```bash
cd backend
npm start
```
Wait for: `✅ MongoDB connected` and `🚀 Server running on port 5000`

### 2. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### 3. Open Browser
```
http://localhost:5173/
```

---

## Test IPFS Sync

```bash
cd backend
node test-ipfs-sync.js
```

**Expected Output**:
```
✅ MongoDB connected
✅ Pinata API keys configured
✅ Registry snapshot created: QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
🎉 All tests passed!
```

---

## User Flow

### As Regular User
1. Register/Login → `http://localhost:5173/register`
2. Submit Project → Fill form with GPS location, area, photos
3. View Projects → See your submitted projects
4. Wait for Admin → Admin will review and approve

### As Admin
1. Login → `http://localhost:5173/login` (use admin credentials)
2. View Dashboard → See all projects on map
3. Review Projects → Click on map markers or table rows
4. Approve/Reject → Click action buttons
5. Refresh → Click refresh to sync latest IPFS data

---

## Check IPFS Updates

### Method 1: Browser Console (F12)
```javascript
// Look for these logs:
🔍 Checking for IPFS snapshot...
📦 Found IPFS hash: QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
✅ Loaded X projects from IPFS
```

### Method 2: Check Snapshot File
```bash
cat backend/data/latest-snapshot.json
```

### Method 3: Direct Gateway Access
```
https://gateway.pinata.cloud/ipfs/{HASH_FROM_SNAPSHOT_FILE}
```

---

## Common Issues

### Backend won't start
**Check**: Is MongoDB running?
```bash
# Check .env file has MONGO_URI
cat backend/.env | grep MONGO_URI
```

### Frontend shows errors
**Check**: Is backend running on port 5000?
```bash
curl http://localhost:5000/api/health
```

### IPFS not syncing
**Check**: Are Pinata keys configured?
```bash
cd backend
node diagnose-pinata.js
```

### Old data showing in admin
**Solution**: Click "Refresh" button in admin dashboard

---

## File Locations

### Configuration
- Backend env: `backend/.env`
- Frontend env: `frontend/.env` (optional)
- Latest IPFS hash: `backend/data/latest-snapshot.json`

### Uploads
- Photos: `backend/uploads/`
- ID proofs: `backend/uploads/id-proofs/`

### Logs
- Backend: Terminal where `npm start` is running
- Frontend: Browser console (F12)

---

## Quick Commands

```bash
# Test everything
cd backend && node test-ipfs-sync.js

# Check Pinata
cd backend && node diagnose-pinata.js

# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev

# View logs
# Backend: Check terminal
# Frontend: Open browser console (F12)
```

---

## What to Expect

### After User Submits Project
1. Backend saves to MongoDB
2. Backend auto-syncs to IPFS (creates new hash)
3. New hash saved to `latest-snapshot.json`
4. Admin dashboard will show new project on next refresh

### After Admin Approves/Rejects
1. Project status updated in MongoDB
2. Backend auto-syncs to IPFS (creates new hash)
3. Statistics update automatically
4. New hash available for verification

### IPFS Hash Changes
- **This is normal!** Each data change creates a new hash
- Old hashes show old data (by design)
- Admin dashboard always fetches latest hash
- You can verify any historical snapshot using old hashes

---

## Success Indicators

### Backend Running ✅
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### Frontend Running ✅
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### IPFS Working ✅
```
✅ Pinata API keys configured
✅ Registry snapshot created
```

### Admin Dashboard Working ✅
- Map displays with dark ocean theme
- Projects show as markers
- Statistics show correct numbers
- Browser console shows IPFS hash

---

## Need Help?

### Check Documentation
- `SYSTEM_STATUS_FINAL.md` - Complete system status
- `IPFS_UPDATES_WORKING.md` - IPFS explanation
- `IPFS_GATEWAY_EXPLAINED.md` - How IPFS works
- `PINATA_SETUP_GUIDE.md` - Pinata configuration

### Run Diagnostics
```bash
# Test IPFS
cd backend && node test-ipfs-sync.js

# Test Pinata
cd backend && node diagnose-pinata.js
```

### Check Logs
- Backend: Terminal output
- Frontend: Browser console (F12)
- MongoDB: Check connection string in `.env`

---

**System Status**: 🟢 READY

**Last Updated**: 2026-02-24

**Current IPFS Hash**: Check `backend/data/latest-snapshot.json`
