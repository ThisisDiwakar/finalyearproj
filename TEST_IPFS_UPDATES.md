# 🧪 Test IPFS Gateway Updates

## Quick Test to See Updates Working

### Step 1: Check Current Hash

```bash
cd backend
type data\latest-snapshot.json
```

**Note the `ipfsHash` value** - Example: `QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u`

### Step 2: View Current Data

Open in browser:
```
https://gateway.pinata.cloud/ipfs/YOUR_HASH_FROM_STEP_1
```

**Note the `totalProjects` count** - Example: 4

### Step 3: Submit New Project

1. **Login as user** (not admin)
2. **Go to "Submit Project"**
3. **Fill in details**:
   ```
   Project Name: IPFS Update Test
   Latitude: 13.0827
   Longitude: 80.2707
   State: Tamil Nadu
   Area: 3 hectares
   Ecosystem: Mangrove
   ```
4. **Click Submit**
5. **Wait for success message**

### Step 4: Check Backend Logs

Should see:
```
POST /api/projects 201
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created: QmNEWHASH...
✅ Snapshot hash saved
```

**Note the NEW hash** - It will be different!

### Step 5: Verify New Hash

```bash
type backend\data\latest-snapshot.json
```

**Compare**:
- Old hash: `QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u`
- New hash: `QmXxxx...` (different!)

### Step 6: View New Data

**Option A: New Gateway URL**
```
https://gateway.pinata.cloud/ipfs/NEW_HASH_FROM_STEP_5
```

Should show **5 projects** (or totalProjects + 1)

**Option B: Admin Dashboard**
1. Login as admin
2. Click "Refresh" button
3. Check browser console (F12):
   ```
   📦 Current IPFS Hash: QmNEWHASH...
   🔗 Gateway URL: https://gateway.pinata.cloud/ipfs/QmNEWHASH...
   ```
4. New project appears in table

### Step 7: Compare URLs

**Old URL** (still works, shows old data):
```
https://gateway.pinata.cloud/ipfs/QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u
Shows: 4 projects
```

**New URL** (shows updated data):
```
https://gateway.pinata.cloud/ipfs/QmNEWHASH...
Shows: 5 projects
```

**Both URLs work!** This proves IPFS immutability.

---

## Expected Results

### ✅ Success Indicators

1. **New hash created** - Different from old hash
2. **New hash in latest-snapshot.json** - Updated file
3. **New gateway URL shows new data** - 5 projects
4. **Old gateway URL shows old data** - 4 projects (unchanged)
5. **Admin dashboard shows new data** - Automatically uses latest hash

### ❌ If Something's Wrong

**Issue**: Same hash after submission

**Cause**: Auto-sync didn't trigger

**Fix**:
1. Check backend logs for sync messages
2. Manually trigger: Click "Refresh" in admin dashboard
3. Check Pinata connection: `node diagnose-pinata.js`

**Issue**: New hash but gateway shows old data

**Cause**: Using old hash URL

**Fix**:
1. Get new hash from `latest-snapshot.json`
2. Use new hash in gateway URL
3. Or use admin dashboard (automatic)

---

## Understanding the Results

### Why Two Different URLs?

IPFS is **content-addressed**:
- Different content = Different hash
- Each hash is permanent
- Old data never changes
- New data gets new hash

### This is a Feature, Not a Bug!

✅ **Immutability**: Old data can't be tampered with
✅ **Versioning**: All versions preserved
✅ **Verification**: Hash proves data authenticity
✅ **Audit Trail**: Complete history available

### How Admin Dashboard Handles This

The admin dashboard **automatically**:
1. Fetches latest hash from backend
2. Uses that hash to get latest data
3. Updates every 10 seconds
4. Shows current IPFS hash in console

**You don't need to track hashes manually!**

---

## Quick Reference

### Get Latest Hash
```bash
type backend\data\latest-snapshot.json | findstr ipfsHash
```

### View Latest Data
```bash
# Copy hash from above, then open:
start https://gateway.pinata.cloud/ipfs/HASH_HERE
```

### Force New Snapshot
```bash
# In admin dashboard, click "Refresh" button
```

### Check All Versions
```
Open: https://app.pinata.cloud/pinmanager
See all snapshots with different hashes
```

---

## Advanced: Track Hash Changes

### Create a Log

```bash
# Before submission
echo "Before:" > hash-log.txt
type backend\data\latest-snapshot.json | findstr ipfsHash >> hash-log.txt

# Submit project

# After submission (wait 5 seconds)
echo "After:" >> hash-log.txt
type backend\data\latest-snapshot.json | findstr ipfsHash >> hash-log.txt

# View changes
type hash-log.txt
```

**Expected output**:
```
Before:
  "ipfsHash": "QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u",
After:
  "ipfsHash": "QmXxxx...",
```

Hashes are different = Update successful!

---

## Summary

### How It Works

1. **User submits** → New data
2. **Auto-sync** → New snapshot
3. **New hash** → New gateway URL
4. **Admin dashboard** → Uses latest hash automatically

### What You See

- **Old gateway URL** → Old data (4 projects)
- **New gateway URL** → New data (5 projects)
- **Admin dashboard** → Always latest data

### What to Remember

✅ Each update creates a new hash
✅ Old hashes show old data (forever)
✅ New hashes show new data
✅ Admin dashboard tracks latest hash automatically
✅ All versions are preserved on IPFS

---

**Test this now to see IPFS updates in action!**

---

**Last Updated**: February 24, 2026
