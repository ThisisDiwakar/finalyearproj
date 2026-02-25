# 🔗 IPFS Gateway Updates - How It Works

## Understanding IPFS Hashes

### Key Concept: Content-Addressed Storage

IPFS uses **content-addressed** storage, which means:
- Each unique piece of data gets a unique hash
- If data changes, the hash changes
- Old hash = old data (forever)
- New hash = new data

### Example

**Initial Data** (4 projects):
```
Hash: QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u
URL: https://gateway.pinata.cloud/ipfs/QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u
```

**After Adding Project** (5 projects):
```
Hash: QmXxxx... (NEW HASH!)
URL: https://gateway.pinata.cloud/ipfs/QmXxxx... (NEW URL!)
```

**Important**: The old URL will ALWAYS show old data (4 projects). This is by design!

---

## How Your System Works

### Data Flow

```
1. User Submits Project
        ↓
2. Saved to MongoDB
        ↓
3. Auto-Sync Triggered
        ↓
4. NEW IPFS Snapshot Created
        ↓
5. NEW Hash Generated
        ↓
6. NEW Hash Saved to backend/data/latest-snapshot.json
        ↓
7. Admin Dashboard Fetches NEW Hash
        ↓
8. Admin Dashboard Shows NEW Data
```

### Why Gateway URL Doesn't Update

The gateway URL you're looking at is **static** - it points to a specific snapshot in time.

**Old URL** (4 projects):
```
https://gateway.pinata.cloud/ipfs/QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u
```

**New URL** (5 projects):
```
https://gateway.pinata.cloud/ipfs/QmXxxx... (different hash)
```

---

## How to See Updated Data

### Method 1: Check Latest Hash (Recommended)

```bash
# Check the latest hash file
type backend\data\latest-snapshot.json
```

This shows the **current** IPFS hash with latest data.

**Example output**:
```json
{
  "ipfsHash": "QmNewHash123...",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmNewHash123...",
  "stats": {
    "totalProjects": 5  ← Updated!
  }
}
```

### Method 2: Use Admin Dashboard

The admin dashboard **automatically** fetches the latest hash:

1. Open admin dashboard
2. Wait 10 seconds (auto-refresh)
3. Or click "Refresh" button
4. Dashboard shows latest data from latest IPFS hash

### Method 3: Check Browser Console

Open browser console (F12) and look for:
```
📦 Current IPFS Hash: QmXxxx...
🔗 Gateway URL: https://gateway.pinata.cloud/ipfs/QmXxxx...
```

This is the **current** gateway URL with latest data.

---

## Testing the Update Flow

### Step 1: Note Current Hash

```bash
cd backend
type data\latest-snapshot.json
```

Note the `ipfsHash` value.

### Step 2: Submit New Project

1. Login as user
2. Submit a test project
3. Wait for success message

### Step 3: Check Backend Logs

Should see:
```
POST /api/projects 201
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created: QmNEWHASH...
✅ Snapshot hash saved
```

### Step 4: Verify New Hash

```bash
type backend\data\latest-snapshot.json
```

The `ipfsHash` should be **different** now!

### Step 5: View New Data

**Option A: Admin Dashboard**
1. Open admin dashboard
2. Click "Refresh"
3. Check browser console for new hash
4. New project appears

**Option B: Direct Gateway**
```
# Copy the NEW hash from latest-snapshot.json
# Open in browser:
https://gateway.pinata.cloud/ipfs/NEW_HASH_HERE
```

---

## Understanding the System

### What Gets Stored on IPFS

1. **Registry Snapshots** (JSON files)
   - All projects
   - Statistics
   - Activity feed
   - Metadata

2. **Project Photos** (Image files)
   - Each photo gets its own hash
   - Stored permanently
   - Referenced in project data

### How Hashes Work

```
Data → Hash Function → Unique Hash

Same Data → Same Hash
Different Data → Different Hash
```

**Example**:
```
Projects: [A, B, C, D] → Hash: QmABC123...
Projects: [A, B, C, D, E] → Hash: QmDEF456... (different!)
```

### Why This is Good

✅ **Immutable**: Old data can't be changed
✅ **Verifiable**: Hash proves data authenticity
✅ **Permanent**: Old versions always accessible
✅ **Decentralized**: Data on IPFS network

---

## Viewing Different Versions

### Current Version (Latest)
```bash
# Get latest hash
type backend\data\latest-snapshot.json

# View in browser
https://gateway.pinata.cloud/ipfs/LATEST_HASH
```

### Previous Versions

All previous versions are still on IPFS!

**Check Pinata Dashboard**:
1. Go to: https://app.pinata.cloud/pinmanager
2. See all uploaded snapshots
3. Each has a different hash
4. Click any to view that version

**Example**:
```
Snapshot 1 (4 projects): QmVt8ivsSsS1BnG3PTbNFXtyHVATv4REFT1rRMiYyshE5u
Snapshot 2 (5 projects): QmXxxx...
Snapshot 3 (6 projects): QmYyyy...
```

All are accessible forever!

---

## Admin Dashboard Behavior

### What It Does

1. **Fetches latest hash** from backend
2. **Fetches data** from IPFS using that hash
3. **Falls back** to database if IPFS fails
4. **Auto-refreshes** every 10 seconds

### Console Output

**When loading**:
```
🔍 Checking for IPFS snapshot...
📦 Found IPFS hash: QmXxxx...
📦 Fetching from IPFS: QmXxxx...
✅ Loaded 5 projects from IPFS
📦 Current IPFS Hash: QmXxxx...
🔗 Gateway URL: https://gateway.pinata.cloud/ipfs/QmXxxx...
```

**Data source indicator**:
```
Loaded 5 projects from IPFS  ← Using IPFS
Loaded 5 projects from Database  ← Using DB fallback
```

---

## Troubleshooting

### Issue: Gateway shows old data

**Cause**: You're looking at an old hash

**Solution**:
1. Check `backend/data/latest-snapshot.json` for current hash
2. Use that hash in gateway URL
3. Or use admin dashboard (automatically uses latest)

### Issue: Admin dashboard shows old data

**Cause**: Auto-sync didn't trigger or failed

**Solution**:
1. Click "Refresh" button in admin dashboard
2. Check backend logs for sync messages
3. Verify Pinata connection: `node diagnose-pinata.js`

### Issue: New hash not created

**Cause**: Auto-sync failed

**Check**:
```bash
# Backend logs should show:
🔄 Auto-syncing new project to IPFS...
✅ Registry snapshot created: QmXxxx...
```

**Fix**:
1. Check Pinata connection
2. Check internet connection
3. Manually trigger: Click "Refresh" in admin dashboard

### Issue: Can't access gateway URL

**Try alternative gateways**:
```
https://ipfs.io/ipfs/YOUR_HASH
https://cloudflare-ipfs.com/ipfs/YOUR_HASH
https://dweb.link/ipfs/YOUR_HASH
```

---

## Best Practices

### For Development

1. **Use admin dashboard** - Always shows latest data
2. **Check console** - Shows current IPFS hash
3. **Monitor backend logs** - Confirms sync success

### For Production

1. **Monitor sync success** - Check logs regularly
2. **Verify hashes** - Ensure new hashes created
3. **Test gateways** - Ensure accessibility
4. **Keep history** - Old hashes are valuable

### For Users

1. **Admin dashboard** - Primary interface
2. **Auto-refresh** - No manual action needed
3. **Refresh button** - Force update if needed

---

## Quick Commands

### Get current IPFS hash
```bash
type backend\data\latest-snapshot.json
```

### View current data on IPFS
```bash
# Copy hash from above, then:
start https://gateway.pinata.cloud/ipfs/HASH_HERE
```

### Check all IPFS uploads
```
Open: https://app.pinata.cloud/pinmanager
```

### Test IPFS sync
```bash
cd backend
node test-ipfs-sync.js
```

### Force new snapshot
```bash
# In admin dashboard, click "Refresh" button
# Or via API:
curl -X POST http://localhost:5000/api/admin/sync-ipfs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Summary

### Key Points

1. **Each update = New hash** - This is normal IPFS behavior
2. **Old URLs = Old data** - By design, immutable
3. **Admin dashboard = Latest data** - Automatically fetches latest hash
4. **Check latest-snapshot.json** - Shows current hash
5. **All versions preserved** - Nothing is lost

### How to See Latest Data

✅ **Best**: Use admin dashboard (auto-updates)
✅ **Good**: Check latest-snapshot.json for current hash
✅ **Manual**: Copy hash and view in gateway

### What NOT to Do

❌ Bookmark a specific gateway URL (it won't update)
❌ Expect old hash to show new data (impossible)
❌ Manually track hashes (admin dashboard does this)

---

## Example Workflow

### User Submits Project

```
1. User submits → MongoDB saves
2. Auto-sync triggers
3. New snapshot created
4. New hash: QmNEW123...
5. Saved to latest-snapshot.json
```

### Admin Views Data

```
1. Admin opens dashboard
2. Dashboard reads latest-snapshot.json
3. Gets hash: QmNEW123...
4. Fetches from: gateway.pinata.cloud/ipfs/QmNEW123...
5. Displays new data
```

### Viewing in Browser

```
1. Check: type backend\data\latest-snapshot.json
2. Copy: ipfsHash value
3. Open: https://gateway.pinata.cloud/ipfs/COPIED_HASH
4. See: Latest data with all projects
```

---

**Remember**: IPFS hashes are like snapshots in time. Each change creates a new snapshot with a new hash. The admin dashboard automatically uses the latest snapshot!

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
